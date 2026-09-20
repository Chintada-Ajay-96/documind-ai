# pipeline.py
# Layer: coordinator.
# Calls the other layers in order: extract -> chunk -> build result.
# It does no PDF reading or text cutting itself.

from chunker import chunk_pages
from config import CHUNK_OVERLAP, CHUNK_SIZE
from extractor import extract_pages


def process_pdf(pdf_path: str) -> dict:
    pages = extract_pages(pdf_path)
    chunks = chunk_pages(pages, CHUNK_SIZE, CHUNK_OVERLAP)

    if not chunks:
        raise ValueError(
            "No readable text found in this PDF. "
            "It may be a scanned document (OCR is not supported in this MVP)."
        )

    return {
        "pageCount": len(pages),
        "chunks": [
            {
                "pageNumber": chunk.page_number,
                "chunkIndex": chunk.chunk_index,
                "text": chunk.text,
            }
            for chunk in chunks
        ],
    }