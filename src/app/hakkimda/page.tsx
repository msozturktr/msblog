import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Hakkımda",
  description: "Muhammed Sadullah Öztürk hakkında kısa bir tanıtım.",
};

export default function HakkimdaPage() {
  return (
    <div className="space-y-20">
      {/* Intro */}
      <section className="animate-rise space-y-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="animate-float grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-violet to-cyan text-3xl font-bold text-white shadow-2xl shadow-violet/40">
            MSÖ
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="gradient-text">Hakkımda</span>
            </h1>
            <p className="text-lg text-muted">
              Bilgisayar Mühendisi · Yazılım Geliştirici · Erzurum
            </p>
          </div>
        </div>

        <div className="prose space-y-6">
          <p>
            Merhaba! Ben Muhammed Sadullah Öztürk. Bilgisayar mühendisiyim ve
            yazılım geliştiriyorum.
          </p>
          <p>
            Bu site, üzerinde çalıştığım projeleri, öğrendiklerimi ve
            düşüncelerimi paylaşmak için oluşturuldu.
          </p>
        </div>
      </section>

      {/* Contact */}
      <Reveal as="section">
        <div className="card relative overflow-hidden p-10">
          <div className="absolute -bottom-1/2 right-0 h-64 w-64 rounded-full bg-cyan/20 blur-3xl" />
          <div className="relative space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">İletişim</h2>
            <p className="max-w-md text-muted">
              Bir soru, fikir ya da iş birliği için bana ulaşabilirsin.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="mailto:muhammedsadullahozturk@gmail.com"
                className="btn-primary"
              >
                E-posta gönder
              </a>
              <a
                href="https://github.com/msozturktr"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
