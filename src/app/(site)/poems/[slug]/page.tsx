import { Fragment } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import {
  splitStanzaIntoLines,
  type PoemInlineNode,
  type PoemStanza,
} from "@/lib/poem-body";

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

function renderInline(nodes: PoemInlineNode[]) {
  return nodes.map((node, i) => {
    const text = node.text ?? "";
    if (node.bold && node.italic) {
      return (
        <strong key={i}>
          <em>{text}</em>
        </strong>
      );
    }
    if (node.bold) return <strong key={i}>{text}</strong>;
    if (node.italic) return <em key={i}>{text}</em>;
    return <Fragment key={i}>{text}</Fragment>;
  });
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await reader.collections.poems.read(slug, {
    resolveLinkedFiles: true,
  });
  if (!entry) notFound();

  const stanzas = entry.body as unknown as PoemStanza[];

  return (
    <article className="mx-auto max-w-[440px] px-6 py-16">
      <h1 className="font-serif text-essay-h1 font-medium">{entry.title}</h1>
      <p className="mt-2 font-hand text-pen">{entry.date}</p>

      <div className="mt-10 font-serif text-[18px] leading-relaxed sm:text-poem-body">
        {stanzas.map((stanza, si) => (
          <Fragment key={si}>
            {si > 0 && (
              <div className="whitespace-pre-wrap pl-4 indent-[-1em]">
                {" "}
              </div>
            )}
            {splitStanzaIntoLines(stanza.children).map((line, li) => (
              <div key={li} className="whitespace-pre-wrap pl-4 indent-[-1em]">
                {renderInline(line)}
              </div>
            ))}
          </Fragment>
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
