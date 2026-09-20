// useDocuments.ts
// Layer: hook (logic and state). Handles adding PDFs and remembers your library.
// The list is saved in this browser (localStorage), so it survives a page refresh.

import { useCallback, useEffect, useState } from "react";

import { uploadDocument } from "../api/client";
import type { LibraryDocument } from "../types/api";

const STORAGE_KEY = "documind.library";
const MAX_BYTES = 50 * 1024 * 1024; // same limit as the backend: 50 MB

export interface UploadProgress {
  current: number;
  total: number;
  fileName: string;
}

function loadDocuments(): LibraryDocument[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as LibraryDocument[]) : [];
  } catch {
    return [];
  }
}

function saveDocuments(documents: LibraryDocument[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch {
    // If the browser blocks storage, the list simply won't be remembered.
  }
}

export function useDocuments() {
  const [documents, setDocuments] = useState<LibraryDocument[]>(loadDocuments);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  const addFiles = useCallback(async (files: File[]) => {
    const problems: string[] = [];
    const valid: File[] = [];

    // Check files in the browser first, so obvious mistakes never reach the backend
    for (const file of files) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        problems.push(`${file.name}: only PDF files are supported.`);
      } else if (file.size > MAX_BYTES) {
        problems.push(`${file.name}: this file is larger than 50 MB.`);
      } else {
        valid.push(file);
      }
    }
    setErrors([...problems]);

    // Upload one file at a time
    for (let index = 0; index < valid.length; index++) {
      const file = valid[index];
      setProgress({ current: index + 1, total: valid.length, fileName: file.name });

      try {
        const result = await uploadDocument(file);
        const added: LibraryDocument = {
          documentId: result.documentId,
          documentName: result.documentName,
          pageCount: result.pageCount,
          chunkCount: result.storedChunks,
        };
        setDocuments((previous) => [added, ...previous]);
      } catch (error) {
        const message = error instanceof Error ? error.message : "the upload failed.";
        problems.push(`${file.name}: ${message}`);
        setErrors([...problems]);
      }
    }

    setProgress(null);
  }, []);

  const clearErrors = useCallback(() => setErrors([]), []);

  return { documents, progress, errors, addFiles, clearErrors };
}