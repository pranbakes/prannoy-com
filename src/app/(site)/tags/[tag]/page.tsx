import Link from "next/link";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { filterByTag } from "@/lib/tags";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return { title: `Tagged “${tag}”` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  const [essays, poems, pins, projects] = await Promise.all([
    reader.collections.essays.all(),
    reader.collections.poems.all(),
    reader.collections.corkboard.all(),
    reader.collections.projects.all(),
  ]);

  const matchingEssays = filterByTag(
    essays.map((e) => ({ ...e, tags: e.entry.tags })),
    tag
  );
  const matchingPoems = filterByTag(
    poems.map((e) => ({ ...e, tags: e.entry.tags })),
    tag
  );
  const matchingPins = filterByTag(
    pins.map((e) => ({ ...e, tags: e.entry.tags })),
    tag
  );
  const matchingProjects = filterByTag(
    projects.map((e) => ({ ...e, tags: e.entry.tags })),
    tag
  );

  const nothingFound =
    matchingEssays.length === 0 &&
    matchingPoems.length === 0 &&
    matchingPins.length === 0 &&
    matchingProjects.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-page-h1 font-medium">
        Tagged <span className="text-pen underline">{tag}</span>
      </h1>

      {matchingEssays.length > 0 && (
        <section className="mt-10">
          <h2 className="font-hand text-lg text-pen">essays</h2>
          <ul className="mt-2 divide-y divide-dashed divide-rule">
            {matchingEssays.map(({ slug, entry }) => (
              <li key={slug} className="py-3">
                <Link
                  href={`/essays/${slug}`}
                  className="font-serif text-list-title"
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {matchingPoems.length > 0 && (
        <section className="mt-10">
          <h2 className="font-hand text-lg text-pen">poems</h2>
          <ul className="mt-2 divide-y divide-dashed divide-rule">
            {matchingPoems.map(({ slug, entry }) => (
              <li key={slug} className="py-3">
                <Link
                  href={`/poems/${slug}`}
                  className="font-serif text-list-title"
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {matchingPins.length > 0 && (
        <section className="mt-10">
          <h2 className="font-hand text-lg text-pen">corkboard</h2>
          <ul className="mt-2 divide-y divide-dashed divide-rule">
            {matchingPins.map(({ slug, entry }) => (
              <li key={slug} className="py-3">
                <Link href="/corkboard" className="text-sm text-muted">
                  {entry.comment}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {matchingProjects.length > 0 && (
        <section className="mt-10">
          <h2 className="font-hand text-lg text-pen">projects</h2>
          <ul className="mt-2 divide-y divide-dashed divide-rule">
            {matchingProjects.map(({ slug, entry }) => (
              <li key={slug} className="py-3">
                <Link
                  href="/projects"
                  className="font-serif text-list-title"
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {nothingFound && (
        <p className="mt-10 text-sm text-muted">Nothing tagged yet.</p>
      )}
    </div>
  );
}
