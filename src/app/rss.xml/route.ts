import { reader } from "@/lib/reader";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://prannoy.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [essays, poems] = await Promise.all([
    reader.collections.essays.all(),
    reader.collections.poems.all(),
  ]);

  type FeedItem = {
    title: string;
    link: string;
    date: string;
    description: string;
  };

  const items: FeedItem[] = [
    ...essays.map(({ slug, entry }) => ({
      title: entry.title,
      link: `${SITE_URL}/essays/${slug}`,
      date: entry.date,
      description: entry.dek,
    })),
    ...poems.map(({ slug, entry }) => ({
      title: entry.title,
      link: `${SITE_URL}/poems/${slug}`,
      date: entry.date,
      description: "",
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const xmlItems = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid>${escapeXml(item.link)}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      ${item.description ? `<description>${escapeXml(item.description)}</description>` : ""}
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Prannoy Nambiar</title>
    <link>${SITE_URL}</link>
    <description>Essays and poems from prannoy.com</description>
    <language>en</language>
    ${xmlItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
