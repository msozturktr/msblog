import fs from "node:fs";
import path from "node:path";

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  tags: string[];
  content: string[];
};

export const CONTENT_DIR = path.join(process.cwd(), "content");

/** Slugs are used as filenames, so keep them strictly safe. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const TR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  â: "a",
  î: "i",
  û: "u",
};

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[çğıöşüâîû]/g, (c) => TR_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePost(slug: string, raw: string): Post {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    throw new Error(`${slug}.md: frontmatter bloğu bulunamadı`);
  }

  const [, frontmatter, body] = match;
  const fields: Record<string, string> = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();
    fields[key] = value.replace(/^["']|["']$/g, "");
  }

  return {
    slug,
    title: fields.title ?? slug,
    date: fields.date ?? "",
    excerpt: fields.excerpt ?? "",
    tags: fields.tags
      ? fields.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    content: body
      .trim()
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };
}

/** Turns a post back into the on-disk `content/<slug>.md` representation. */
export function serializePost(post: Omit<Post, "slug">): string {
  const frontmatter = [
    `title: ${post.title}`,
    `date: ${post.date}`,
    `excerpt: ${post.excerpt}`,
    `tags: ${post.tags.join(", ")}`,
  ].join("\n");

  return `---\n${frontmatter}\n---\n\n${post.content.join("\n\n").trim()}\n`;
}

export function getSortedPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      return parsePost(slug, fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  if (!SLUG_PATTERN.test(slug)) return undefined;
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return undefined;
  return parsePost(slug, fs.readFileSync(file, "utf8"));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Rough reading time in minutes based on ~200 words/min. */
export function readingTime(content: string[]): number {
  const words = content.join(" ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
