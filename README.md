# prannoy.com

Personal site — essays, poems, a corkboard, and projects. Next.js (App Router) + Tailwind + Keystatic.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, [http://localhost:3000/admin](http://localhost:3000/admin) for the Keystatic editor (redirects to `/keystatic`, where the app actually lives — see note in `keystatic.config.ts`).

Content lives as markdown/YAML files under `content/`, edited either directly or through `/admin`.

## Testing

Pure logic (tag aggregation, essay anchor matching) has unit tests, run with Node's built-in test runner:

```bash
npm test
```

## Keystatic: local vs. GitHub storage

`keystatic.config.ts` switches storage automatically based on environment — no code change needed to move between them:

- **Local dev** (`npm run dev` or a local `npm run build`): writes directly to the filesystem in `content/`.
- **Deployed on Vercel** (`VERCEL` env var is set): reads/writes through the GitHub API instead, via a GitHub App, since Vercel's filesystem isn't writable/persistent.

Setting up the GitHub App for production editing is a one-time, mostly-manual process — see the walkthrough the assistant provided, or Keystatic's own docs at https://keystatic.com/docs/github-model. Required environment variables (set in Vercel Project Settings → Environment Variables, and in `.env.local` for anything you want to test locally in GitHub mode):

| Variable | Where it comes from | What it's for |
|---|---|---|
| `KEYSTATIC_GITHUB_REPO` | You choose it — `owner/repo` | Which repo Keystatic commits to |
| `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub App settings page | OAuth client ID for the app |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub App settings page | OAuth client secret |
| `KEYSTATIC_SECRET` | Generate: `openssl rand -hex 32` | Signs Keystatic's session cookies |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | The `/apps/<slug>` part of your app's URL | Public — browser needs it to build install/auth links |
| `NEXT_PUBLIC_SITE_URL` | Your production domain | RSS links, sitemap URLs, OG image resolution |
| `BUTTONDOWN_API_KEY` | https://buttondown.com/settings/api | Server-side only, powers `/api/subscribe` |

See `.env.example` for a copyable template.
