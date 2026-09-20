// App.tsx
// Puts the pieces together and connects the hooks (logic) to the components (visuals).

import { useEffect, useRef } from "react";

import "./App.css";
import "./Answers.css";
import { Composer } from "./components/Composer";
import { EmptyState } from "./components/EmptyState";
import { Header } from "./components/Header";
import { LibraryPanel } from "./components/LibraryPanel";
import { TurnView } from "./components/TurnView";
import { useBackendStatus } from "./hooks/useBackendStatus";
import { useConversation } from "./hooks/useConversation";
import { useDocuments } from "./hooks/useDocuments";

export default function App() {
  const { status, refresh } = useBackendStatus();
  const { documents, progress, errors, addFiles, clearErrors } = useDocuments();
  const { turns, ask, isAsking } = useConversation();
  const endRef = useRef<HTMLDivElement>(null);

  // Scroll to the newest question or answer
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  // After files are indexed, refresh the passage count
  async function handleFiles(files: File[]) {
    await addFiles(files);
    await refresh();
  }

  const ready = status.state === "online" && status.report.database.connected;
  const chunkCount = ready ? (status.report.database.chunkCount ?? null) : null;
  const canAsk = ready && (documents.length > 0 || (chunkCount ?? 0) > 0);

  let placeholder = "Ask a question about your documents";
  if (status.state === "offline") {
    placeholder = "The backend is offline. Start it to ask questions";
  } else if (status.state === "connecting") {
    placeholder = "Connecting to the backend";
  } else if (!canAsk) {
    placeholder = "Add a PDF to start asking questions";
  }

  return (
    <div className="app">
      <Header status={status} />

      <div className="workspace">
        <LibraryPanel
          documents={documents}
          chunkCount={chunkCount}
          progress={progress}
          errors={errors}
          onFiles={handleFiles}
          onDismissErrors={clearErrors}
        />

        <main className="sheet">
          <div className="sheet-scroll">
            {turns.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="turns">
                {turns.map((turn) => (
                  <TurnView key={turn.id} turn={turn} />
                ))}
                <div ref={endRef} />
              </div>
            )}
          </div>

          <Composer disabled={!canAsk} busy={isAsking} placeholder={placeholder} onSubmit={ask} />
        </main>
      </div>
    </div>
  );
}