import { config, fields, collection } from "@keystatic/core";

const tags = () =>
  fields.array(fields.text({ label: "Tag" }), {
    label: "Tags",
    itemLabel: (props) => props.value || "Tag",
  });

/**
 * This file is imported by both server code and the browser-side Keystatic
 * app, so every value it needs must be a variable Next.js inlines
 * identically into both bundles — that means NEXT_PUBLIC_-prefixed. Two
 * bugs already came from getting this wrong: a plain process.env.VERCEL
 * check for storage.kind, and a plain KEYSTATIC_GITHUB_REPO for the repo
 * itself. Both silently resolved to undefined in the browser (Next.js only
 * inlines NEXT_PUBLIC_* client-side), so the server thought "github" while
 * the browser's GraphQL queries got null owner/name variables. Neither the
 * mode switch nor the repo name is sensitive, so both are fine to expose.
 */
const storage = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
  ? {
      kind: "github" as const,
      repo: process.env
        .NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}`,
    }
  : { kind: "local" as const };

export default config({
  storage,
  ui: {
    navigation: {
      Writing: ["essays", "poems"],
      Board: ["corkboard"],
      Site: ["projects"],
    },
  },
  collections: {
    essays: collection({
      label: "Essays",
      slugField: "title",
      path: "content/essays/*/",
      format: { contentField: "body" },
      entryLayout: "content",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Date", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        dek: fields.text({
          label: "Dek",
          description: "One-sentence summary shown in the essays index.",
          multiline: true,
        }),
        tags: tags(),
        thumbnail: fields.image({
          label: "Thumbnail",
          description: "64px index thumbnail. Not used as an in-page hero.",
          directory: "content/essays",
          publicPath: "/images/essays/",
        }),
        ogImage: fields.image({
          label: "OG image",
          directory: "content/essays",
          publicPath: "/images/essays/",
        }),
        body: fields.document({
          label: "Body",
          formatting: {
            inlineMarks: true,
            listTypes: true,
            headingLevels: [2, 3],
            blockTypes: { blockquote: true },
          },
          links: true,
          dividers: true,
        }),
        annotations: fields.array(
          fields.object({
            anchorId: fields.text({
              label: "Anchor ID",
              description:
                'Matches the URL fragment of an in-body link (e.g. highlight text in the body and link it to "#cite-1", then put "cite-1" here). Leave blank for a "see also" pointer — filling this in is what makes this a "note".',
            }),
            text: fields.text({ label: "Text", multiline: true }),
          }),
          {
            label: "Annotations",
            itemLabel: (props) => props.fields.text.value || "Annotation",
          }
        ),
      },
    }),
    poems: collection({
      label: "Poems",
      slugField: "title",
      path: "content/poems/*",
      format: "yaml",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Date", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        tags: tags(),
        body: fields.text({
          label: "Body",
          description:
            "Plain text. Line breaks are authorial and preserved exactly as typed.",
          multiline: true,
        }),
        provenance: fields.object(
          {
            journal: fields.text({ label: "Journal" }),
            year: fields.text({ label: "Year" }),
            url: fields.url({ label: "URL", validation: { isRequired: false } }),
          },
          {
            label: "Provenance",
            description: "Optional. Leave journal blank to omit.",
          }
        ),
      },
    }),
    corkboard: collection({
      label: "Corkboard",
      slugField: "slug",
      path: "content/corkboard/*/",
      columns: ["date", "attribution"],
      schema: {
        slug: fields.slug({ name: { label: "Slug" } }),
        date: fields.date({ label: "Date", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        tags: tags(),
        content: fields.conditional(
          fields.select({
            label: "Type",
            options: [
              { label: "Quote", value: "quote" },
              { label: "Image", value: "image" },
              { label: "Video", value: "video" },
              { label: "Music", value: "music" },
            ],
            defaultValue: "quote",
          }),
          {
            quote: fields.text({ label: "Quote text", multiline: true }),
            image: fields.image({
              label: "Image",
              directory: "content/corkboard",
              publicPath: "/images/corkboard/",
              validation: { isRequired: true },
            }),
            video: fields.url({
              label: "Video URL",
              validation: { isRequired: true },
            }),
            music: fields.url({
              label: "Spotify embed URL",
              validation: { isRequired: true },
            }),
          }
        ),
        attribution: fields.text({
          label: "Attribution",
          description: "Who made it.",
        }),
        comment: fields.text({
          label: "Comment",
          description:
            "Required on every pin. You cannot pin something you haven't formed a thought about.",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "content/projects/*/",
      columns: ["title", "status"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "live", value: "live" },
            { label: "in progress", value: "in-progress" },
            { label: "acquired", value: "acquired" },
          ],
          defaultValue: "in-progress",
        }),
        tags: tags(),
        stack: fields.array(fields.text({ label: "Item" }), {
          label: "Stack",
          description: "Tech used. Separate from tags — this is not part of the shared taxonomy.",
          itemLabel: (props) => props.value || "Item",
        }),
        thumbnail: fields.image({
          label: "Thumbnail",
          directory: "content/projects",
          publicPath: "/images/projects/",
        }),
        url: fields.url({ label: "URL", validation: { isRequired: false } }),
      },
    }),
  },
});
