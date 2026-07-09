"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, X } from "lucide-react";
import type { TechniqueCandidate } from "@/lib/program-state";

interface Props {
  open: boolean;
  candidates: TechniqueCandidate[];
  accent: string;
  onSelect: (candidate: TechniqueCandidate) => void;
  onClose: () => void;
}

function preview(c: TechniqueCandidate): string {
  const parts: string[] = [];
  if (c.attack.trim()) parts.push(c.attack.trim());
  for (const s of c.steps) if (s.text.trim()) parts.push(s.text.trim());
  return parts.join(" → ");
}

export function LinkPickerDialog({ open, candidates, accent, onSelect, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="link-picker"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="link-picker-title"
            className="glass relative flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl shadow-2xl shadow-black/50"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
              <div>
                <h2 id="link-picker-title" className="text-lg font-semibold text-white">
                  Technik übernehmen
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  Wähle eine bereits ausgefüllte Technik – ihr Ablauf wird hierher kopiert
                  (und ersetzt den aktuellen Ablauf).
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Schließen"
                className="shrink-0 rounded-lg p-1 text-white/40 transition-colors hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {candidates.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-white/45">
                  Noch keine ausgefüllte Technik vorhanden, die du übernehmen könntest.
                  Fülle zuerst einen anderen Technikverlauf aus.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {candidates.map((c) => (
                    <li key={c.key}>
                      <button
                        type="button"
                        onClick={() => onSelect(c)}
                        className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.7rem] text-white/45">
                            {c.location && (
                              <span
                                className="rounded px-1.5 py-0.5 font-medium"
                                style={{ backgroundColor: `${accent}22`, color: accent }}
                              >
                                Fach {c.location.fachNumber}
                              </span>
                            )}
                            {c.location && (
                              <span>
                                {c.location.techId} · {c.location.techLabel}
                                {c.location.executions > 1 ? ` (Ausf. ${c.location.exec + 1})` : ""}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 truncate text-sm text-white">{preview(c)}</div>
                        </div>
                        <CornerDownLeft className="size-4 shrink-0 text-white/25 transition-colors group-hover:text-white/70" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
