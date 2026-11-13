/**
 * Pulls the human-readable copy out of site files and checks it against
 * the voice rules. No dependencies, so it runs anywhere Node runs: the
 * Claude Code hook, CI, or `npm run voice` on your laptop.
 */
import { RULES, type Rule, type Severity, type Surface } from "./rules.ts";

export type Segment = {
  text: string;
  /** 1-based line in the source file where `text` starts. */
  line: number;
  surface: Surface;
  /** Frontmatter key or "body", for the report. */
  field: string;
};

export type Finding = {
  file: string;
  line: number;
  column: number;
  rule: string;
  severity: Severity;
  match: string;
  context: string;
  message: string;
  surface: Surface;
  field: string;
};

export type AllowEntry = { rule?: string; text: string; file?: string };

/** Poems are judged by ear, not by a linter. */
export function isInScope(relPath: string): boolean {
  const p = relPath.replace(/\\/g, "/");
  if (p.startsWith("content/poems/")) return false;
  if (p.startsWith("content/") && /\.(mdoc|md|yaml|yml)$/.test(p)) return true;
  if (/^src\/(app|components)\/.*\.tsx$/.test(p)) {
    return !p.includes("/keystatic/") && !p.includes("opengraph-image");
  }
  return false;
}

const HEADLINE_KEYS = new Set(["title", "dek", "description", "greeting", "tagline", "kicker"]);
const PROSE_KEYS = new Set([...HEADLINE_KEYS, "forEditors", "circledWord"]);

function baseSurface(relPath: string): Surface {
  if (relPath.startsWith("content/about/workingTogether")) return "body";
  if (relPath.startsWith("content/about/")) return "about";
  if (relPath.startsWith("content/home/")) return "home";
  return "body";
}

function keySurface(relPath: string, key: string): Surface {
  // Project blurbs read as body copy even though the key is "description".
  if (key === "description" && relPath.startsWith("content/projects/")) return "body";
  if (HEADLINE_KEYS.has(key)) return "headline";
  return baseSurface(relPath);
}

/** Replace a span with spaces so offsets (and line numbers) survive. */
function blank(s: string): string {
  return s.replace(/[^\n]/g, " ");
}

/**
 * Hide text that isn't the author's own sentence: URLs, code, Markdoc tags,
 * images, and anything in quotation marks (you can't rewrite a source).
 */
export function maskNonProse(line: string): string {
  return line
    .replace(/`[^`]*`/g, blank)
    .replace(/\{%[^%]*%\}/g, blank)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, blank)
    .replace(/\]\([^)]*\)/g, (m) => "]" + blank(m.slice(1)))
    .replace(/https?:\/\/\S+/g, blank)
    .replace(/“[^”]{1,400}”/g, blank)
    .replace(/(^|[\s(\[])"[^"\n]{1,400}"/g, (m, lead: string) => lead + blank(m.slice(lead.length)));
}

/** Minimal YAML reader: top-level `key: value`, quoted values, and `>-` / `|` blocks. */
function yamlSegments(relPath: string, lines: string[], lineOffset: number): Segment[] {
  const out: Segment[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(lines[i]);
    if (!m) continue;
    const [, key, rawValue] = m;
    if (!PROSE_KEYS.has(key)) continue;

    let text = rawValue.trim();
    const startLine = lineOffset + i + 1;
    if (/^[>|][-+]?$/.test(text)) {
      const block: string[] = [];
      let j = i + 1;
      while (j < lines.length && (/^\s+\S/.test(lines[j]) || lines[j].trim() === "")) {
        block.push(lines[j].trim());
        j++;
      }
      while (block.length && block[block.length - 1] === "") block.pop();
      if (!block.length) continue;
      out.push({ text: block.join("\n"), line: startLine + 1, surface: keySurface(relPath, key), field: key });
      i = j - 1;
      continue;
    }
    if (!text) continue;
    if ((text.startsWith("'") && text.endsWith("'")) || (text.startsWith('"') && text.endsWith('"'))) {
      text = text.slice(1, -1).replace(/''/g, "'");
    }
    out.push({ text, line: startLine, surface: keySurface(relPath, key), field: key });
  }
  return out;
}

function markdownSegments(relPath: string, lines: string[], lineOffset: number): Segment[] {
  const out: Segment[] = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (/^\s*(```|~~~)/.test(raw)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || raw.trim() === "" || /^\s*>/.test(raw) || /^\s*---\s*$/.test(raw)) continue;
    const isHeading = /^\s*#{1,6}\s/.test(raw);
    out.push({
      text: maskNonProse(raw),
      line: lineOffset + i + 1,
      surface: isHeading ? "headline" : baseSurface(relPath),
      field: isHeading ? "heading" : "body",
    });
  }
  return out;
}

