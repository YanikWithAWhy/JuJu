"use client";

import { useEffect, useState } from "react";
import type { PruefungsfachDef } from "@/data/types";
import { cn } from "@/lib/cn";

export function BuilderToc({
  faecher,
  accent,
}: {
  faecher: PruefungsfachDef[];
  accent: string;
}) {
  const [active, setActive] = useState<number | null>(faecher[0]?.number ?? null);

  // Scroll-spy: the active fach is the last one whose top has scrolled past the
  // reference line just below the sticky header. Recomputed at most once per frame.
  useEffect(() => {
    const REFERENCE = 100;
    let ticking = false;

    const compute = () => {
      ticking = false;
      let current = faecher[0]?.number ?? null;
      for (const f of faecher) {
        const el = document.getElementById(`fach-${f.number}`);
        if (el && el.getBoundingClientRect().top <= REFERENCE) current = f.number;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [faecher]);

  const go = (n: number) => {
    document.getElementById(`fach-${n}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
      <p className="mb-2 px-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/35">
        Prüfungsfächer
      </p>
      <ul className="space-y-0.5">
        {faecher.map((f) => {
          const isActive = active === f.number;
          const dimmed = f.kind === "notExamined";
          return (
            <li key={f.number}>
              <button
                type="button"
                onClick={() => go(f.number)}
                style={isActive ? { boxShadow: `inset 2px 0 0 ${accent}` } : undefined}
                className={cn(
                  "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-white/[0.05] text-white"
                    : dimmed
                      ? "text-white/30 hover:text-white/60"
                      : "text-white/55 hover:bg-white/[0.03] hover:text-white/90",
                )}
              >
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-md text-[0.65rem] font-semibold"
                  style={
                    isActive
                      ? { backgroundColor: `${accent}29`, color: accent }
                      : { backgroundColor: "color-mix(in srgb, var(--fg) 5%, transparent)" }
                  }
                >
                  {f.number}
                </span>
                <span className="truncate">{f.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
