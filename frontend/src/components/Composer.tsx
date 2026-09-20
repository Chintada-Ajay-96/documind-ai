// Composer.tsx
// Layer: component. The box where you type a question.
// Enter sends. Shift + Enter starts a new line.

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

interface ComposerProps {
  disabled: boolean;
  busy: boolean;
  placeholder: string;
  onSubmit: (question: string) => void;
}

export function Composer({ disabled, busy, placeholder, onSubmit }: ComposerProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Make the box grow as you type, up to a limit
  useEffect(() => {
    const box = inputRef.current;
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${Math.min(box.scrollHeight, 168)}px`;
  }, [value]);

  function submit() {
    const question = value.trim();
    if (question === "" || disabled || busy) return;

    onSubmit(question);
    setValue("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <label htmlFor="question" className="visually-hidden">
        Your question
      </label>
      <textarea
        id="question"
        ref={inputRef}
        className="composer-input"
        rows={1}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="button" disabled={disabled || busy}>
        Ask
      </button>
    </form>
  );
}