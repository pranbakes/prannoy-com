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
const projects = [{ slug: "proj-a", tags: ["ai"] }];

test("filterByTag finds the tagged essay and poem", () => {
  assert.deepEqual(
    filterByTag(essays, "pedagogy").map((e) => e.slug),
    ["essay-a"]
  );
  assert.deepEqual(
    filterByTag(poems, "pedagogy").map((e) => e.slug),
    ["poem-a"]
  );
  assert.deepEqual(
    filterByTag(projects, "ai").map((e) => e.slug),
    ["proj-a"]
  );
});

test("filterByTag returns nothing for an unused tag", () => {
  assert.deepEqual(filterByTag(essays, "nonexistent"), []);
});

test("collectTagCounts aggregates counts across all three collections", () => {
  const counts = collectTagCounts([essays, poems, projects]);
  assert.equal(counts.get("pedagogy"), 2);
  assert.equal(counts.get("ai"), 2);
  assert.equal(counts.get("poetry"), 1);
  assert.equal(counts.has("nonexistent"), false);
});

test("uniqueTags sorts and de-duplicates", () => {
  assert.deepEqual(uniqueTags(essays), ["ai", "pedagogy", "poetry"]);
});
