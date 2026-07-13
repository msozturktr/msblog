import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Spotlight from "@/components/Spotlight";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "msblog — Muhammed Sadullah Öztürk",
    template: "%s · msblog",
  },
  description:
    "Muhammed Sadullah Öztürk'ün kişisel websitesi ve blogu. Yazılım, teknoloji ve düşünceler.",
  openGraph: {
    title: "msblog — Muhammed Sadullah Öztürk",
    description: "Yazılım, teknoloji ve düşünceler üzerine.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        {/* Ambient background layers */}
        <div className="aurora">
          <div className="aurora-spark" />
        </div>
        <div className="grid-fade" />
        <div className="grain" />
        <Spotlight />

        <header className="sticky top-0 z-50">
          <div className="glass border-b border-white/5">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3.5">
              <Link
                href="/"
                className="group flex items-center gap-2 font-mono text-lg font-bold tracking-tight"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet to-cyan text-sm text-white shadow-lg shadow-violet/30 transition-transform group-hover:rotate-12">
                  m
                </span>
                <span className="gradient-text">msblog</span>
              </Link>
              <Nav />
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 py-16">
          {children}
        </main>

        <footer className="relative z-10 border-t border-white/5">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Muhammed Sadullah Öztürk ·{" "}
              <span className="text-foreground/70">msblog</span>
            </p>
            <div className="flex gap-5">
              <a
                href="mailto:muhammedsadullahozturk@gmail.com"
                className="link-underline transition-colors hover:text-foreground"
              >
                E-posta
              </a>
              <a
                href="https://github.com/msozturktr"
                target="_blank"
                rel="noreferrer"
                className="link-underline transition-colors hover:text-foreground"
              >
                GitHub
              </a>
              <Link
                href="/blog"
                className="link-underline transition-colors hover:text-foreground"
              >
                Blog
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
