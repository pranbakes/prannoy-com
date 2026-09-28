export type PoemInlineNode = {
  text?: string;
  bold?: true;
  italic?: true;
};

export type PoemStanza = {
  children: PoemInlineNode[];
};

/**
 * A stanza's children come from Keystatic as a flat run of inline nodes,
 * with authorial line breaks (Shift+Enter in the editor) represented as
 * literal "\n" characters embedded in a text node's own `text` field —
 * not as separate nodes. This splits that run into one array per line,
 * preserving marks (bold/italic) on each split segment.
 */
export function splitStanzaIntoLines(
  children: PoemInlineNode[]
): PoemInlineNode[][] {
  const lines: PoemInlineNode[][] = [[]];
  for (const node of children) {
    if (typeof node.text === "string" && node.text.includes("\n")) {
      const segments = node.text.split("\n");
      segments.forEach((segment, i) => {
        if (i > 0) lines.push([]);
        if (segment.length > 0) {
          lines[lines.length - 1].push({ ...node, text: segment });
        }
      });
    } else {
      lines[lines.length - 1].push(node);
    }
  }
  return lines;
}
