import Link from "next/link";
import { reader } from "@/lib/reader";
import { Circle } from "@/components/red-pen";
import NewsletterSignup from "@/components/newsletter-signup";
import { ADVISORY_MAILTO } from "@/lib/mailto";
import { DocumentRenderer } from "@keystatic/core/renderer";

// The advisory line is authored in Keystatic as a plain mailto: link
// (simple for a non-technical editor to write). This swaps in the full
// subject/body-prefilled version at render time, so ADVISORY_MAILTO
// stays the single source of truth instead of a giant encoded string
// getting pasted into CMS content.
const advisoryLineRenderers = {
  inline: {
    link: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href === "mailto:hi@prannoy.com" ? ADVISORY_MAILTO : href}>
        {children}
      </a>
    ),
  },
};

function renderGreeting(greeting: string, circledWord: string) {
  const idx = circledWord ? greeting.indexOf(circledWord) : -1;
  if (idx === -1) return greeting;
  return (
    <>
      {greeting.slice(0, idx)}
      <Circle>{circledWord}</Circle>
      {greeting.slice(idx + circledWord.length)}
    </>
  );
}

export default async function Home() {
  const [essays, pins, home] = await Promise.all([
    reader.collections.essays.all(),
    reader.collections.corkboard.all(),
    reader.singletons.home.read({ resolveLinkedFiles: true }),
  ]);

  const recentEssays = [...essays]
    .sort((a, b) => (a.entry.date < b.entry.date ? 1 : -1))
    .slice(0, 5);

  const recentPins = [...pins]
    .sort((a, b) => (a.entry.date < b.entry.date ? 1 : -1))
    .slice(0, 4);

  return (
    <div>
      <section className="bg-board py-24 text-paper">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-serif text-hero font-medium">
            {home
              ? renderGreeting(home.greeting, home.circledWord)
              : "Hi, glad you're here."}
          </h1>
          {home?.tagline && (
            <p className="mt-6 max-w-[60ch] font-sans text-sm leading-relaxed text-muted-board">
              {home.tagline}
            </p>
          )}
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-page-h1 font-medium">Recent essays</h2>
          <ul className="mt-6 divide-y divide-dashed divide-rule">
            {recentEssays.map(({ slug, entry }) => (
              <li key={slug} className="py-4">
                <Link href={`/essays/${slug}`} className="block">
                  <p className="font-serif text-list-title">{entry.title}</p>
                  <p className="mt-1 text-sm text-muted">{entry.dek}</p>
                </Link>
              </li>
            ))}
            {recentEssays.length === 0 && (
              <li className="py-4 text-sm text-muted">
                No essays published yet.
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="bg-paper-dark py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-page-h1 font-medium">Corkboard</h2>
          {recentPins.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {recentPins.map(({ slug, entry }) => (
                <Link
                  key={slug}
                  href="/corkboard"
                  className="block -rotate-1 bg-card p-3 shadow-sm"
                >
                  <p className="line-clamp-3 font-serif text-sm">
                    {entry.content.discriminant === "quote"
                      ? entry.content.value
                      : entry.attribution}
                  </p>
                  <p className="mt-2 font-hand text-pen">{entry.comment}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 font-hand text-pen">coming soon</p>
          )}
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-4xl px-6">
          {home?.advisoryLine && (
            <div className="mb-8 font-serif text-essay-body leading-relaxed text-muted [&_a]:text-pen [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-ink">
              <DocumentRenderer
                document={home.advisoryLine}
                renderers={advisoryLineRenderers}
              />
            </div>
          )}
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
