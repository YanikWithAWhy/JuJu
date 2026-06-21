import Link from "next/link";
import { Award, FileDown, Link2, Share2, ShieldCheck, Swords, Workflow } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { Reveal } from "@/components/ui/reveal";
import { BeltCard } from "@/components/ui/belt-card";
import { ShineLink } from "@/components/ui/shine-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AnchorLink } from "@/components/ui/anchor-link";
import { BELTS } from "@/data/belts";

const steps = [
  {
    icon: Award,
    title: "Gürtelgrad wählen",
    text: "Starte mit dem Grad, auf den du trainierst – von Gelb (5. Kyu) bis Braun (1. Kyu). Das passende Prüfungsprogramm lädt automatisch.",
  },
  {
    icon: Workflow,
    title: "Techniken & Flowcharts",
    text: "Pro Technik trägst du den Angriff ein und baust ein Flowchart aus Verteidigung und Gegentechnik. Stock- und Messerangriffe sind bereits vorgegeben.",
  },
  {
    icon: Share2,
    title: "Teilen & exportieren",
    text: "Speichere alles in einem teilbaren Link oder exportiere dein Programm als sauberes PDF – ideal zur Prüfungsvorbereitung.",
  },
];

const features = [
  {
    icon: Workflow,
    title: "Verteidigungs-Flowcharts",
    text: "Angriff → Verteidigung → Gegentechnik als visuelle Kette, beliebig um weitere Schritte erweiterbar.",
  },
  {
    icon: Swords,
    title: "Stock & Messer vorausgefüllt",
    text: "Die Angriffswinkel sind je nach Graduierung automatisch eingetragen – du ergänzt nur deine Abwehr.",
  },
  {
    icon: Link2,
    title: "Teilbarer Link",
    text: "Dein komplettes Programm steckt im Link. Kein Account, kein Server – einfach kopieren und weitergeben.",
  },
  {
    icon: FileDown,
    title: "PDF-Export",
    text: "Druckoptimierte Ansicht mit sauberem Seitenumbruch über den Browser-Druckdialog.",
  },
];

export default function Home() {
  return (
    <main className="relative">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-sm font-semibold tracking-tight text-white">
          Ju-Jutsu<span className="text-white/40"> / Prüfung</span>
        </Link>
        <div className="flex items-center gap-3">
          <AnchorLink href="#gurte" className="text-sm text-white/60 transition-colors hover:text-white">
            Gürtel wählen
          </AnchorLink>
          <ThemeToggle />
        </div>
      </header>

      <Hero />

      {/* ---------------------------------------------------------- */}
      {/* So funktioniert's                                          */}
      {/* ---------------------------------------------------------- */}
      <section id="ablauf" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/40">In drei Schritten</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Vom Gürtelgrad zum fertigen Prüfungsprogramm
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="glass relative h-full rounded-2xl p-7">
                <div className="mb-6 flex items-center justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
                    <step.icon className="size-5" />
                  </span>
                  <span className="text-5xl font-semibold leading-none text-white/[0.08]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Gürtelauswahl                                              */}
      {/* ---------------------------------------------------------- */}
      <section id="gurte" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-32">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/40">Schritt 1</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Auf welchen Grad trainierst du?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/55">
            Wähle deine angestrebte Graduierung. Du kommst direkt in den Programm-Editor.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BELTS.map((belt, i) => (
            <BeltCard key={belt.id} belt={belt} index={i} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Features                                                   */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/40">Alles dabei</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Gebaut für die Prüfungsvorbereitung
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 2) * 0.1}>
              <div className="glass flex h-full gap-4 rounded-2xl p-6">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
                  <feature.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{feature.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* CTA                                                        */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(60% 80% at 50% 0%, rgba(99,102,241,0.18), transparent 70%)",
              }}
            />
            <div className="relative">
              <ShieldCheck className="mx-auto mb-5 size-9 text-white/70" />
              <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Bereit für deine nächste Prüfung?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/55">
                Erstelle dein persönliches Prüfungsprogramm in wenigen Minuten.
              </p>
              <div className="mt-9 flex justify-center">
                <ShineLink href="#gurte" accent="#6366f1">
                  Jetzt Gürtel wählen
                </ShineLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-sm text-white/40 sm:flex-row sm:text-left">
          <span>Ju-Jutsu Prüfungsprogramm — inoffizielles Hilfstool zur Prüfungsvorbereitung.</span>
          <span>
            Programminhalte nach{" "}
            <a
              href="https://seimitsu.de/de"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 underline-offset-4 hover:text-white hover:underline"
            >
              Seimitsu e.V. / DJJV
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
