import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import VideoPin from "@/components/video-pin";

export const metadata: Metadata = {
  title: "Corkboard",
};

const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"];

export default async function CorkboardPage() {
  const pins = await reader.collections.corkboard.all();
  const sorted = [...pins].sort((a, b) =>
    a.entry.date < b.entry.date ? 1 : -1
  );

  return (
    <div className="bg-paper-dark px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-page-h1 font-medium">Corkboard</h1>
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {sorted.map(({ slug, entry }, i) => (
            <div
              key={slug}
              className={`mb-4 break-inside-avoid bg-card p-4 shadow-sm ${
                rotations[i % rotations.length]
              }`}
            >
              <Pin content={entry.content} attribution={entry.attribution} />
              <p className="mt-3 border-t border-dashed border-rule pt-3 text-xs text-muted">
                {entry.attribution}
              </p>
              <p className="mt-2 font-hand text-pen">{entry.comment}</p>
            </div>
          ))}
        </div>
        {sorted.length === 0 && (
          <p className="mt-8 font-hand text-lg text-pen">coming soon</p>
        )}
      </div>
    </div>
  );
}

function Pin({
  content,
  attribution,
}: {
  content:
    | { discriminant: "quote"; value: string }
    | { discriminant: "image"; value: string }
    | { discriminant: "video"; value: string }
    | { discriminant: "music"; value: string };
  attribution: string;
}) {
  switch (content.discriminant) {
    case "quote":
      return (
        <p className="font-serif text-lg leading-snug">
          &ldquo;{content.value}&rdquo;
        </p>
      );
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={content.value} alt={attribution} className="w-full" />;
    case "video":
      return <VideoPin url={content.value} />;
    case "music":
      return (
        <iframe
          src={content.value}
          className="w-full"
          height={152}
          title="Spotify embed"
          style={{ border: 0 }}
        />
      );
  }
}
