import type { NextConfig } from "next";

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
    ];
  },
};

export default nextConfig;
