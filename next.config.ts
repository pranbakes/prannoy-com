import type { NextConfig } from "next";

// Ghost served posts/pages at the domain root (prannoy.com/<slug>); the new
// site nests them under /essays/<slug>. These preserve old links (and SEO
// value) across the DNS cutover from Ghost. "about" isn't here because it
// already matches the new site's own /about page with no redirect needed.

// Slugs that were migrated into content/essays/ with the same slug — these
// go straight to their new home instead of the generic essays index.
const MIGRATED_ESSAY_SLUGS = [
  "post-mortem-my-startup-journey",
  "what-business-leaders-can-learn-from-teachers",
  "proof-of-learning-after-ai",
  "the-full-loop-from-learning-to-proof-of-capability",
  "why-ai-tutors-struggle-to-teach",
];

// Everything else that was ever published on Ghost (older EdTech posts, the
// Poetry page at /writing, the Advising page) has no equivalent on the new
// site — these fall back to the essays index rather than 404ing.
const ORPHANED_GHOST_SLUGS = [
  "writing",
  "advising",
  "3-ways-that-learning-has-changed-for-good",
  "machine-learning-for-the-sake-of-future-learning",
  "the-rise-of-5g-and-its-impact-on-the-classroom",
  "looking-ahead-the-future-implications-of-social-distancing-on-education",
  "the-distance-learning-phenomenon-what-is-it-and-where-will-it-take-us",
  "the-surge-in-need-for-remote-therapy-solutions-for-students",
  "homeschooling-for-working-parents-how-to-handle-at-home-education",
  "mental-health-and-safety-product-approaches-to-pressing-issues-facing-students",
  "i-spoke-to-more-than-100-recruiters-and-headhunters-heres-what-i-learned",
  "putting-the-hiring-manager-in-the-hot-seat",
  "hear-me-out-recording-conversations-makes-recruiting-better-for-everyone",
  "edtech-trends-to-look-for-in-2020-and-beyond",
  "mental-health-and-safety-product-approaches-to-pressing-issues-facing-students-676d8baba1b531001bb08d59",
  "emerging-technologies-in-the-2020-classroom",
  "wcag-accessibility-is-the-next-big-edtech-trend",
  "the-pursuit-of-lifelong-learning-how-micro-credentials-ignited-the-third-wave-of-education",
  "the-evolution-of-the-talent-profile",
  "fostering-mental-health-and-brain-development-through-social-emotional-learning-sel-technology",
  "lifting-the-labor-force-trends-in-workforce-technology",
  "artificial-intelligence-in-education",
  "personalized-learning-platforms-a-case-for-slow-and-steady-product-development",
  "virtual-augmented-reality-in-schools",
];

const nextConfig: NextConfig = {
  // Keystatic's local-mode reader does runtime fs reads on content/, which
  // Next's automatic file-tracing can't detect through static analysis —
  // without this, dynamic routes (essays index, essay pages, tags, etc.)
  // get deployed without content/ bundled in, while statically-prerendered
  // routes like the homepage look fine since they run during `next build`
  // with the full repo checkout available.
  outputFileTracingIncludes: {
    "/**": ["./content/**"],
  },
  async redirects() {
    return [
      { source: "/admin", destination: "/keystatic", permanent: false },
      {
        source: "/admin/:path*",
        destination: "/keystatic/:path*",
        permanent: false,
      },
      ...MIGRATED_ESSAY_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: `/essays/${slug}`,
        permanent: true,
      })),
      ...ORPHANED_GHOST_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: "/essays",
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
