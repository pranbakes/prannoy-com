import Link from "next/link";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { uniqueTags } from "@/lib/tags";
import TagFilterRow from "@/components/tag-filter-row";

export const metadata: Metadata = {
  title: "Essays",
};

export default async function EssaysIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const essays = await reader.collections.essays.all();
  const tags = uniqueTags(essays.map((e) => e.entry));

  const sorted = [...essays].sort((a, b) =>
    a.entry.date < b.entry.date ? 1 : -1
  );
  const filtered = tag
    ? sorted.filter((e) => e.entry.tags.includes(tag))
    : sorted;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-page-h1 font-medium">Essays</h1>
      <TagFilterRow tags={tags} basePath="/essays" activeTag={tag} />
      <ul className="mt-8 divide-y divide-dashed divide-rule">
        {filtered.map(({ slug, entry }) => (
          <li key={slug} className="flex gap-4 py-5">
            <div className="h-16 w-16 flex-shrink-0 bg-card" />
            <div>
              <Link href={`/essays/${slug}`}>
                <p className="font-serif text-list-title">{entry.title}</p>
              </Link>
              <p className="mt-1 text-sm text-muted">{entry.dek}</p>
              <p className="mt-2 font-hand text-pen">
                {entry.date}
                {entry.tags.length > 0 && ` · ${entry.tags.join(", ")}`}
              </p>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-5 text-sm text-muted">
            {tag ? `No essays tagged “${tag}”.` : "No essays yet."}
          </li>
        )}
      </ul>
    </div>
  );
}
