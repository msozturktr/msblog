import type { Metadata } from "next";
import Link from "next/link";
import { getSortedPosts, formatDate, readingTime } from "@/lib/posts";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "Yazılım, teknoloji ve düşünceler üzerine yazılar.",
};

export default function BlogPage() {
  const posts = getSortedPosts();

  return (
    <div className="space-y-14">
      <header className="animate-rise space-y-4">
        <span className="chip">✍️ {posts.length} yazı</span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Blog</span>
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Yazılım, teknoloji ve arada bir hayata dair düşünceler. Yeni bir şey
          öğrendiğimde buraya not düşüyorum.
        </p>
      </header>

      <ol className="space-y-4">
        {posts.map((post, i) => (
          <Reveal as="li" key={post.slug} delay={i * 80}>
            <Link
              href={`/blog/${post.slug}`}
              className="card group block p-6"
            >
              <div className="flex items-center gap-3 text-xs text-muted">
                <time>{formatDate(post.date)}</time>
                <span className="h-1 w-1 rounded-full bg-muted/50" />
                <span>{readingTime(post.content)} dk okuma</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight transition-colors group-hover:text-foreground">
                {post.title}
              </h2>
              <p className="mt-2 text-muted">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="chip">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="link-underline text-sm text-muted transition-colors group-hover:text-foreground">
                  Devamını oku →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
