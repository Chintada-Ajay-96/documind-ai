// document.types.ts
// Describes the shape of the data moving between layers.

// One chunk, exactly as the Python program produces it
export interface ProcessedChunk {
  pageNumber: number;
  chunkIndex: number;
  text: string;
}

// The full answer of the Python program
export interface ProcessedPdf {
  pageCount: number;
  chunks: ProcessedChunk[];
}

// What we send back to the user after an upload
export interface UploadSummary {
  documentId: string;
  documentName: string;
  pageCount: number;
  chunkCount: number;
  storedChunks: number;
  firstChunkPreview: string;
}