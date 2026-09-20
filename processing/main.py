# main.py
# Layer: entry point.
# Receives a PDF path from the outside world and prints the result.
#
#   python processing/main.py samples/test.pdf            -> prints full JSON (for the backend)
#   python processing/main.py samples/test.pdf --preview  -> prints a short readable summary (for you)

import json
import sys

from pipeline import process_pdf


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")

    arguments = sys.argv[1:]
    preview = "--preview" in arguments
    paths = [arg for arg in arguments if arg != "--preview"]

    if len(paths) != 1:
        print("Usage: python processing/main.py <path-to-pdf> [--preview]", file=sys.stderr)
        sys.exit(2)

    try:
        result = process_pdf(paths[0])
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)

    if preview:
        first = result["chunks"][0]
        print(f"Pages:  {result['pageCount']}")
        print(f"Chunks: {len(result['chunks'])}")
        print(f"--- First chunk (page {first['pageNumber']}) ---")
        print(first["text"][:500])
    else:
        print(json.dumps(result))


if __name__ == "__main__":
    main()