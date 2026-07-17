import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getSortedPosts, formatDate, readingTime } from "@/lib/posts";
import ReadingProgress from "@/components/ReadingProgress";

export function generateStaticParams() {
  return getSortedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <>
      <ReadingProgress />

      <article className="animate-rise space-y-10">
        <div className="space-y-5">
          <Link
            href="/blog"
            className="link-underline inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            ← Tüm yazılar
          </Link>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="chip">
                #{t}
              </span>
            ))}
          </div>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-muted">
            <time>{formatDate(post.date)}</time>
            <span className="h-1 w-1 rounded-full bg-muted/50" />
            <span>{readingTime(post.content)} dk okuma</span>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-violet/50 via-cyan/30 to-transparent" />

        <div className="prose space-y-6">
          {post.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8">
          <Link href="/blog" className="btn-ghost">
            ← Diğer yazılara dön
          </Link>
        </div>
      </article>
    </>
  );
}
