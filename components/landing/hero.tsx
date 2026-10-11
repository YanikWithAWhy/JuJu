"use client";

import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { ShineLink } from "@/components/ui/shine-button";

function AnimatedText({ text, delayBase, className }: { text: string; delayBase: number; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: delayBase + i * 0.035, type: "spring", stiffness: 150, damping: 18 }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <BackgroundPaths />

      {/* blend into the page below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--color-background)]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/65 backdrop-blur"
      >
        <span className="size-1.5 rounded-full bg-emerald-400" />
        Nach DJJV-Prüfungsordnung · Seimitsu e.V. · 5. Kyu – 5. Dan
      </motion.div>

      <h1 className="relative z-10 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
        <AnimatedText text="Ju-Jutsu" delayBase={0.15} className="block text-white" />
        <AnimatedText
          text="Prüfungsprogramm"
          delayBase={0.45}
          className="mt-1 block bg-gradient-to-b from-white to-white/35 bg-clip-text text-transparent"
        />
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.7 }}
        className="relative z-10 mt-7 max-w-xl text-balance text-base text-white/55 sm:text-lg"
      >
        Wähle deinen Gürtelgrad, trage deine Techniken mit Angriff und
        Verteidigungs-Flowchart ein – und exportiere dein Programm als Link oder PDF.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.25, duration: 0.7 }}
        className="relative z-10 mt-10 flex flex-col items-center gap-3 sm:flex-row"
      >
        <ShineLink href="#gurte" accent="#6366f1">
          Programm erstellen
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </ShineLink>
        <ShineLink href="#ablauf" variant="ghost">
          Wie es funktioniert
        </ShineLink>
      </motion.div>

      <motion.a
        href="#ablauf"
        aria-label="Nach unten scrollen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-7 z-10 text-white/40 transition-colors hover:text-white/80"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <ChevronDown className="size-6" />
        </motion.span>
      </motion.a>
    </section>
  );
}
