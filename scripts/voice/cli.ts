/**
 * Voice lint for prannoy.com.
 *
 *   npm run voice                     lint all site copy
 *   npm run voice -- content/about    lint specific files or folders
 *   npm run voice -- --strict         warnings fail too
 *   --format=github                   GitHub annotations (used in CI)
 *   --format=json                     machine-readable
 *   --hook                            Claude Code PostToolUse mode (reads stdin)
 *
 * Exit codes: 0 clean, 1 errors found, 2 errors found in --hook mode
 * (exit 2 is how a PostToolUse hook hands feedback back to Claude).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { isInScope, lintFile, type AllowEntry, type Finding } from "./core.ts";

const ROOT = resolve(import.meta.dirname, "..", "..");
const DEFAULT_TARGETS = ["content", "src/app", "src/components"];

function loadAllowlist(): AllowEntry[] {
  const p = join(ROOT, "scripts/voice/allowlist.json");
  if (!existsSync(p)) return [];
  return JSON.parse(readFileSync(p, "utf8")).allow ?? [];
}

function walk(absPath: string): string[] {
  if (!existsSync(absPath)) return [];
  if (statSync(absPath).isFile()) return [absPath];
  return readdirSync(absPath, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => join(d.parentPath, d.name));
}

function collect(targets: string[]): string[] {
  const files = targets.flatMap((t) => walk(resolve(ROOT, t)));
  return [...new Set(files)]
    .map((abs) => relative(ROOT, abs).replace(/\\/g, "/"))
    .filter(isInScope)
    .sort();
}

function lintPaths(relPaths: string[], allow: AllowEntry[]): Finding[] {
  return relPaths.flatMap((rel) => lintFile(rel, readFileSync(join(ROOT, rel), "utf8"), allow));
}

function pretty(findings: Finding[]): string {
  if (!findings.length) return "voice: clean";
  const lines: string[] = [];
  let lastFile = "";
  for (const f of findings) {
    if (f.file !== lastFile) {
      lines.push("", f.file);
      lastFile = f.file;
    }
    const sev = f.severity === "error" ? "error" : "warn ";
    lines.push(`  ${f.line}:${f.column}  ${sev}  ${f.rule.padEnd(18)} "${f.match}"  (${f.field})`);
    lines.push(`      ${f.context}`);
    lines.push(`      ${f.message}`);
  }
  const errors = findings.filter((f) => f.severity === "error").length;
  lines.push("", `voice: ${errors} error(s), ${findings.length - errors} warning(s)`);
  return lines.join("\n");
}

function github(findings: Finding[]): string {
  const esc = (s: string) => s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  return findings
    .map(
      (f) =>
        `::${f.severity === "error" ? "error" : "warning"} file=${f.file},line=${f.line},col=${f.column},title=voice/${f.rule}::${esc(`"${f.match}" in ${f.field}. ${f.message}`)}`
    )
    .join("\n");
}

function items(findings: Finding[]): string[] {
  return findings.map(
    (f) => `- ${f.file}:${f.line} [${f.rule}] "${f.match}" in ${f.field}: ${f.context}\n  Why: ${f.message}`
  );
}

/** Feedback written for Claude, not for a terminal. */
function forClaude(errors: Finding[], warnings: Finding[]): string {
  return [
    "Voice check failed on the copy you just wrote:",
    ...items(errors),
    ...(warnings.length ? ["", "Warnings (judgment calls; fix if figurative or filler):", ...items(warnings)] : []),
    "",
    "Rewrite each flagged sentence in Prannoy's voice (see the Voice section of AGENTS.md).",
    "Don't swap in a synonym; rewrite the sentence so it says the concrete thing. Keep the meaning.",
    "If a flag is wrong (a literal use, or words quoted from a source), leave it and say so in your reply.",
    "Don't edit scripts/voice/allowlist.json or the rules yourself; Prannoy decides exceptions.",
  ].join("\n");
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const c of process.stdin) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

async function hookMode(allow: AllowEntry[]): Promise<number> {
  let filePath: string | undefined;
  try {
    const input = JSON.parse(await readStdin());
    filePath = input?.tool_input?.file_path ?? input?.tool_input?.notebook_path;
  } catch {
    return 0; // Never break the session over a malformed payload.
  }
  if (!filePath) return 0;
  const rel = relative(ROOT, resolve(ROOT, filePath)).replace(/\\/g, "/");
  if (rel.startsWith("..") || !isInScope(rel) || !existsSync(join(ROOT, rel))) return 0;

  const findings = lintPaths([rel], allow);
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warn");

  if (errors.length) {
    process.stderr.write(forClaude(errors, warnings) + "\n");
    return 2;
  }
  if (warnings.length) {
    // Warnings ride along as context instead of blocking.
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: [
            "Voice warnings on the copy you just wrote (judgment calls, not blockers). Rewrite any that are figurative or filler:",
            ...items(warnings),
          ].join("\n"),
        },
      })
    );
  }
  return 0;
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const allow = loadAllowlist();
  if (args.includes("--hook")) return hookMode(allow);

  const format = args.find((a) => a.startsWith("--format="))?.split("=")[1] ?? "pretty";
  const strict = args.includes("--strict");
  const targets = args.filter((a) => !a.startsWith("--"));
  const findings = lintPaths(collect(targets.length ? targets : DEFAULT_TARGETS), allow);

  if (format === "json") process.stdout.write(JSON.stringify(findings, null, 2) + "\n");
  else if (format === "github") {
    const out = github(findings);
    if (out) process.stdout.write(out + "\n");
    process.stdout.write(pretty(findings) + "\n");
  } else process.stdout.write(pretty(findings) + "\n");

  const failing = findings.filter((f) => strict || f.severity === "error");
  return failing.length ? 1 : 0;
}

main().then((code) => process.exit(code));
