import { test } from "node:test";
import assert from "node:assert/strict";
import { isInScope, lintFile } from "./core.ts";

const essay = (frontmatter: string, body: string) => `---\n${frontmatter}\n---\n${body}\n`;
const rules = (path: string, content: string) => lintFile(path, content).map((f) => `${f.rule}:${f.severity}`);

test("poems and code are out of scope", () => {
  assert.equal(isInScope("content/poems/the-rocking-chair/index.mdoc"), false);
  assert.equal(isInScope("src/lib/tags.ts"), false);
  assert.equal(isInScope("content/about/bio.mdoc"), true);
  assert.equal(isInScope("src/app/(site)/page.tsx"), true);
});

test("banned words and stock phrases are errors in body copy", () => {
  const found = rules(
    "content/essays/x/index.mdoc",
    essay("title: Plain", "We leverage a robust model. When it comes to grading, it fails.")
  );
  assert.deepEqual(found, ["banned-word:error", "banned-word:error", "stock-phrase:error"]);
});

test("headline warnings are promoted to errors", () => {
  const found = lintFile(
    "content/essays/x/index.mdoc",
    essay("title: An exciting look at tutoring\ndek: >-\n  Navigating the new\n  landscape of learning.", "Body.")
  );
  assert.deepEqual(
    found.map((f) => [f.rule, f.severity, f.field, f.line]),
    [
      ["hype", "error", "title", 2],
      ["figurative-word", "error", "dek", 4],
      ["figurative-word", "error", "dek", 5],
    ]
  );
});

test("structural templates are caught", () => {
  const body = [
    "It's not just a tutor, it's a teacher.",
    "I don't just write about schools; I build them.",
    "This isn't about grades. It's about understanding.",
    "No slides. No lectures. Just practice.",
    "- **Speed**: it runs fast",
    "Teachers adapt — machines don't.",
  ].join("\n\n");
  assert.deepEqual(
    rules("content/essays/x/index.mdoc", essay("title: Plain", body)),
    ["not-just-x-but-y:error", "not-just-x-but-y:error", "isnt-about-x:error", "no-x-no-y-just-z:error", "bold-colon-list:error", "em-dash:error"]
  );
});

test("quotes, links, and blockquotes are left alone", () => {
  const body = [
    'One student called it "a robust and transformative tool" in the survey.',
    "Read [the study](https://example.com/robust-innovative).",
    "> A cutting-edge quote from someone else.",
    "Inline `leverage` code is fine.",
  ].join("\n\n");
  assert.deepEqual(rules("content/essays/x/index.mdoc", essay("title: Plain", body)), []);
});

test("the homepage kicker counts as a headline", () => {
  assert.deepEqual(rules("content/home/index.yaml", "kicker: An innovative product lead\ngreeting: Hi."), [
    "banned-word:error",
  ]);
  assert.deepEqual(rules("content/home/index.yaml", "kicker: Truly a builder"), ["intensifier:error"]);
});

test("Coursera is an error on the About page and a warning in essays", () => {
  assert.deepEqual(rules("content/about/bio.mdoc", "I build at Coursera."), ["employer-name:error"]);
  assert.deepEqual(rules("content/essays/x/index.mdoc", essay("title: Plain", "Learners on Coursera.")), [
    "employer-name:warn",
  ]);
});

test("second person is flagged in the bio but not in the working-together CTA", () => {
  assert.deepEqual(rules("content/about/bio.mdoc", "You ship anyway."), ["second-person-bio:warn"]);
  assert.deepEqual(rules("content/about/workingTogether.mdoc", "If that's you, write to me."), []);
});

test("tsx: page titles and JSX text are checked, class lists are not", () => {
  const tsx = [
    'export const metadata = { title: "A groundbreaking site" };',
    '<p className="font-serif text-sm leading-relaxed text-muted-board">Hello there</p>',
    "<h2>Essays that delve deeper</h2>",
  ].join("\n");
  assert.deepEqual(rules("src/app/(site)/page.tsx", tsx), ["banned-word:error", "banned-word:error"]);
});
