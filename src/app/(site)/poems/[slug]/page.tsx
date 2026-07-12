import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await reader.collections.poems.read(slug);
  if (!entry) return {};
  return { title: entry.title };
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await reader.collections.poems.read(slug);
  if (!entry) notFound();

  const lines = entry.body.split("\n");

  return (
    <article className="mx-auto max-w-[440px] px-6 py-16">
      <h1 className="font-serif text-essay-h1 font-medium">{entry.title}</h1>
      <p className="mt-2 font-hand text-pen">{entry.date}</p>

      <div className="mt-10 font-serif text-[18px] leading-relaxed sm:text-poem-body">
        {lines.map((line, i) => (
          <div key={i} className="pl-4 indent-[-1em]">
            {line || " "}
          </div>
        ))}
      </div>

      {entry.provenance?.journal && (
        <p className="mt-10 font-hand text-pen">
          originally published in{" "}
          {entry.provenance.url ? (
            <a href={entry.provenance.url} className="underline">
              {entry.provenance.journal}
            </a>
          ) : (
            entry.provenance.journal
          )}
          {entry.provenance.year && `, ${entry.provenance.year}`}
        </p>
      )}
    </article>
  );
}
