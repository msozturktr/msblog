import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  CONTENT_DIR,
  SLUG_PATTERN,
  getSortedPosts,
  serializePost,
  slugify,
} from "@/lib/posts";

/**
 * Writer paneli yalnızca yerelde (`npm run dev`) çalışır. Bu dosya `.dev.ts`
 * uzantısı sayesinde `next build` çıktısına hiç dahil edilmez; aşağıdaki kontrol
 * yine de ikinci bir emniyet kemeri.
 */
const isDev = process.env.NODE_ENV === "development";

function passwordOk(request: Request): boolean {
  const expected = process.env.WRITER_PASSWORD;
  if (!expected) return false;

  const given = request.headers.get("x-writer-password") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function guard(request: Request): NextResponse | null {
  if (!isDev) {
    return NextResponse.json({ error: "Yalnızca dev modda" }, { status: 404 });
  }
  if (!process.env.WRITER_PASSWORD) {
    return NextResponse.json(
      { error: ".env.local içinde WRITER_PASSWORD tanımlı değil." },
      { status: 500 },
    );
  }
  if (!passwordOk(request)) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }
  return null;
}

function postFile(slug: string): string {
  return path.join(CONTENT_DIR, `${slug}.md`);
}

export async function GET(request: Request) {
  const denied = guard(request);
  if (denied) return denied;

  return NextResponse.json({ posts: getSortedPosts() });
}

export async function POST(request: Request) {
  const denied = guard(request);
  if (denied) return denied;

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Başlık boş olamaz." }, { status: 400 });
  }

  const slug = String(body.slug ?? "").trim() || slugify(title);
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { error: `Geçersiz slug: "${slug}". Sadece küçük harf, rakam ve tire.` },
      { status: 400 },
    );
  }

  const originalSlug = String(body.originalSlug ?? "").trim();
  const isRename = originalSlug && originalSlug !== slug;
  const isNew = !originalSlug;

  if ((isNew || isRename) && fs.existsSync(postFile(slug))) {
    return NextResponse.json(
      { error: `"${slug}" adlı bir yazı zaten var.` },
      { status: 409 },
    );
  }

  const markdown = serializePost({
    title,
    date: String(body.date ?? "").trim() || new Date().toISOString().slice(0, 10),
    excerpt: String(body.excerpt ?? "").trim(),
    tags: Array.isArray(body.tags)
      ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
      : String(body.tags ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    content: String(body.content ?? "")
      .trim()
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  });

  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(postFile(slug), markdown, "utf8");

  if (isRename && SLUG_PATTERN.test(originalSlug)) {
    fs.rmSync(postFile(originalSlug), { force: true });
  }

  return NextResponse.json({ slug, posts: getSortedPosts() });
}

export async function DELETE(request: Request) {
  const denied = guard(request);
  if (denied) return denied;

  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "Geçersiz slug." }, { status: 400 });
  }
  if (!fs.existsSync(postFile(slug))) {
    return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
  }

  fs.rmSync(postFile(slug));
  return NextResponse.json({ posts: getSortedPosts() });
}
