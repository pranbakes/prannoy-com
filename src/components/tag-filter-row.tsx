import Link from "next/link";

export default function TagFilterRow({
  tags,
  basePath,
  activeTag,
}: {
  tags: readonly string[];
  basePath: string;
  activeTag?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <Link
        href={basePath}
        className={
          !activeTag ? "text-pen underline underline-offset-4" : "text-muted"
        }
      >
        all
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`${basePath}?tag=${encodeURIComponent(tag)}`}
          className={
            activeTag === tag
              ? "text-pen underline underline-offset-4"
              : "text-muted"
          }
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
