"use client";

import { memo } from "react";
import { Import } from "lucide-react";
import type { TechniqueDef } from "@/data/types";
import type { TechniqueEntry } from "@/lib/program-state";
import { entryKey, defaultSteps } from "@/lib/program-state";
import { useBuilderLink } from "./builder-context";
import { DefenseFlowchart } from "./defense-flowchart";

interface Props {
  tech: TechniqueDef;
  accent: string;
  entries: Record<string, TechniqueEntry>;
  /** Omit (or pass undefined) for read-only rendering. */
  onPatch?: (key: string, partial: Partial<TechniqueEntry>, fallbackAttack: string) => void;
}

function TechniqueRowImpl({ tech, accent, entries, onPatch }: Props) {
  const executions = tech.executions ?? 1;
  const readOnly = !onPatch;
  const link = useBuilderLink();

  return (
    <div className="py-5 first:pt-0 last:pb-0">
      {/* Technique header */}
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="font-mono text-xs text-white/35">{tech.id}</span>
        <span className="font-medium text-white">{tech.label}</span>
        {tech.category && (
          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[0.65rem] text-white/45">
            {tech.category}
          </span>
        )}
        {tech.note && <span className="text-xs italic text-white/40">({tech.note})</span>}
        {executions > 1 && (
          <span
            className="ml-auto rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
            style={{ backgroundColor: `${accent}1f`, color: accent }}
          >
            {executions} Ausführungen
          </span>
        )}
      </div>

      {/* One block per execution */}
      {(tech.attackMode !== "none" || tech.flowchart) && (
        <div className="mt-3 space-y-4">
          {Array.from({ length: executions }).map((_, ex) => {
            const key = entryKey(tech.id, ex);
            const predefined = tech.predefinedAttacks?.[ex] ?? "";
            const fallbackAttack = predefined;
            const entry: TechniqueEntry =
              entries[key] ?? { attack: fallbackAttack, steps: defaultSteps() };
            // Predefined (weapon) attacks always come from the technique data,
            // so a linked/auto-created entry can't lose them.
            const attackValue =
              tech.attackMode === "predefined" ? predefined : entry.attack;

            return (
              <div
                key={ex}
                className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3.5"
              >
                {executions > 1 && (
                  <div className="mb-2.5 text-[0.7rem] font-semibold uppercase tracking-wider text-white/35">
                    Ausführung {ex + 1}
                  </div>
                )}

                {tech.attackMode !== "none" && (
                  <div className="mb-3">
                    <label className="mb-1 block text-xs font-medium text-white/45">Angriff</label>
                    {tech.attackMode === "predefined" ? (
                      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/85">
                        <span>{attackValue || "—"}</span>
                        <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[0.6rem] uppercase tracking-wide text-white/40">
                          vorgegeben
                        </span>
                      </div>
                    ) : readOnly ? (
                      <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/85">
                        {attackValue || "—"}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={attackValue}
                        onChange={(e) => onPatch?.(key, { attack: e.target.value }, fallbackAttack)}
                        placeholder="Angriff eintragen …"
                        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-white/25 focus:outline-none"
                      />
                    )}
                  </div>
                )}

                {tech.flowchart && (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <label className="block text-xs font-medium text-white/45">Ablauf</label>
                      {!readOnly && link && (
                        <button
                          type="button"
                          onClick={() => link.openPicker(key)}
                          title="Bereits gezeigte Technik übernehmen"
                          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.7rem] font-medium text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/80"
                        >
                          <Import className="size-3.5" />
                          Übernehmen
                        </button>
                      )}
                    </div>
                    <DefenseFlowchart
                      attack={attackValue}
                      steps={entry.steps}
                      accent={accent}
                      readOnly={readOnly}
                      onChange={
                        readOnly
                          ? undefined
                          : (steps) => onPatch?.(key, { steps }, fallbackAttack)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Re-render a technique row only when its own entries (or accent) change. */
export const TechniqueRow = memo(TechniqueRowImpl, (prev, next) => {
  if (prev.tech !== next.tech || prev.accent !== next.accent || prev.onPatch !== next.onPatch) {
    return false;
  }
  const execs = next.tech.executions ?? 1;
  for (let ex = 0; ex < execs; ex++) {
    const k = entryKey(next.tech.id, ex);
    if (prev.entries[k] !== next.entries[k]) return false;
  }
  return true;
});
