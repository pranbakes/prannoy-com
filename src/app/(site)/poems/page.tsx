import Link from "next/link";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { uniqueTags } from "@/lib/tags";
import TagFilterRow from "@/components/tag-filter-row";

export const metadata: Metadata = {
  title: "Poems",
};

export default async function PoemsIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const poems = await reader.collections.poems.all();
  const tags = uniqueTags(poems.map((p) => p.entry));

  const sorted = [...poems].sort((a, b) =>
    a.entry.date < b.entry.date ? 1 : -1
  );
  const filtered = tag
    ? sorted.filter((p) => p.entry.tags.includes(tag))
    : sorted;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-page-h1 font-medium">Poems</h1>
      <TagFilterRow tags={tags} basePath="/poems" activeTag={tag} />
      <ul className="mt-8 divide-y divide-dashed divide-rule">
        {filtered.map(({ slug, entry }) => (
          <li key={slug} className="flex items-baseline justify-between py-3">
            <Link
              href={`/poems/${slug}`}
              className="font-serif text-[20px] font-medium"
            >
              {entry.title}
            </Link>
            <span className="flex items-baseline gap-3 whitespace-nowrap">
              <span className="text-sm text-muted">
                {entry.date.slice(0, 4)}
              </span>
              {entry.provenance?.journal && (
                <span className="font-hand text-pen">
                  {entry.provenance.journal}
                </span>
              )}
            </span>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-3 text-sm text-muted">
            {tag ? `No poems tagged “${tag}”.` : "No poems yet."}
          </li>
        )}
      </ul>
    </div>
  );
}
