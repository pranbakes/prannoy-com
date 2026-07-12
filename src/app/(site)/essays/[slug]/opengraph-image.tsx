import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { reader } from "@/lib/reader";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await reader.collections.essays.read(slug);

  if (entry?.ogImage) {
    try {
      const bytes = await readFile(
        path.join(process.cwd(), "public", entry.ogImage)
      );
      return new Response(new Uint8Array(bytes), {
        headers: { "Content-Type": "image/png" },
      });
    } catch {
      // frontmatter points at a missing file — fall through to the generated fallback
    }
  }

  const fontData = await readFile(
    path.join(process.cwd(), "src/fonts/EBGaramond-Medium.woff")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#1E2B24",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontFamily: "EB Garamond",
            fontSize: 64,
            fontWeight: 500,
            color: "#EDEAE0",
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          {entry?.title ?? "Prannoy Nambiar"}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            color: "#8C968F",
          }}
        >
          prannoy.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "EB Garamond",
          data: fontData,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
