import { test } from "node:test";
import assert from "node:assert/strict";
import { blockHasAnchor } from "./essay-body.ts";

const paragraphWithLink = {
  type: "paragraph",
  children: [
    { text: "before " },
    { type: "link", href: "#cite-1", children: [{ text: "distance" }] },
    { text: " after" },
  ],
};

const plainParagraph = {
  type: "paragraph",
  children: [{ text: "nothing special here" }],
};

test("blockHasAnchor finds a nested link matching the anchor id", () => {
  assert.equal(blockHasAnchor(paragraphWithLink, "cite-1"), true);
});

test("blockHasAnchor returns false for a non-matching anchor id", () => {
  assert.equal(blockHasAnchor(paragraphWithLink, "cite-2"), false);
});

test("blockHasAnchor returns false for a block with no links", () => {
  assert.equal(blockHasAnchor(plainParagraph, "cite-1"), false);
});
