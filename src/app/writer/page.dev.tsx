"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

type Draft = {
  originalSlug: string; // boşsa yeni yazı
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string;
  content: string;
};

const EMPTY_DRAFT: Draft = {
  originalSlug: "",
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  tags: "",
  content: "",
};

function toDraft(post: Post): Draft {
  return {
    originalSlug: post.slug,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tags: post.tags.join(", "),
    content: post.content.join("\n\n"),
  };
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-violet/60";

export default function WriterPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const call = useCallback(
    async (init: RequestInit & { query?: string } = {}, pw = password) => {
      const { query = "", ...rest } = init;
      const res = await fetch(`/api/writer${query}`, {
        ...rest,
        headers: { "content-type": "application/json", "x-writer-password": pw },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bir şeyler ters gitti.");
      return data as { posts: Post[]; slug?: string };
    },
    [password],
  );

  // Sayfa yenilendiğinde şifreyi tekrar sormamak için (yalnızca bu sekme boyunca).
  useEffect(() => {
    const saved = sessionStorage.getItem("writer-password");
    if (!saved) return;
    call({}, saved)
      .then((data) => {
        setPassword(saved);
        setPosts(data.posts);
        setUnlocked(true);
      })
      .catch(() => sessionStorage.removeItem("writer-password"));
  }, [call]);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const data = await call();
      sessionStorage.setItem("writer-password", password);
      setPosts(data.posts);
      setUnlocked(true);
    });
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const data = await call({ method: "POST", body: JSON.stringify(draft) });
      setPosts(data.posts);
      setDraft((d) => ({ ...d, originalSlug: data.slug!, slug: data.slug! }));
      setStatus(`content/${data.slug}.md kaydedildi`);
      setTimeout(() => setStatus(""), 3000);
    });
  };

  const remove = (slug: string) => {
    if (!confirm(`"${slug}" yazısı silinsin mi? Bu işlem geri alınamaz.`)) return;
    run(async () => {
      const data = await call({ method: "DELETE", query: `?slug=${slug}` });
      setPosts(data.posts);
      if (draft.originalSlug === slug) setDraft(EMPTY_DRAFT);
      setStatus(`content/${slug}.md silindi`);
      setTimeout(() => setStatus(""), 3000);
    });
  };

  if (!unlocked) {
    return (
      <div className="animate-rise mx-auto max-w-sm space-y-6 pt-10">
        <div className="space-y-2">
          <span className="chip">🔒 Yerel panel</span>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Writer</span>
          </h1>
          <p className="text-sm text-muted">
            Devam etmek için şifreni gir.
          </p>
        </div>

        <form onSubmit={unlock} className="card card-static space-y-4 p-6">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className={inputClass}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="btn-ghost w-full justify-center">
            {busy ? "Kontrol ediliyor…" : "Gir"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-rise space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="chip">✍️ {posts.length} yazı</span>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Writer</span>
          </h1>
        </div>
        <button onClick={() => setDraft(EMPTY_DRAFT)} className="btn-ghost">
          + Yeni yazı
        </button>
      </header>

      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <ol className="space-y-2">
          {posts.map((post) => {
            const active = draft.originalSlug === post.slug;
            return (
              <li key={post.slug} className="flex items-center gap-1">
                <button
                  onClick={() => setDraft(toDraft(post))}
                  className={`flex-1 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    active ? "bg-violet/20 text-foreground" : "text-muted hover:bg-white/5"
                  }`}
                >
                  <span className="block truncate">{post.title}</span>
                  <span className="block text-xs text-muted/70">{post.date}</span>
                </button>
                <button
                  onClick={() => remove(post.slug)}
                  aria-label={`${post.title} yazısını sil`}
                  className="rounded-lg px-2 py-2 text-sm text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ol>

        <form onSubmit={save} className="card card-static space-y-4 p-6">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-xs text-muted">Başlık</label>
            <input
              id="title"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Yazının başlığı"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="date" className="text-xs text-muted">Tarih</label>
              <input
                id="date"
                type="date"
                value={draft.date}
                onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tags" className="text-xs text-muted">Etiketler (virgülle)</label>
              <input
                id="tags"
                value={draft.tags}
                onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
                placeholder="yazılım, düşünce"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="slug" className="text-xs text-muted">
              Slug{" "}
              <span className="text-muted/60">
                — boş bırakırsan başlıktan üretilir (dosya adı: content/&lt;slug&gt;.md)
              </span>
            </label>
            <input
              id="slug"
              value={draft.slug}
              onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
              placeholder="otomatik"
              className={`${inputClass} font-mono`}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="excerpt" className="text-xs text-muted">Özet</label>
            <input
              id="excerpt"
              value={draft.excerpt}
              onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
              placeholder="Liste sayfasında görünecek kısa açıklama"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="content" className="text-xs text-muted">
              İçerik{" "}
              <span className="text-muted/60">— boş satır bırakarak paragraf ayır</span>
            </label>
            <textarea
              id="content"
              rows={16}
              value={draft.content}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              placeholder="Yazmaya başla…"
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {status && <p className="text-sm text-cyan">{status}</p>}

          <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-4">
            <button type="submit" disabled={busy} className="btn-ghost">
              {busy ? "Kaydediliyor…" : "Kaydet"}
            </button>
            {draft.originalSlug && (
              <Link href={`/blog/${draft.originalSlug}`} className="link-underline text-sm text-muted">
                Sitede gör →
              </Link>
            )}
          </div>
        </form>
      </div>

      <p className="text-xs text-muted/70">
        Kaydettiğin yazılar <span className="font-mono">content/</span> klasörüne
        yazılır. Yayınlamak için commit edip push etmen yeterli.
      </p>
    </div>
  );
}
