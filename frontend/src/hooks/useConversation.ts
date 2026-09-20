// useConversation.ts
// Layer: hook (logic and state). Keeps the list of questions and their answers.
// Each question is independent (no chat memory), matching the project scope.

import { useCallback, useRef, useState } from "react";

import { askQuestion } from "../api/client";
import type { AskResponse } from "../types/api";

export interface Turn {
  id: number;
  question: string;
  status: "loading" | "done" | "error";
  response?: AskResponse;
  error?: string;
}

// Returns a copy of the list where the turn with this id has been updated
function patchTurn(turns: Turn[], id: number, changes: Partial<Turn>): Turn[] {
  return turns.map((turn) => (turn.id === id ? { ...turn, ...changes } : turn));
}

export function useConversation() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const counter = useRef(0);

  const ask = useCallback(async (question: string) => {
    counter.current += 1;
    const id = counter.current;

    setTurns((previous) => [...previous, { id, question, status: "loading" }]);

    try {
      const response = await askQuestion(question);
      setTurns((previous) => patchTurn(previous, id, { status: "done", response }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setTurns((previous) => patchTurn(previous, id, { status: "error", error: message }));
    }
  }, []);

  const isAsking = turns.some((turn) => turn.status === "loading");

  return { turns, ask, isAsking };
}