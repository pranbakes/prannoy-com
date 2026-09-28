import { test } from "node:test";
import assert from "node:assert/strict";
import { splitStanzaIntoLines } from "./poem-body.ts";

test("splits a single text node on embedded newlines", () => {
  const lines = splitStanzaIntoLines([{ text: "line one\nline two\nline three" }]);
  assert.deepEqual(lines, [
    [{ text: "line one" }],
    [{ text: "line two" }],
    [{ text: "line three" }],
  ]);
});

test("preserves marks on split segments", () => {
  const lines = splitStanzaIntoLines([{ text: "plain\n" }, { text: "italic", italic: true }]);
  assert.deepEqual(lines, [[{ text: "plain" }], [{ text: "italic", italic: true }]]);
});

test("keeps non-breaking nodes on the same line", () => {
  const lines = splitStanzaIntoLines([
    { text: "before " },
    { text: "mid", italic: true },
    { text: " after" },
  ]);
  assert.deepEqual(lines, [
    [{ text: "before " }, { text: "mid", italic: true }, { text: " after" }],
  ]);
});

test("a single line with no breaks returns one line", () => {
  const lines = splitStanzaIntoLines([{ text: "just one line" }]);
  assert.deepEqual(lines, [[{ text: "just one line" }]]);
});

test("preserves leading whitespace on a line after a break", () => {
  const lines = splitStanzaIntoLines([{ text: "line one\n            indented line" }]);
  assert.deepEqual(lines, [[{ text: "line one" }], [{ text: "            indented line" }]]);
});
