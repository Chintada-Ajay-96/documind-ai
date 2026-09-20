// weaviate.client.ts
// Layer: client. The only file that knows how to CONNECT to Weaviate.
// It connects once and re-uses the same connection afterwards.

import weaviate, { WeaviateClient } from "weaviate-client";

import { env } from "../config/env";

let clientPromise: Promise<WeaviateClient> | null = null;

export function getWeaviateClient(): Promise<WeaviateClient> {
  if (!clientPromise) {
    const attempt = weaviate.connectToWeaviateCloud(env.weaviateUrl, {
      authCredentials: new weaviate.ApiKey(env.weaviateApiKey),
    });

    // If connecting fails, forget the attempt so the next call can try again
    attempt.catch(() => {
      clientPromise = null;
    });

    clientPromise = attempt;
  }

  return clientPromise;
}