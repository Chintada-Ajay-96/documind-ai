// EmptyState.tsx
// Layer: component. What you see before any question is asked:
// what DocuMind does, and an example of how an answer looks.

function Cite({ n }: { n: number }) {
  return <sup className="cite">{n}</sup>;
}

export function EmptyState() {
  return (
    <div className="empty">
      <h1 className="empty-title">Ask a question. See the page it came from.</h1>

      <p className="empty-lead">
        DocuMind answers only from the PDFs you add, and shows the document and page behind
        every statement. If the answer isn't in your documents, it says so.
      </p>

      <figure className="example">
        <p className="example-question">What causes a page fault?</p>

        <div className="answer">
          <p className="answer-text">
            A page fault happens when a program touches a memory page that is not currently
            loaded in RAM.
            <Cite n={1} /> The operating system pauses the program, reads the page from disk,
            and then resumes it.
            <Cite n={2} />
          </p>

          <ol className="notes">
            <li className="note">
              <span className="note-mark">1</span>
              <div>
                <div className="note-source">Operating_Systems.pdf</div>
                <div className="note-page">Page 42</div>
              </div>
            </li>
            <li className="note">
              <span className="note-mark">2</span>
              <div>
                <div className="note-source">Operating_Systems.pdf</div>
                <div className="note-page">Page 43</div>
              </div>
            </li>
          </ol>
        </div>

        <figcaption className="example-caption">
          An example answer. Yours will cite your own documents.
        </figcaption>
      </figure>
    </div>
  );
}