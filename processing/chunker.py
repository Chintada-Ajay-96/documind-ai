# chunker.py
# Layer: text splitting.
# Knows nothing about PDFs. It only turns text into overlapping pieces.

from models import Chunk, PageText


def split_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    """Cut one long text into overlapping pieces, avoiding cuts in the middle of a word."""
    if overlap >= chunk_size // 2:
        raise ValueError("overlap must be smaller than half of chunk_size")

    text = text.strip()
    pieces: list[str] = []
    start = 0

    while start < len(text):
        end = min(start + chunk_size, len(text))

        # If we are not at the very end, try to cut at a line break or a space
        if end < len(text):
            halfway = start + chunk_size // 2
            best_cut = max(text.rfind("\n", halfway, end), text.rfind(" ", halfway, end))
            if best_cut != -1:
                end = best_cut

        piece = text[start:end].strip()
        if piece:
            pieces.append(piece)

        if end >= len(text):
            break

        # Step back a little so the next chunk repeats the last few characters
        start = end - overlap

    return pieces


def chunk_pages(pages: list[PageText], chunk_size: int, overlap: int) -> list[Chunk]:
    """Chunk every page. Each chunk remembers its page number."""
    chunks: list[Chunk] = []
    chunk_index = 0

    for page in pages:
        for piece in split_text(page.text, chunk_size, overlap):
            chunks.append(
                Chunk(page_number=page.page_number, chunk_index=chunk_index, text=piece)
            )
            chunk_index += 1

    return chunks