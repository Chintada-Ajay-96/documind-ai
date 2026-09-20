// gemini.client.ts
// Layer: client. The only file that talks to Google's Gemini API.
// It does two jobs: create embeddings, and generate text.

import { GoogleGenAI } from "@google/genai";

import { env } from "../config/env";

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// If Google says "too many requests" (429) or is briefly busy (500/503),
// wait a little and try again instead of failing right away.
async function withRetry<T>(task: () => Promise<T>, maxAttempts = 5): Promise<T> {
  let delayMs = 2000;

  for (let attempt = 1; ; attempt++) {
    try {
      return await task();
    } catch (error) {
      const status = (error as { status?: number }).status;
      const canRetry = status === 429 || status === 500 || status === 503;

      if (!canRetry || attempt >= maxAttempts) {
        throw error;
      }

      console.log(`Gemini is busy (status ${status}). Waiting ${delayMs / 1000}s, then retrying...`);
      await sleep(delayMs);
      delayMs *= 2;
    }
  }
}

// Turns a list of texts into a list of vectors (one vector per text, same order).
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const response = await withRetry(() =>
    ai.models.embedContent({
      model: env.embeddingModel,
      // One { parts: [...] } object per text makes Gemini return one SEPARATE embedding per text.
      // (A plain list of strings would be merged into a single embedding.)
      contents: texts.map((text) => ({ parts: [{ text }] })),
      config: { outputDimensionality: env.embeddingDimensions },
    })
  );

  const embeddings = response.embeddings ?? [];

  if (embeddings.length !== texts.length) {
    throw new Error(`Gemini returned ${embeddings.length} embeddings for ${texts.length} texts.`);
  }

  return embeddings.map((embedding) => {
    if (!embedding.values) {
      throw new Error("Gemini returned an empty embedding.");
    }
    return embedding.values;
  });
}

// Sends a prompt to Gemini and returns its text answer.
// "systemInstruction" holds the rules the model must follow.
export async function generateText(systemInstruction: string, prompt: string): Promise<string> {
  const response = await withRetry(() =>
    ai.models.generateContent({
      model: env.generationModel,
      contents: prompt,
      config: { systemInstruction },
    })
  );

  return (response.text ?? "").trim();
}