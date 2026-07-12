export type Tagged = { tags: readonly string[] };

export function uniqueTags(items: readonly Tagged[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) set.add(tag);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function filterByTag<T extends Tagged>(
  items: readonly T[],
  tag: string
): T[] {
  return items.filter((item) => item.tags.includes(tag));
}

export function collectTagCounts(
  collections: readonly (readonly Tagged[])[]
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const collection of collections) {
    for (const item of collection) {
      for (const tag of item.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
  }
  return counts;
}
