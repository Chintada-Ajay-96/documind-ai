// embedding.service.ts
// Layer: service. Decides HOW text is prepared before it is embedded.

import { embedTexts } from "../clients/gemini.client";
import { env } from "../config/env";
import type { ProcessedChunk } from "../types/document.types";

// gemini-embedding-2 wants a small label on the text instead of a "task type" setting.
function formatDocumentText(title: string, text: string): string {
  return `title: ${title} | text: ${text}`;
}

function formatQuestionText(question: string): string {
  return `task: question answering | query: ${question}`;
}

// Embeds all chunks of one document, a few at a time. Returns one vector per chunk, same order.
export async function embedDocumentChunks(
  documentName: string,
  chunks: ProcessedChunk[]
): Promise<number[][]> {
  const allVectors: number[][] = [];

  for (let start = 0; start < chunks.length; start += env.embeddingBatchSize) {
    const batch = chunks.slice(start, start + env.embeddingBatchSize);
    const batchVectors = await embedTexts(
      batch.map((chunk) => formatDocumentText(documentName, chunk.text))
    );

    allVectors.push(...batchVectors);
    console.log(`Embedded ${allVectors.length}/${chunks.length} chunks`);
  }

  return allVectors;
}

// Not used yet. We will use it in 4D to embed the user's question.
export async function embedQuestion(question: string): Promise<number[]> {
  const [vector] = await embedTexts([formatQuestionText(question)]);
  return vector;
}