"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/blog", label: "Blog" },
  { href: "/hakkimda", label: "Hakkımda" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm">
      {nav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative rounded-full px-3 py-1.5 transition-colors ${
              active
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {active && (
              <span className="absolute inset-0 -z-10 rounded-full bg-white/8 ring-1 ring-white/10" />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
