import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Each post is a Markdown file in src/content/writing; its file name is its URL: /writing/<file name>/.
// A post with `draft: true` shows in `npm run dev` but is left out of the built site until the line is removed.
const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// Each book is a Markdown file in src/content/library; its cover is fetched from Open Library by ISBN
// when the page is built, so a new book needs no image of its own.
const library = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/library" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    // Written without spaces or dashes; the cover and the book's Open Library page come from it.
    // Coerced so a bare ISBN isn't read as a YAML number.
    isbn: z.coerce.string().regex(/^(97[89]\d{10}|\d{9}[\dX])$/i).optional(),
    note: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, library };
