// ask.service.ts
// Layer: service (the head chef). Runs the two steps in order.
// This file is the whole RAG idea in a few lines:
//   question -> retrieve chunks -> generate answer from those chunks.

import type { AskResponse } from "../types/ask.types";
import { generateAnswer, NOT_FOUND_ANSWER } from "./generation.service";
import { retrieveRelevantChunks } from "./retrieval.service";

export async function askQuestion(question: string): Promise<AskResponse> {
  const chunks = await retrieveRelevantChunks(question);

  // Nothing stored at all? Don't even bother the AI.
  if (chunks.length === 0) {
    return { answer: NOT_FOUND_ANSWER, sources: [] };
  }

  return generateAnswer(question, chunks);
}