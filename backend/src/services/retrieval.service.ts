// retrieval.service.ts
// Layer: service. STEP 1 of answering: find the most relevant chunks.

import { env } from "../config/env";
import { hybridSearch } from "../repositories/chunk.repository";
import type { RetrievedChunk } from "../types/ask.types";
import { embedQuestion } from "./embedding.service";

export async function retrieveRelevantChunks(question: string): Promise<RetrievedChunk[]> {
  // Turn the question into a vector, using the same model that embedded the chunks
  const questionVector = await embedQuestion(question);

  // Hybrid search: meaning (vector) + exact words (BM25), top K results
  const chunks = await hybridSearch(question, questionVector, env.retrievalTopK);

  // Print what was found so you can see and explain what the search did
  console.log(`Retrieved ${chunks.length} chunks:`);
  chunks.forEach((chunk, index) => {
    console.log(
      `  S${index + 1}: ${chunk.documentName}, page ${chunk.pageNumber}, score ${chunk.score.toFixed(3)}`
    );
  });

  return chunks;
}