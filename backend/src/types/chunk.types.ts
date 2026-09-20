// chunk.types.ts
// What one stored chunk looks like. This matches the data model in the project spec.

export interface ChunkRecord {
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  embedding: number[];
}