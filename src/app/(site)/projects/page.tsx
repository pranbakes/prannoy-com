import type { Metadata } from "next";
import { reader } from "@/lib/reader";

export const metadata: Metadata = {
  title: "Projects",
};

const statusLabel: Record<string, string> = {
  live: "live",
  "in-progress": "in progress",
  acquired: "acquired",
};

export default async function ProjectsPage() {
  const projects = await reader.collections.projects.all();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-page-h1 font-medium">Projects</h1>
      <ul className="mt-8 divide-y divide-dashed divide-rule">
        {projects.map(({ slug, entry }) => (
          <li key={slug} className="py-5">
            <div className="flex items-baseline justify-between">
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-serif text-list-title"
                >
                  {entry.title}
                </a>
              ) : (
                <p className="font-serif text-list-title">{entry.title}</p>
              )}
              <span className="font-hand text-pen">
                {statusLabel[entry.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{entry.description}</p>
            {entry.stack.length > 0 && (
              <p className="mt-1 text-xs text-muted">
                {entry.stack.join(" · ")}
              </p>
            )}
          </li>
        ))}
        {projects.length === 0 && (
          <li className="py-5 font-hand text-lg text-pen">coming soon</li>
        )}
      </ul>
    </div>
  );
}
