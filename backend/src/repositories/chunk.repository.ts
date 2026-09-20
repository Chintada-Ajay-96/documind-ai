// chunk.repository.ts
// Layer: repository (the filing clerk).
// Knows what a stored chunk looks like, how to save it in Weaviate,
// and how to search for chunks.

import { vectors } from "weaviate-client";

import { getWeaviateClient } from "../clients/weaviate.client";
import { env } from "../config/env";
import type { RetrievedChunk } from "../types/ask.types";
import type { ChunkRecord } from "../types/chunk.types";

// The text fields stored next to each vector
type ChunkProperties = {
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
};

const INSERT_BATCH_SIZE = 100;

async function getCollection() {
  const client = await getWeaviateClient();
  return client.collections.use(env.chunkCollectionName);
}

// Creates the collection (like a table) the first time. Does nothing if it already exists.
export async function ensureChunkCollection(): Promise<void> {
  const client = await getWeaviateClient();
  const exists = await client.collections.exists(env.chunkCollectionName);

  if (exists) {
    return;
  }

  await client.collections.create({
    name: env.chunkCollectionName,
    // "selfProvided" = we bring our own vectors (from Gemini). Weaviate should not create any.
    vectorizers: vectors.selfProvided(),
    properties: [
      { name: "documentId", dataType: "text", tokenization: "field" },
      { name: "documentName", dataType: "text" },
      { name: "pageNumber", dataType: "int" },
      { name: "chunkIndex", dataType: "int" },
      { name: "text", dataType: "text" },
    ],
  });
}

// Saves chunks together with their vectors. Returns how many were saved.
export async function saveChunks(chunks: ChunkRecord[]): Promise<number> {
  const collection = await getCollection();
  let savedCount = 0;

  for (let start = 0; start < chunks.length; start += INSERT_BATCH_SIZE) {
    const batch = chunks.slice(start, start + INSERT_BATCH_SIZE).map((chunk) => ({
      properties: {
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        pageNumber: chunk.pageNumber,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
      },
      vectors: chunk.embedding,
    }));

    const result = await collection.data.insertMany(batch);

    if (result.hasErrors) {
      const errorList = Object.values(result.errors);
      throw new Error(
        `Weaviate rejected ${errorList.length} chunk(s). First error: ${errorList[0]?.message}`
      );
    }

    savedCount += batch.length;
  }

  return savedCount;
}

// How many chunks are stored in total (used by the health check).
export async function countChunks(): Promise<number> {
  const collection = await getCollection();
  const result = await collection.aggregate.overAll();
  return result.totalCount;
}

// HYBRID SEARCH: vector similarity (meaning) + BM25 (exact words), blended by "alpha".
export async function hybridSearch(
  queryText: string,
  queryVector: number[],
  limit: number
): Promise<RetrievedChunk[]> {
  const collection = await getCollection();

  const result = await collection.query.hybrid(queryText, {
    vector: queryVector,          // the meaning part of the search
    alpha: env.hybridAlpha,       // how to blend meaning and keywords
    limit,                        // top K results
    queryProperties: ["text"],    // keyword search looks only inside the chunk text
    returnMetadata: ["score"],
  });

  return result.objects.map((object) => {
    const properties = object.properties as unknown as ChunkProperties;

    return {
      documentId: properties.documentId,
      documentName: properties.documentName,
      pageNumber: properties.pageNumber,
      chunkIndex: properties.chunkIndex,
      text: properties.text,
      score: object.metadata?.score ?? 0,
    };
  });
}