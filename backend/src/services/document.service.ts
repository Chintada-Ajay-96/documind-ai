// document.service.ts
// Layer: service (the chef). The real logic lives here.
// Steps: process the PDF -> embed every chunk -> save chunks and vectors.

import path from "node:path";

import { PdfProcessingError, processPdfWithPython } from "../clients/pythonProcessor.client";
import { HttpError } from "../middleware/errorHandler";
import { saveChunks } from "../repositories/chunk.repository";
import type { ChunkRecord } from "../types/chunk.types";
import type { UploadSummary } from "../types/document.types";
import { embedDocumentChunks } from "./embedding.service";

// The only things this service needs to know about an uploaded file
interface StoredUpload {
  path: string;         // where the file was saved on disk
  filename: string;     // the saved name: <documentId>.pdf
  originalname: string; // the name the user's file had, e.g. Operating_Systems.pdf
}

export async function ingestDocument(file: StoredUpload): Promise<UploadSummary> {
  // The saved file name is "<uuid>.pdf", so the uuid becomes our documentId
  const documentId = path.parse(file.filename).name;

  try {
    // Step 1: PDF -> pages -> chunks (Python)
    const processed = await processPdfWithPython(file.path);

    // Step 2: chunks -> vectors (Gemini)
    const vectors = await embedDocumentChunks(file.originalname, processed.chunks);

    // Step 3: chunk + metadata + vector -> Weaviate
    const records: ChunkRecord[] = processed.chunks.map((chunk, index) => ({
      documentId,
      documentName: file.originalname,
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
      embedding: vectors[index],
    }));

    const storedChunks = await saveChunks(records);

    return {
      documentId,
      documentName: file.originalname,
      pageCount: processed.pageCount,
      chunkCount: processed.chunks.length,
      storedChunks,
      firstChunkPreview: processed.chunks[0].text.slice(0, 200),
    };
  } catch (error) {
    if (error instanceof PdfProcessingError) {
      throw new HttpError(422, `Could not process this PDF: ${error.message}`);
    }
    throw error;
  }
}