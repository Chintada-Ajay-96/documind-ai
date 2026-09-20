// AnswerText.tsx
// Layer: component. Shows the answer text.
// [S1] becomes a highlighted number, `code` gets a code style,
// and blank lines become separate paragraphs.

const TOKEN = /(\[S\d+\]|`[^`\n]+`)/g;

function renderLine(line: string) {
  return line.split(TOKEN).map((part, index) => {
    const citation = part.match(/^\[S(\d+)\]$/);
    if (citation) {
      return (
        <sup key={index} className="cite">
          {citation[1]}
        </sup>
      );
    }

    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }

    return part;
  });
}

export function AnswerText({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== "");

  return (
    <div className="answer-text">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{renderLine(paragraph)}</p>
      ))}
    </div>
  );
}