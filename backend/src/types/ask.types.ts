// ask.types.ts
// The shapes of data used when answering a question.

// One chunk found by the search, with the score Weaviate gave it
export interface RetrievedChunk {
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  score: number;
}

// One source shown to the user under the answer
export interface AnswerSource {
  label: string;     // "S1", "S2"... the same label used inside the answer text
  document: string;
  page: number;
  excerpt: string;   // a short piece of the passage, so the user can check it
}

// What the /api/ask endpoint returns
export interface AskResponse {
  answer: string;
  sources: AnswerSource[];
}