# prannoy.com

Personal site for Prannoy Nambiar. Next.js (App Router), Tailwind, Keystatic. Copy lives in `content/`; see README.md for the stack.

## Voice

Every word on this site should read like Prannoy wrote it, because he did or he signed off on it. When you write or edit copy (titles, deks, the homepage, the About page, project blurbs, page metadata, essay prose), write in his voice and keep AI-writing markers out.

### What his voice sounds like

These lines are from the site. Match their texture, don't copy them. If you change one of them on the site, update it here too.

- "Now I lead product on an AI tutor, and I still build the prototype when that is faster than describing it." (About)
- "A teacher earns it in the first two weeks or spends the rest of the year chasing it." (About)
- "I angel invest in education and healthcare, usually early, usually in founders attempting something I could not pull off myself." (About)
- "I built it out of my own struggle to learn the guitar rather than just own one." (Projects, Fretlore)
- "The writing was strong. The understanding behind it often wasn't there." (Proof of Learning After AI)

What those have in common:

- First person, active voice, a named actor doing a plain verb.
- A long sentence, then a short one. Vary length on purpose.
- Concrete nouns and real numbers over adjectives: "80,000 downloads," "close to $1M in annual recurring revenue." Numbers must match what the essays say.
- Range gets shown, not asserted. "I still build the prototype" instead of "deeply technical."
- Self-deprecation lives in a clause ("something I could not pull off myself"), not a punchline.
- Opinions stated as opinions, then supported. No hedging, no throat-clearing.
- Match the contractions of the page you're editing. The home and About copy is uncontracted ("do not," "cannot"); the essays use contractions.

### Patterns the November rewrite removed

The copy rewrite on 2026-11-12 cut these because they made the site read as machine-made. Don't reintroduce them:

- A paragraph that ends on an aphorism. One landing line per page at most.
- The setup-colon-payoff sentence ("The lesson was simple: ship it.") repeated across a page. Once per piece, if at all.
- "Actually," "genuinely," "truly" as filler. The rewrite took "actually" from seven uses to one.
- Going abstract at the moment that needs a concrete noun.
- Framing the whole site around the AI tutor. The work is broader than one product.

### Hard rules

The full list lives in `scripts/voice/rules.ts` and is enforced automatically. The short version:

- No em dashes. Use a comma, a period, or parentheses.
- None of the AI-marker words (delve, leverage, robust, seamless, transformative, landscape, realm, foster, and the rest in `rules.ts`).
- No stock phrases: "when it comes to," "at its core," "in today's world," "it's worth noting," "plays a crucial role."
- No templates: "not just X, but Y," "This isn't about X. It's about Y," "No X. No Y. Just Z," abstract rule-of-three lists.
- No "**Term**: explanation" bullet lists.
- Don't label significance ("significantly," "importantly," "crucially"). Show it.
- Don't open with a sweeping statement about the world. Don't close with a summary or an inspirational line. Start and end on substance.
- The About page stays in first person. No "you" in the bio.
- Don't name Coursera anywhere in the site's own copy (home, About, projects, metadata).
- Every study an essay cites names the researcher and links to the source.
- Headlines (titles, deks, the homepage kicker, greeting and tagline, essay section headings, page titles) get zero tolerance: a warning anywhere else is an error there.

### Poems

Don't touch poems for voice or style unless Prannoy asks. The linter skips `content/poems/` on purpose.

### The check runs itself

A PostToolUse hook in `.claude/settings.json` runs `scripts/voice/cli.ts` on every file you edit under `content/` or `src/app` / `src/components`. If it reports errors, rewrite the flagged sentences (not a synonym swap; say the concrete thing) and keep going until it's clean. Warnings come back as context: fix them if they're figurative or filler, leave them if they're literal.

If a flag is wrong (a literal "landscape," words quoted from a source), leave the text and tell Prannoy. Don't edit `scripts/voice/allowlist.json` or the rules yourself.

Before you finish any copy work, run `npm run voice -- <files you touched>` and report what's left.
