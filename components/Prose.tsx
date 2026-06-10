/** Renders text with blank-line paragraphs and ALL-CAPS lines as subheadings. */
export function Prose({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.split("\n").map((l) => l.trim());
  const blocks: { type: "h" | "p"; text: string }[] = [];
  let buf: string[] = [];
  const flush = () => {
    if (buf.length) {
      blocks.push({ type: "p", text: buf.join(" ") });
      buf = [];
    }
  };
  for (const line of lines) {
    if (!line) {
      flush();
      continue;
    }
    const letters = line.replace(/[^a-zA-Z]/g, "");
    const isHeading =
      line.length < 60 &&
      letters.length > 2 &&
      line === line.toUpperCase();
    if (isHeading) {
      flush();
      blocks.push({ type: "h", text: line });
    } else {
      buf.push(line);
    }
  }
  flush();

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((b, i) =>
        b.type === "h" ? (
          <h3
            key={i}
            className="pt-2 font-display text-lg font-medium tracking-wide text-ink"
          >
            {b.text}
          </h3>
        ) : (
          <p key={i} className="leading-relaxed text-muted">
            {b.text}
          </p>
        )
      )}
    </div>
  );
}
