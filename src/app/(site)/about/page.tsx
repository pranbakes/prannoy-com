import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "I'm Prannoy. I write, I build, and I put money behind people who build.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-page-h1 font-medium">About</h1>

      <div className="mt-8 flex flex-col gap-8 sm:flex-row">
        <div className="-rotate-2 self-start bg-card p-2 shadow-sm">
          <div className="h-40 w-32 bg-paper-dark" />
        </div>

        <div className="max-w-[520px] space-y-6 font-serif text-essay-body leading-relaxed">
          <p>
            I&apos;m Prannoy. I write, I build, and I put money behind people
            who build.
          </p>
          <p>
            The writing goes two ways. Essays on education, technology, work,
            and the philosophy underneath all three, plus whatever music has
            my attention. Poems, which have appeared in Delta Poetry Review,
            Wildscape Literary Journal, and Indelible Literary and Arts
            Journal, and which are becoming a first collection.
          </p>
          <p>
            The building goes two ways too. I&apos;ve run a company and
            shipped products used by millions, so when I advise founders
            I&apos;m not theorizing. I angel invest for the same reason: I
            know what the work costs, and I&apos;d rather be useful than
            watch. Most of my checks go to education.
          </p>
          <p>
            The pattern I keep noticing is that the poem and the product are
            the same problem. You&apos;re deciding what to leave out.
            You&apos;re trying to make a stranger feel something they
            didn&apos;t feel a minute ago. You&apos;re wrong most of the time
            and you ship anyway. I got tired of pretending those were
            different jobs, so this site doesn&apos;t.
          </p>
          <p>Brooklyn. Guitar, badly, and a tool I built to fix that.</p>
        </div>
      </div>

      <div className="mt-16 max-w-[520px]">
        <h2 className="font-serif text-list-title font-medium">
          Working together
        </h2>
        <p className="mt-3 font-serif text-essay-body leading-relaxed">
          I take on a small number of advisory relationships, usually with
          post-seed to Series B companies building in education and AI. I
          also invest early. If that&apos;s you,{" "}
          <a
            href="mailto:hi@prannoy.com"
            className="text-pen underline underline-offset-4 hover:text-ink"
          >
            write to me
          </a>
          .
        </p>
      </div>

      <div className="mt-16 max-w-[520px] border-t border-dashed border-rule pt-6">
        <h2 className="font-hand text-lg text-pen">for editors</h2>
        <p className="mt-2 text-sm text-muted">
          Prannoy Nambiar&apos;s poems have appeared in Delta Poetry Review,
          Wildscape Literary Journal, and Indelible Literary and Arts
          Journal. He is at work on a first collection. He writes essays on
          education, technology, and culture, has founded and led product at
          learning companies, and invests in early-stage founders. He lives
          in Brooklyn.
        </p>
      </div>
    </div>
  );
}
