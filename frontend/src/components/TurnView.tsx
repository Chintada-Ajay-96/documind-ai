// TurnView.tsx
// Layer: component. One question with its answer.
// It has four looks: searching, error, "not found", and a real answer with margin notes.

import type { Turn } from "../hooks/useConversation";
import type { AskResponse } from "../types/api";
import { AnswerText } from "./AnswerText";
import { SourceNote } from "./SourceNote";

function ResponseView({ response }: { response: AskResponse }) {
  // No sources means the documents did not contain the answer
  if (response.sources.length === 0) {
    return (
      <div className="not-found">
        <p className="not-found-title">{response.answer}</p>
        <p className="not-found-hint">
          Try using words that appear in the document, or add the PDF that covers this topic.
        </p>
      </div>
    );
  }

  return (
    <div className="answer">
      <AnswerText text={response.answer} />
      <ol className="notes">
        {response.sources.map((source) => (
          <SourceNote key={source.label} source={source} />
        ))}
      </ol>
    </div>
  );
}

export function TurnView({ turn }: { turn: Turn }) {
  return (
    <article className="turn">
      <h2 className="turn-question">{turn.question}</h2>

      {turn.status === "loading" && (
        <div className="searching" role="status">
          <span className="searching-mark" aria-hidden="true" />
          Searching your documents…
        </div>
      )}

      {turn.status === "error" && (
        <p className="turn-error" role="alert">
          {turn.error}
        </p>
      )}

      {turn.status === "done" && turn.response && <ResponseView response={turn.response} />}
    </article>
  );
}