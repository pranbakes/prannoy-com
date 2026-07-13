import Link from "next/link";
import { reader } from "@/lib/reader";
import NewsletterSignup from "@/components/newsletter-signup";

export default async function Home() {
  const [essays, pins] = await Promise.all([
    reader.collections.essays.all(),
    reader.collections.corkboard.all(),
  ]);

  const recentEssays = [...essays]
    .sort((a, b) => (a.entry.date < b.entry.date ? 1 : -1))
    .slice(0, 5);

  const recentPins = [...pins]
    .sort((a, b) => (a.entry.date < b.entry.date ? 1 : -1))
    .slice(0, 4);

  return (
    <div>
      <section className="mx-auto max-w-2xl px-6 pb-16 pt-24">
        <h1 className="font-serif text-hero font-medium">Prannoy Nambiar</h1>
        <p className="mt-6 font-serif text-lg leading-relaxed text-ink">
          Essays on education, work, philosophy, and whatever I&apos;m
          listening to. Poems. Companies I&apos;ve built and founders I back.
          All in one place, because keeping them apart never told the truth
          about any of them.
        </p>
        <p className="mt-6 font-serif text-base leading-relaxed text-muted">
          I take on a small number of advisory relationships and invest
          early. If you&apos;re building in education,{" "}
          <a
            href="mailto:hi@prannoy.com"
            className="text-pen underline underline-offset-4 hover:text-ink"
          >
            write to me
          </a>
          .
        </p>
      </section>

      <section className="bg-paper px-6 py-16">
        <div className="mx-auto max-w-4xl">
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

      <section className="bg-paper-dark px-6 py-16">
        <div className="mx-auto max-w-4xl">
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

      <section className="bg-paper px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
