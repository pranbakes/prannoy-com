import Image from "next/image";
import type { Metadata } from "next";
import { DocumentRenderer } from "@keystatic/core/renderer";
import { reader } from "@/lib/reader";
import { ADVISORY_MAILTO } from "@/lib/mailto";

// The "Working together" copy is authored in Keystatic as a plain
// mailto: link (simple for a non-technical editor to write). This
// swaps in the full subject/body-prefilled version at render time,
// so ADVISORY_MAILTO stays the single source of truth instead of a
// giant encoded string getting pasted into CMS content.
const workingTogetherRenderers = {
  inline: {
    link: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href === "mailto:hi@prannoy.com" ? ADVISORY_MAILTO : href}>
        {children}
      </a>
    ),
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const about = await reader.singletons.about.read();
  return {
    title: "About",
    description: about?.forEditors?.slice(0, 160),
  };
}

export default async function AboutPage() {
  const about = await reader.singletons.about.read({ resolveLinkedFiles: true });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-page-h1 font-medium">About</h1>

      <div className="mt-8 flex flex-col gap-8 sm:flex-row">
        <div className="-rotate-2 self-start bg-card p-2 shadow-sm">
          <Image
            src={about?.portrait ?? "/prannoy.png"}
            alt="Prannoy Nambiar"
            width={480}
            height={720}
            className="h-40 w-32 object-cover object-top"
          />
        </div>

        <div className="max-w-[520px] space-y-6 font-serif text-essay-body leading-relaxed">
          {about?.bio && <DocumentRenderer document={about.bio} />}
        </div>
      </div>

      {about?.workingTogether && (
        <div className="mt-16 max-w-[520px]">
          <h2 className="font-serif text-list-title font-medium">
            Working together
          </h2>
          <div className="mt-3 font-serif text-essay-body leading-relaxed [&_a]:text-pen [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-ink">
            <DocumentRenderer
              document={about.workingTogether}
              renderers={workingTogetherRenderers}
            />
          </div>
        </div>
      )}

      {about?.forEditors && (
        <div className="mt-16 max-w-[520px] border-t border-dashed border-rule pt-6">
          <h2 className="font-hand text-lg text-pen">for editors</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-muted">
            {about.forEditors}
          </p>
        </div>
      )}
    </div>
  );
}
