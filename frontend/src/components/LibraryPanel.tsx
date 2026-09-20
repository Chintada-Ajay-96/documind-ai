// LibraryPanel.tsx
// Layer: component. The left column: add PDFs (drag or choose) and see what you added.

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import type { UploadProgress } from "../hooks/useDocuments";
import type { LibraryDocument } from "../types/api";

interface LibraryPanelProps {
  documents: LibraryDocument[];
  chunkCount: number | null;
  progress: UploadProgress | null;
  errors: string[];
  onFiles: (files: File[]) => void;
  onDismissErrors: () => void;
}

export function LibraryPanel({
  documents,
  chunkCount,
  progress,
  errors,
  onFiles,
  onDismissErrors,
}: LibraryPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const busy = progress !== null;

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault(); // needed so the browser allows dropping
    if (!busy) setDragging(true);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (busy) return;

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) onFiles(files);
  }

  function handleChoose(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = ""; // lets you choose the same file again later
    if (files.length > 0) onFiles(files);
  }

  const zoneClass = `dropzone${dragging ? " dropzone-active" : ""}${busy ? " dropzone-busy" : ""}`;

  return (
    <aside className="library" aria-label="Library">
      <h2 className="panel-title">Library</h2>

      <div
        className={zoneClass}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {progress ? (
          <div role="status">
            <p className="dropzone-title">
              Indexing {progress.current} of {progress.total}
            </p>
            <p className="dropzone-hint">{progress.fileName}</p>
            <div className="progress-bar" aria-hidden="true" />
            <p className="dropzone-hint" style={{ marginTop: 12 }}>
              Large files can take a minute or two.
            </p>
          </div>
        ) : (
          <>
            <p className="dropzone-title">Add PDFs</p>
            <p className="dropzone-hint">
              Drag files here, or choose them from your computer. Text-based PDFs only.
            </p>
            <button
              type="button"
              className="dropzone-button"
              onClick={() => inputRef.current?.click()}
            >
              Choose files
            </button>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          hidden
          onChange={handleChoose}
        />
      </div>

      {errors.length > 0 && (
        <div className="library-errors" role="alert">
          <ul>
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
          <button type="button" onClick={onDismissErrors}>
            Dismiss
          </button>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="library-empty">No documents added from this browser yet.</p>
      ) : (
        <ul className="doc-list">
          {documents.map((doc) => (
            <li key={doc.documentId} className="doc">
              <span className="doc-name">{doc.documentName}</span>
              <span className="doc-meta">
                {doc.pageCount} pages, {doc.chunkCount} passages
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="library-footer">
        {chunkCount === null ? "Index not reachable" : `${chunkCount} passages indexed in total`}
      </p>
    </aside>
  );
}