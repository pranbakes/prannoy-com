import Link from "next/link";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { collectTagCounts } from "@/lib/tags";

export const metadata: Metadata = {
  title: "Tags",
};

export default async function TagsIndex() {
  const [essays, poems, pins, projects] = await Promise.all([
    reader.collections.essays.all(),
    reader.collections.poems.all(),
    reader.collections.corkboard.all(),
    reader.collections.projects.all(),
  ]);

  const counts = collectTagCounts([
    essays.map((e) => e.entry),
    poems.map((e) => e.entry),
    pins.map((e) => e.entry),
    projects.map((e) => e.entry),
  ]);

  const tags = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-page-h1 font-medium">Tags</h1>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
        {tags.map(([tag, count]) => (
          <li key={tag}>
            <Link
              href={`/tags/${encodeURIComponent(tag)}`}
              className="font-serif text-list-title"
            >
              {tag}
            </Link>
            <span className="ml-1 font-hand text-pen">{count}</span>
          </li>
        ))}
        {tags.length === 0 && (
          <li className="text-sm text-muted">Nothing tagged yet.</li>
        )}
      </ul>
    </div>
  );
}
