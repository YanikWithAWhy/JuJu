"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Plus, Swords, X, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { stepNodeLabel, type StepKind, type StepNode } from "@/lib/program-state";

function placeholderFor(kind: StepKind) {
  if (kind === "verteidigung") return "z. B. Außenblock & ausweichen …";
  if (kind === "gegen") return "z. B. Hebel, Wurf, Atemi …";
  return "weitere Technik …";
}

interface Props {
  attack: string;
  steps: StepNode[];
  accent: string;
  onChange?: (steps: StepNode[]) => void;
  readOnly?: boolean;
}

export function DefenseFlowchart({ attack, steps, accent, onChange, readOnly }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusTarget = useRef<number | null>(null);

  // After a node is added (via Enter or a button), move focus into it.
  useEffect(() => {
    if (focusTarget.current == null) return;
    const idx = focusTarget.current;
    focusTarget.current = null;
    containerRef.current
      ?.querySelector<HTMLInputElement>(`input[data-node="${idx}"]`)
      ?.focus();
  });

  const focusNode = (idx: number) => {
    containerRef.current
      ?.querySelector<HTMLInputElement>(`input[data-node="${idx}"]`)
      ?.focus();
  };

  const setStep = (i: number, text: string) => {
    onChange?.(steps.map((s, idx) => (idx === i ? { ...s, text } : s)));
  };

  const insertAfter = (i: number, kind: StepKind) => {
    if (!onChange) return;
    focusTarget.current = i + 1;
    onChange([...steps.slice(0, i + 1), { kind, text: "" }, ...steps.slice(i + 1)]);
  };

  const append = (kind: StepKind) => {
    if (!onChange) return;
    focusTarget.current = steps.length;
    onChange([...steps, { kind, text: "" }]);
  };

  // Only counter/follow-up nodes (index >= 1) can be removed.
  const removeStep = (i: number) => onChange?.(steps.filter((_, idx) => idx !== i));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      insertAfter(i, "schritt");
    } else if (e.key === "Tab" && !e.shiftKey && i + 1 < steps.length) {
      e.preventDefault();
      focusNode(i + 1);
    } else if (e.key === "Tab" && e.shiftKey && i - 1 >= 0) {
      e.preventDefault();
      focusNode(i - 1);
    }
  };

  // Number the steps; counter techniques are shown with a bolt instead of a number.
  let counter = 0;
  const badges = steps.map((s) =>
    s.kind === "gegen" ? { gegen: true as const } : { gegen: false as const, n: ++counter },
  );

  // In read-only mode, collapse to the filled-in nodes only.
  const visibleSteps = readOnly
    ? steps.map((s, i) => ({ s, i })).filter(({ s }) => s.text.trim().length > 0)
    : steps.map((s, i) => ({ s, i }));

  if (readOnly && visibleSteps.length === 0 && !attack.trim()) {
    return <p className="text-sm italic text-white/30">Noch nicht ausgefüllt.</p>;
  }

  const lastStepIsTail = readOnly; // editor adds a button row after the steps

  return (
    <div ref={containerRef} className="flex w-full max-w-md flex-col">
      {/* Angriff (source) */}
      <Row
        last={visibleSteps.length === 0 && readOnly}
        badge={
          <Badge style={{ backgroundColor: `${accent}26`, color: accent, borderColor: `${accent}66` }}>
            <Swords className="size-3.5" />
          </Badge>
        }
      >
        <div
          className="rounded-xl border p-2.5"
          style={{ borderColor: `${accent}55`, backgroundColor: `${accent}14` }}
        >
          <span className="text-[0.62rem] font-semibold uppercase tracking-wider" style={{ color: accent }}>
            Angriff
          </span>
          <div className={cn("text-sm", attack.trim() ? "text-white/90" : "text-white/30")}>
            {attack.trim() || "—"}
          </div>
        </div>
      </Row>

      {visibleSteps.map(({ s, i }, idx) => {
        const badge = badges[i];
        return (
          <Row
            key={i}
            last={lastStepIsTail && idx === visibleSteps.length - 1}
            badge={
              badge.gegen ? (
                <Badge className="border-amber-400/40 bg-amber-400/15 text-amber-300">
                  <Zap className="size-3.5" />
                </Badge>
              ) : (
                <Badge className="border-white/15 bg-white/[0.06] text-white/70">{badge.n}</Badge>
              )
            }
          >
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-white/40">
                  {stepNodeLabel(steps, i)}
                </span>
                {!readOnly && i >= 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    aria-label={`${stepNodeLabel(steps, i)} entfernen`}
                    className="text-white/30 transition-colors hover:text-white/80"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              {readOnly ? (
                <div className="text-sm text-white/90">{s.text || "—"}</div>
              ) : (
                <input
                  type="text"
                  data-node={i}
                  value={s.text}
                  onChange={(e) => setStep(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  placeholder={placeholderFor(s.kind)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
                />
              )}
            </div>
          </Row>
        );
      })}

      {!readOnly && (
        <Row
          last
          badge={
            <Badge className="border-dashed border-white/20 text-white/40">
              <Plus className="size-3.5" />
            </Badge>
          }
        >
          <div className="flex flex-wrap gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => append("gegen")}
              className="flex items-center gap-1 rounded-xl border border-dashed border-white/15 px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:border-white/30 hover:text-white/85"
            >
              <Zap className="size-3.5" />
              Gegentechnik
            </button>
            <button
              type="button"
              onClick={() => append("schritt")}
              className="flex items-center gap-1 rounded-xl border border-dashed border-white/15 px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:border-white/30 hover:text-white/85"
            >
              <Plus className="size-3.5" />
              Schritt
            </button>
          </div>
        </Row>
      )}
    </div>
  );
}

/** One timeline row: a circular badge on the rail + the node content. */
function Row({ badge, last, children }: { badge: ReactNode; last?: boolean; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        {badge}
        {!last && <span className="my-1 w-px flex-1 bg-white/15" />}
      </div>
      <div className="min-w-0 flex-1 pb-3">{children}</div>
    </div>
  );
}

function Badge({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={style}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
        className,
      )}
    >
      {children}
    </span>
  );
}
