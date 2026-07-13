export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  tags: string[];
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "merhaba-dunya",
    title: "Merhaba Dünya",
    date: "2026-07-13",
    excerpt: "msblog'un ilk yazısı — burada neler paylaşacağım?",
    tags: ["kişisel", "başlangıç"],
    content: [
      "Bu, msblog'daki ilk yazım. Burayı düşüncelerimi, öğrendiklerimi ve üzerinde çalıştığım projeleri paylaşmak için kullanacağım.",
      "Yazılım, teknoloji ve zaman zaman kişisel konulara değineceğim. Uğradığın için teşekkürler!",
    ],
  },
  {
    slug: "neden-blog-yaziyorum",
    title: "Neden Blog Yazıyorum?",
    date: "2026-07-10",
    excerpt: "Yazmak, düşünmenin en dürüst hâli. Kısa bir giriş.",
    tags: ["yazmak", "düşünce"],
    content: [
      "Yazmak, bir fikri gerçekten anlayıp anlamadığımı test etmenin en iyi yolu. Bir şeyi başkasına anlatabiliyorsan, onu biliyorsun demektir.",
      "Bu blog, kendime not tutmanın ve belki birilerine faydalı olmanın bir yolu.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getSortedPosts(): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
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
