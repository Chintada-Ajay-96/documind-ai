// server.ts
// Layer: entry point. The only file that actually starts the server.
// Before opening, it connects to Weaviate and makes sure our collection exists.
// If that fails, the server stops with a clear message instead of failing later.

import { createApp } from "./app";
import { env } from "./config/env";
import { ensureChunkCollection } from "./repositories/chunk.repository";

async function main(): Promise<void> {
  await ensureChunkCollection();
  console.log("Connected to Weaviate. The chunk collection is ready.");

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`DocuMind backend running at http://localhost:${env.port}`);
  });
}

main().catch((error) => {
  console.error("Could not start the server:", error);
  process.exit(1);
});