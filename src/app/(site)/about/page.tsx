import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-page-h1 font-medium">About</h1>

      <div className="mt-8 flex flex-col gap-8 sm:flex-row">
        <div className="-rotate-2 self-start bg-card p-2 shadow-sm">
          <div className="h-40 w-32 bg-paper-dark" />
        </div>

        <p className="max-w-[520px] font-serif text-essay-body leading-relaxed">
          I&apos;m Prannoy — I write essays, publish poems, teach when I can, and
          build things that mostly work. I taught for long enough that it
          shapes how I think about almost everything else I do, and
          I&apos;d rather you find that out by reading the essays than by me
          announcing it here. This site is where the writing, the taste, and
          the projects live together, because keeping them apart never made
          sense to me.
        </p>
      </div>

      <div className="mt-16 border-t border-dashed border-rule pt-6">
        <p className="font-hand text-pen">for editors</p>
        <p className="mt-2 max-w-[520px] text-sm text-muted">
          Prannoy Nambiar is a writer and educator whose essays and poems
          have appeared in [placeholder]. He lives in [placeholder].
        </p>
      </div>
    </div>
  );
}
