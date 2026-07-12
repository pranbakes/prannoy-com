import type { MetadataRoute } from "next";
import { reader } from "@/lib/reader";
import { uniqueTags } from "@/lib/tags";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://prannoy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [essays, poems, pins, projects] = await Promise.all([
    reader.collections.essays.all(),
    reader.collections.poems.all(),
    reader.collections.corkboard.all(),
    reader.collections.projects.all(),
  ]);

  const tags = uniqueTags([
    ...essays.map((e) => e.entry),
    ...poems.map((e) => e.entry),
    ...pins.map((e) => e.entry),
    ...projects.map((e) => e.entry),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/essays",
    "/poems",
    "/corkboard",
    "/projects",
    "/about",
    "/tags",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const essayRoutes: MetadataRoute.Sitemap = essays.map(({ slug, entry }) => ({
    url: `${SITE_URL}/essays/${slug}`,
    lastModified: entry.date,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const poemRoutes: MetadataRoute.Sitemap = poems.map(({ slug, entry }) => ({
    url: `${SITE_URL}/poems/${slug}`,
    lastModified: entry.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}/tags/${encodeURIComponent(tag)}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...essayRoutes, ...poemRoutes, ...tagRoutes];
}
