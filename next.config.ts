import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Yayın derlemesi tamamen statik HTML/CSS/JS üretir -> out/ klasörü.
  // Dev'de kapalı, çünkü writer paneli sunucu tarafı route handler'a ihtiyaç duyar.
  output: isDev ? undefined : "export",
  // *.dev.tsx / *.dev.ts sayfaları yalnızca dev derlemesinde tanınır; `next build`
  // bunları hiç görmez, yani writer paneli yayına çıkan siteye dahil edilmez.
  pageExtensions: isDev ? ["tsx", "ts", "dev.tsx", "dev.ts"] : ["tsx", "ts"],
  reactCompiler: true,
};

export default nextConfig;
