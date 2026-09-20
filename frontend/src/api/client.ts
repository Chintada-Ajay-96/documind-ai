// client.ts
// Layer: api. The ONLY file that talks to the backend.
// If the backend address ever changes, this is the only place to edit.

import type { AskResponse, HealthReport, UploadedDocument } from "../types/api";

const API_BASE: string = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

// Sends a request and turns problems into readable messages.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, options);
  } catch {
    throw new Error("Cannot reach the backend. Check that it is running.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? `Request failed (status ${response.status}).`);
  }

  return data as T;
}

export function getHealth(): Promise<HealthReport> {
  return request<HealthReport>("/health");
}

export function uploadDocument(file: File): Promise<UploadedDocument> {
  const form = new FormData();
  form.append("file", file); // the backend expects the field to be named "file"

  return request<UploadedDocument>("/documents", { method: "POST", body: form });
}

export function askQuestion(question: string): Promise<AskResponse> {
  return request<AskResponse>("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
}