import Link from "next/link";
import type { Metadata } from "next";
import SiteChrome from "@/components/site-chrome";
import { Circle } from "@/components/red-pen";

export const metadata: Metadata = {
  title: "Not found — Prannoy Nambiar",
};

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="mx-auto flex max-w-4xl flex-col items-start px-6 py-24">
        <h1 className="font-serif text-page-h1 font-medium">
          Nothing <Circle>here</Circle>.
        </h1>
        <p className="mt-4 font-hand text-lg text-pen">
          wrong page, or a page that never got written
        </p>
        <Link
          href="/"
          className="mt-8 border-b border-dashed border-rule pb-1 text-sm text-muted hover:text-pen"
        >
          back to the front page
        </Link>
      </div>
    </SiteChrome>
  );
}
