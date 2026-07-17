This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Writer paneli

Yazılar `content/*.md` dosyalarında tutulur. Bunları elle düzenleyebilir ya da
yerel writer panelini kullanabilirsin:

```bash
npm run dev   # → http://localhost:3000/writer
```

Panel şifreyi `.env.local` içindeki `WRITER_PASSWORD` değişkeninden okur (dosya
git'e girmez):

```
WRITER_PASSWORD=senin-sifren
```

Kaydettiğin yazılar doğrudan `content/` klasörüne yazılır; yayınlamak için commit
edip push etmen yeterli.

Panel ve API'si `page.dev.tsx` / `route.dev.ts` uzantılarını kullanır. `next.config.ts`
içindeki `pageExtensions` ayarı sayesinde bunlar yalnızca `next dev` derlemesinde
tanınır — `npm run build` ile üretilen statik siteye dahil edilmezler.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
