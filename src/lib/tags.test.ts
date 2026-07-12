import { test } from "node:test";
import assert from "node:assert/strict";
import { filterByTag, collectTagCounts, uniqueTags } from "./tags.ts";

const essays = [
  { slug: "essay-a", tags: ["pedagogy", "ai"] },
  { slug: "essay-b", tags: ["poetry"] },
];
const poems = [
  { slug: "poem-a", tags: ["pedagogy"] },
  { slug: "poem-b", tags: [] },
];
const corkboard = [
  { slug: "pin-a", tags: ["pedagogy", "assessment"] },
  { slug: "pin-b", tags: ["design"] },
];
const projects = [{ slug: "proj-a", tags: ["ai"] }];

test("filterByTag finds the tagged essay, poem, and corkboard pin", () => {
  assert.deepEqual(
    filterByTag(essays, "pedagogy").map((e) => e.slug),
    ["essay-a"]
  );
  assert.deepEqual(
    filterByTag(poems, "pedagogy").map((e) => e.slug),
    ["poem-a"]
  );
  assert.deepEqual(
    filterByTag(corkboard, "pedagogy").map((e) => e.slug),
    ["pin-a"]
  );
});

test("filterByTag returns nothing for an unused tag", () => {
  assert.deepEqual(filterByTag(essays, "nonexistent"), []);
});

test("collectTagCounts aggregates counts across all four collections", () => {
  const counts = collectTagCounts([essays, poems, corkboard, projects]);
  assert.equal(counts.get("pedagogy"), 3);
  assert.equal(counts.get("ai"), 2);
  assert.equal(counts.get("design"), 1);
  assert.equal(counts.has("nonexistent"), false);
});

test("uniqueTags sorts and de-duplicates", () => {
  assert.deepEqual(uniqueTags(essays), ["ai", "pedagogy", "poetry"]);
});
