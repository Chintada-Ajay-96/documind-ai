# extractor.py
# Layer: PDF reading.
# The ONLY file that knows about PyMuPDF. If we ever change the PDF
# library, this is the only file we need to edit.

import pymupdf

from models import PageText


def extract_pages(pdf_path: str) -> list[PageText]:
    """Open a PDF and return the text of every page, keeping page numbers."""
    pages: list[PageText] = []

    with pymupdf.open(pdf_path) as document:
        for index, page in enumerate(document):
            text = page.get_text("text").replace("\x00", "").strip()
            pages.append(PageText(page_number=index + 1, text=text))

    return pages
