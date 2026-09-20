// api.ts
// The shapes of the data our backend sends us.

export interface HealthReport {
  status: "ok" | "degraded";
  service: string;
  time: string;
  database: {
    connected: boolean;
    chunkCount?: number;
  };
}

// What the backend replies after a PDF is uploaded
export interface UploadedDocument {
  documentId: string;
  documentName: string;
  pageCount: number;
  chunkCount: number;
  storedChunks: number;
  firstChunkPreview: string;
}

// What we keep in the Library list
export interface LibraryDocument {
  documentId: string;
  documentName: string;
  pageCount: number;
  chunkCount: number;
}

export interface AnswerSource {
  label: string;
  document: string;
  page: number;
  excerpt: string;
}

export interface AskResponse {
  answer: string;
  sources: AnswerSource[];
}