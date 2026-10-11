"use client";

import { memo } from "react";
import { Ban, Hammer } from "lucide-react";
import type { PruefungsfachDef } from "@/data/types";
import { entryKey, type TechniqueEntry } from "@/lib/program-state";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";
import { TechniqueRow } from "./technique-row";

interface Props {
  fach: PruefungsfachDef;
  index: number;
  accent: string;
  entries: Record<string, TechniqueEntry>;
  onPatch?: (key: string, partial: Partial<TechniqueEntry>, fallbackAttack: string) => void;
}

function FachSectionImpl({ fach, index, accent, entries, onPatch }: Props) {
  const dimmed = fach.kind === "notExamined";

  return (
    <Reveal delay={Math.min(index, 6) * 0.04} y={20}>
      <section
        id={`fach-${fach.number}`}
        className={cn(
          "glass print-avoid-break scroll-mt-24 rounded-2xl p-5 sm:p-6",
          dimmed && "opacity-60",
        )}
      >
        <header className="flex items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
            style={
              fach.kind === "techniques"
                ? { backgroundColor: `${accent}1f`, color: accent }
                : {
                    backgroundColor: "color-mix(in srgb, var(--fg) 5%, transparent)",
                    color: "color-mix(in srgb, var(--fg) 55%, transparent)",
                  }
            }
          >
            {fach.number}
          </span>
          <h2 className="flex-1 text-base font-semibold text-white sm:text-lg">{fach.title}</h2>
          <StatusTag kind={fach.kind} />
        </header>

        <div className="mt-4">
          {fach.kind === "techniques" && fach.description && (
            <p className="-mt-1 mb-4 text-xs leading-relaxed text-white/45">{fach.description}</p>
          )}

          {fach.kind === "techniques" && (
            <div className="divide-y divide-white/[0.06]">
              {fach.techniques?.map((tech) => (
                <TechniqueRow
                  key={tech.id}
                  tech={tech}
                  accent={accent}
                  entries={entries}
                  onPatch={onPatch}
                />
              ))}
            </div>
          )}

          {fach.kind === "info" && (
            <div>
              {fach.description && (
                <p className="text-sm leading-relaxed text-white/60">{fach.description}</p>
              )}
              {fach.infoItems && fach.infoItems.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {fach.infoItems.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-white/75">
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: accent }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {fach.kind === "tbi" && (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.015] p-4">
              {fach.description && <p className="text-sm text-white/70">{fach.description}</p>}
              <p className="mt-2 text-xs text-white/40">
                Die Angriffe sind hier gesondert vorgegeben – dieser Editor-Bereich ist noch
                in Arbeit (TBI).
              </p>
            </div>
          )}

          {fach.kind === "notExamined" && (
            <p className="text-sm text-white/50">Wird in dieser Graduierung nicht geprüft.</p>
          )}
        </div>
      </section>
    </Reveal>
  );
}

/** Re-render a section only when one of its own entries (or the accent) changes. */
export const FachSection = memo(FachSectionImpl, (prev, next) => {
  if (
    prev.fach !== next.fach ||
    prev.index !== next.index ||
    prev.accent !== next.accent ||
    prev.onPatch !== next.onPatch
  ) {
    return false;
  }
  for (const tech of next.fach.techniques ?? []) {
    const execs = tech.executions ?? 1;
    for (let ex = 0; ex < execs; ex++) {
      const k = entryKey(tech.id, ex);
      if (prev.entries[k] !== next.entries[k]) return false;
    }
  }
  return true;
});

function StatusTag({ kind }: { kind: PruefungsfachDef["kind"] }) {
  if (kind === "tbi") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-amber-300">
        <Hammer className="size-3" />
        In Arbeit
      </span>
    );
  }
  if (kind === "notExamined") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-white/35">
        <Ban className="size-3" />
        nicht geprüft
      </span>
    );
  }
  return null;
}
