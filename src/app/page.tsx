import Link from "next/link";
import { getSortedPosts, formatDate, readingTime } from "@/lib/posts";
import Reveal from "@/components/Reveal";

export default function Home() {
  const posts = getSortedPosts().slice(0, 3);

  return (
    <div className="space-y-28">
      {/* ---------------------------------------------------------------- */}
      {/*  Hero                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative">
        <div className="animate-rise space-y-7" style={{ animationDelay: "0ms" }}>
          <span className="chip">
            <span className="h-2 w-2 rounded-full bg-cyan" />
            Bilgisayar Mühendisi · Erzurum
          </span>

          <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Merhaba, ben{" "}
            <span className="gradient-text">Muhammed Sadullah Öztürk</span>
            <span className="caret" />
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted">
            Bilgisayar mühendisi ve yazılım geliştiricisiyim. Burada üzerinde
            çalıştığım projeleri, öğrendiklerimi ve düşüncelerimi paylaşıyorum.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/blog" className="btn-primary">
              Blog&apos;u oku
              <span aria-hidden>→</span>
            </Link>
            <Link href="/hakkimda" className="btn-ghost">
              Hakkımda
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Latest posts                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="space-y-10">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Son Yazılar</h2>
            <p className="mt-2 text-muted">Yakın zamanda kaleme aldıklarım.</p>
          </div>
          <Link
            href="/blog"
            className="link-underline shrink-0 text-sm text-muted transition-colors hover:text-foreground"
          >
            Tümü →
          </Link>
        </Reveal>

        <ul className="space-y-5">
          {posts.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={i * 90}>
              <Link
                href={`/blog/${post.slug}`}
                className="card group flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <time>{formatDate(post.date)}</time>
                    <span className="h-1 w-1 rounded-full bg-muted/50" />
                    <span>{readingTime(post.content)} dk okuma</span>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-foreground">
                    {post.title}
                  </h3>
                  <p className="max-w-lg text-muted">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.tags.map((t) => (
                      <span key={t} className="chip">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 text-lg text-muted transition-all group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-violet group-hover:to-cyan group-hover:text-white"
                >
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  CTA                                                             */}
      {/* ---------------------------------------------------------------- */}
      <Reveal as="section">
        <div className="card relative overflow-hidden p-10 text-center">
          <div className="absolute -top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet/20 blur-3xl" />
          <div className="relative space-y-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Bir fikrin mi var? Konuşalım.
            </h2>
            <p className="mx-auto max-w-md text-muted">
              Projeler, iş birlikleri ya da sadece merhaba demek için her zaman
              açığım.
            </p>
            <div className="pt-2">
              <a href="mailto:muhammedsadullahozturk@gmail.com" className="btn-primary">
                İletişime geç
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
