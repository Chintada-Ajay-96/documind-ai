// SourceNote.tsx
// Layer: component. One margin note: document, page, and a button
// that reveals the exact passage the answer relied on.

import { useState } from "react";

import type { AnswerSource } from "../types/api";

export function SourceNote({ source }: { source: AnswerSource }) {
  const [open, setOpen] = useState(false);
  const number = source.label.replace(/^S/, "");

  return (
    <li className="note">
      <span className="note-mark">{number}</span>
      <div>
        <div className="note-source">{source.document}</div>
        <div className="note-page">Page {source.page}</div>

        {source.excerpt && (
          <>
            <button
              type="button"
              className="note-toggle"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? "Hide passage" : "Show passage"}
            </button>
            {open && <blockquote className="note-excerpt">{source.excerpt}</blockquote>}
          </>
        )}
      </div>
    </li>
  );
}