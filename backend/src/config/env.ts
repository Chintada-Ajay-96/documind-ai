// env.ts
// Layer: config. Reads your .env file and exposes the settings.
// If a required setting is missing, the server refuses to start
// and tells you exactly what to fix (this is called "failing fast").

import dotenv from "dotenv";
import path from "node:path";

// The project root is three folders up from here (backend/src/config -> documind-ai)
const projectRoot = path.resolve(__dirname, "../../..");

dotenv.config({ path: path.join(projectRoot, ".env") });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required setting "${name}". Add it to your .env file.`);
  }
  return value.trim();
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  geminiApiKey: requireEnv("GEMINI_API_KEY"),
  weaviateUrl: requireEnv("WEAVIATE_URL"),
  weaviateApiKey: requireEnv("WEAVIATE_API_KEY"),

  // "python" works on most setups. If you had to use "py" earlier,
  // add the line PYTHON_COMMAND=py to your .env file.
  pythonCommand: process.env.PYTHON_COMMAND?.trim() || "python",
  processorScript: path.join(projectRoot, "processing", "main.py"),

  // Where uploaded PDFs are saved on your computer
  uploadDir: path.join(projectRoot, "storage", "uploads"),

  // Embedding settings
  embeddingModel: "gemini-embedding-2",
  embeddingDimensions: 768,   // size of each vector (Google recommends 768, 1536 or 3072)
  embeddingBatchSize: 25,     // how many chunks we embed per request

  // Weaviate settings
  chunkCollectionName: "DocumentChunk",

  // Answer generation settings
  generationModel: "gemini-3.8-flash",

  // Retrieval settings
  retrievalTopK: 5,           // how many chunks we send to the AI (this is "K")
  hybridAlpha: 0.5,           // 0 = keyword search only, 1 = meaning search only, 0.5 = equal mix
  maxQuestionLength: 1000,
};