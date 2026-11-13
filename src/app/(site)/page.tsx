import Link from "next/link";
import Image from "next/image";
import { reader } from "@/lib/reader";
import { Circle } from "@/components/red-pen";
import NewsletterSignup from "@/components/newsletter-signup";

const statusLabel: Record<string, string> = {
  live: "live",
  "in-progress": "in progress",
  acquired: "acquired",
};

const statusOrder: Record<string, number> = {
  live: 0,
  "in-progress": 1,
  acquired: 2,
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
  const [essays, projects, home, about] = await Promise.all([
    reader.collections.essays.all(),
    reader.collections.projects.all(),
    reader.singletons.home.read(),
    reader.singletons.about.read(),
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

  // Same ordering rule as /projects: live work leads, archived never shows.
  const homeProjects = projects
    .filter(({ entry }) => entry.status !== "archived")
    .sort(
      (a, b) =>
        (statusOrder[a.entry.status] ?? 9) - (statusOrder[b.entry.status] ?? 9)
    )
    .slice(0, 2);

  return (
    <div>
      <section className="bg-board py-20 text-paper">
        <div className="mx-auto flex max-w-4xl flex-col-reverse items-start gap-10 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-[34rem]">
            {home?.kicker && (
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-muted-board">
                {home.kicker}
              </p>
            )}
            <h1 className="mt-4 font-serif text-hero font-medium">
              {home
                ? renderGreeting(home.greeting, home.circledWord)
                : "I build platforms where people learn and earn."}
            </h1>
            {home?.tagline && (
              <p className="mt-5 max-w-[52ch] font-sans text-sm leading-relaxed text-muted-board">
                {home.tagline}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/essays"
                className="border border-paper px-4 py-2 font-sans text-sm hover:bg-paper hover:text-board"
              >
                Read the essays
              </Link>
              <Link
                href="/projects"
                className="border border-muted-board px-4 py-2 font-sans text-sm text-muted-board hover:border-paper hover:text-paper"
              >
                See what I&apos;ve built
              </Link>
            </div>
          </div>

          <div className="rotate-2 bg-card p-2 shadow-sm">
            <Image
              src={about?.portrait ?? "/prannoy.png"}
              alt="Prannoy Nambiar"
              width={480}
              height={720}
              priority
              className="h-44 w-36 object-cover object-top sm:h-56 sm:w-44"
            />
          </div>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-serif text-page-h1 font-medium">Start here</h2>
          <ul className="mt-6 divide-y divide-dashed divide-rule">
            {homeEssays.map(({ slug, entry }) => (
              <li key={slug} className="py-4">
                <Link href={`/essays/${slug}`} className="flex gap-4">
                  {entry.thumbnail ? (
                    <Image
                      src={entry.thumbnail}
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 flex-shrink-0 bg-card" />
                  )}
                  <div>
                    <p className="font-serif text-list-title">{entry.title}</p>
                    <p className="mt-1 text-sm text-muted">{entry.dek}</p>
                  </div>
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
        </div>
      </section>

      {homeProjects.length > 0 && (
        <section className="bg-paper-dark py-16">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="font-serif text-page-h1 font-medium">
              What I&apos;ve built
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {homeProjects.map(({ slug, entry }) => (
                <div key={slug} className="bg-card p-5 shadow-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-serif text-list-title hover:text-pen"
                      >
                        {entry.title}
                      </a>
                    ) : (
                      <p className="font-serif text-list-title">
                        {entry.title}
                      </p>
                    )}
                    <span className="font-hand text-pen">
                      {statusLabel[entry.status]}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-4 text-sm text-muted">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/projects"
              className="mt-4 inline-block font-hand text-lg text-pen hover:text-ink"
            >
              all projects →
            </Link>
          </div>
        </section>
      )}

      <section className="bg-paper py-16">
        <div className="mx-auto max-w-4xl px-6">
          <NewsletterSignup />
          <Link
            href="/poems"
            className="mt-10 inline-block font-serif text-list-title hover:text-pen"
          >
            Poems →
          </Link>
        </div>
      </section>
    </div>
  );
}