function tsxSegments(lines: string[]): Segment[] {
  const out: Segment[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(import|export \* from)\b/.test(line)) continue;
    const near = (lines[i - 1] ?? "") + line;
    const surface: Surface = /\b(description|title)\b/.test(near) ? "headline" : "ui";

    // JSX text between tags on one line: <h1>Like this</h1>
    for (const m of line.matchAll(/>([^<>{}]*[A-Za-z][^<>{}]*)</g)) {
      out.push({ text: " ".repeat(m.index! + 1) + m[1], line: i + 1, surface: "ui", field: "jsx" });
    }
    // String literals that read like sentences, skipping class lists.
    for (const m of line.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)) {
      const value = m[2];
      const before = line.slice(0, m.index);
      if (/className=\{?\s*$|\b(clsx|cn)\([^)]*$/.test(before)) continue;
      if (value.split(/\s+/).length < 3 || !/[A-Za-z]/.test(value)) continue;
      if (value.split(/\s+/).every((t) => /[-:\[\]/]/.test(t) || /^[a-z0-9]+$/.test(t))) continue;
      out.push({ text: " ".repeat(m.index! + 1) + value, line: i + 1, surface, field: "string" });
    }
  }
  return out;
}

export function extractSegments(relPath: string, content: string): Segment[] {
  const lines = content.split(/\r?\n/);
  if (relPath.endsWith(".tsx")) return tsxSegments(lines);
  if (/\.(ya?ml)$/.test(relPath)) return yamlSegments(relPath, lines, 0);

  // Markdoc / markdown: optional frontmatter, then body.
  if (lines[0]?.trim() === "---") {
    const end = lines.indexOf("---", 1);
    if (end > 0) {
      return [
        ...yamlSegments(relPath, lines.slice(1, end), 1),
        ...markdownSegments(relPath, lines.slice(end + 1), end + 1),
      ];
    }
  }
  return markdownSegments(relPath, lines, 0);
}

function severityFor(rule: Rule, surface: Surface): Severity {
  const s = rule.severityBySurface?.[surface] ?? rule.severity;
  // Headlines get zero tolerance.
  return surface === "headline" ? "error" : s;
}

function isAllowed(
  allow: AllowEntry[],
  file: string,
  rule: string,
  text: string,
  start: number,
  end: number
): boolean {
  const hay = text.toLowerCase();
  return allow.some((a) => {
    if (a.rule && a.rule !== rule) return false;
    if (a.file && a.file !== file) return false;
    const needle = a.text.toLowerCase();
    for (let at = hay.indexOf(needle); at !== -1; at = hay.indexOf(needle, at + 1)) {
      if (at <= start && at + needle.length >= end) return true;
    }
    return false;
  });
}

function contextAround(text: string, start: number, end: number): string {
  // Slice before collapsing whitespace, or masked spans shift the window.
  const a = Math.max(0, start - 50);
  const b = Math.min(text.length, end + 50);
  const slice = text.slice(a, b).replace(/\s+/g, " ").trim();
  return (a > 0 ? "…" : "") + slice + (b < text.length ? "…" : "");
}

export function lintSegments(
  file: string,
  segments: Segment[],
  allow: AllowEntry[] = [],
  rules: Rule[] = RULES
): Finding[] {
  const findings: Finding[] = [];
  for (const seg of segments) {
    // Same length as the original, so offsets still map to real lines.
    const flat = seg.text.replace(/\n/g, " ");
    for (const rule of rules) {
      if (rule.surfaces && !rule.surfaces.includes(seg.surface)) continue;
      const source = rule.pattern.multiline ? seg.text : flat;
      rule.pattern.lastIndex = 0;
      for (const m of source.matchAll(rule.pattern)) {
        const start = m.index!;
        const end = start + m[0].length;
        if (isAllowed(allow, file, rule.id, flat, start, end)) continue;
        const before = seg.text.slice(0, start);
        const lineInSeg = (before.match(/\n/g) ?? []).length;
        const lastNl = before.lastIndexOf("\n");
        findings.push({
          file,
          line: seg.line + lineInSeg,
          column: start - lastNl,
          rule: rule.id,
          severity: severityFor(rule, seg.surface),
          match: m[0].trim(),
          context: contextAround(seg.text, start, end),
          message: rule.message,
          surface: seg.surface,
          field: seg.field,
        });
      }
    }
  }
  return findings.sort((a, b) => a.line - b.line || a.column - b.column);
}

export function lintFile(relPath: string, content: string, allow: AllowEntry[] = []): Finding[] {
  if (!isInScope(relPath)) return [];
  return lintSegments(relPath, extractSegments(relPath, content), allow);
}
