import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { reader } from "@/lib/reader";
import { resolveAnnotations, type Annotation } from "@/lib/annotations";
import { blockHasAnchor, type DocNode } from "@/lib/essay-body";
import NewsletterSignup from "@/components/newsletter-signup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await reader.collections.essays.read(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.dek,
  };
}

const bodyProseClasses =
  "font-serif text-essay-body leading-relaxed [&_blockquote]:my-6 [&_blockquote]:bg-paper-dark [&_blockquote]:p-4 [&_blockquote]:not-italic [&_a]:text-pen [&_a]:underline";

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await reader.collections.essays.read(slug, {
    resolveLinkedFiles: true,
  });
  if (!entry) notFound();

  const annotations = resolveAnnotations(entry.annotations);
  const notes = annotations.filter((a) => a.type === "note");
  const seeAlso = annotations.filter((a) => a.type === "see-also");
  const body = entry.body as unknown as DocNode[];

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <header className="max-w-[440px]">
        <h1 className="font-serif text-essay-h1 font-medium">{entry.title}</h1>
        <p className="mt-3 font-hand text-pen">
          {entry.date}
          {entry.tags.length > 0 && ` · ${entry.tags.join(", ")}`}
        </p>
      </header>

      <div className="mt-10">
        {body.map((block, i) => {
          const blockNotes = notes.filter((note) =>
            blockHasAnchor(block, note.anchorId)
          );
          return (
            <BodyRow key={i} notes={blockNotes}>
              <DocumentRenderer document={[block] as never} />
            </BodyRow>
          );
        })}

        {seeAlso.length > 0 && (
          <BodyRow notes={seeAlso} seeAlso>
            <></>
          </BodyRow>
        )}
      </div>

      <div className="mt-16 max-w-[440px]">
        <NewsletterSignup />
      </div>
    </article>
  );
}

function BodyRow({
  children,
  notes,
  seeAlso,
}: {
  children: React.ReactNode;
  notes: Annotation[];
  seeAlso?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[440px_150px] md:gap-8">
      <div className={bodyProseClasses}>{children}</div>
      {notes.length > 0 && (
        <aside className="space-y-2 font-hand text-pen md:border-l md:border-dashed md:border-rule md:pl-4">
          {notes.map((note, i) => (
            <p key={i} data-anchor={note.anchorId}>
              {seeAlso ? `see also: ${note.text}` : note.text}
            </p>
          ))}
        </aside>
      )}
    </div>
  );
}
