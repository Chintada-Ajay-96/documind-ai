# models.py
# Describes the "shape" of the data that moves between layers.

from dataclasses import dataclass


@dataclass
class PageText:
    """The text of one PDF page."""
    page_number: int   # starts at 1, like the page numbers people see
    text: str


@dataclass
class Chunk:
    """One small piece of text, ready to be stored in the database."""
    page_number: int   # which page this chunk came from (used for citations)
    chunk_index: int   # running number of the chunk within the whole document
    text: str