"use client";

import { useState } from "react";

export default function VideoPin({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={url}
          className="h-full w-full"
          title="Video player"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="flex aspect-video w-full items-center justify-center bg-board"
      aria-label="Play video"
    >
      <svg viewBox="0 0 24 24" className="h-10 w-10 fill-pen">
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M9.5 7.5v9l8-4.5z" />
      </svg>
    </button>
  );
}
