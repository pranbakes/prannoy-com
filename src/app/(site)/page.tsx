import Link from "next/link";
import { reader } from "@/lib/reader";
import { Circle } from "@/components/red-pen";
import NewsletterSignup from "@/components/newsletter-signup";

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
  const [essays, home] = await Promise.all([
    reader.collections.essays.all(),
    reader.singletons.home.read(),
  ]);

  // The homepage makes one promise, so it only lists essays marked
  // "Featured on homepage" in Keystatic. Everything else lives on /essays.
  // If nothing is featured yet, fall back to the newest three so the
  // section never renders empty.
  const byDate = [...essays].sort((a, b) =>
    a.entry.date < b.entry.date ? 1 : -1
  );
  const featured = byDate.filter(({ entry }) => entry.featured);
  const homeEssays = featured.length > 0 ? featured : byDate.slice(0, 3);

  return (
    <div>
      <section className="bg-board py-24 text-paper">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-serif text-hero font-medium">
            {home
              ? renderGreeting(home.greeting, home.circledWord)
              : "Every job I've had has been a version of teaching 7th grade math."}
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
          <h2 className="font-serif text-page-h1 font-medium">Start here</h2>
          <ul className="mt-6 divide-y divide-dashed divide-rule">
            {homeEssays.map(({ slug, entry }) => (
              <li key={slug} className="py-4">
                <Link href={`/essays/${slug}`} className="block">
                  <p className="font-serif text-list-title">{entry.title}</p>
                  <p className="mt-1 text-sm text-muted">{entry.dek}</p>
                </Link>
              </li>
            ))}
            {homeEssays.length === 0 && (
              <li className="py-4 text-sm text-muted">
                No essays published yet.
              </li>
            )}
          </ul>
          <Link
            href="/essays"
            className="mt-4 inline-block font-hand text-lg text-pen hover:text-ink"
          >
            all essays →
          </Link>

          <div className="mt-12">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      <section className="bg-paper-dark py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap gap-x-12 gap-y-3 px-6 font-serif text-list-title">
          <Link href="/projects" className="hover:text-pen">
            What I&apos;ve built →
          </Link>
          <Link href="/poems" className="hover:text-pen">
            Poems →
          </Link>
        </div>
      </section>
    </div>
  );
}
