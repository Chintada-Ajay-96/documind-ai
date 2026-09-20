// health.service.ts
// Layer: service. Builds the health report, including a check of the database.

import { countChunks } from "../repositories/chunk.repository";

export async function getHealthReport() {
  let database: { connected: boolean; chunkCount?: number };

  try {
    database = { connected: true, chunkCount: await countChunks() };
  } catch {
    database = { connected: false };
  }

  return {
    status: database.connected ? "ok" : "degraded",
    service: "documind-backend",
    time: new Date().toISOString(),
    database,
  };
}