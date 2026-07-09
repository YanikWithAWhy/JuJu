"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { BeltId } from "@/data/types";
import { getBelt } from "@/data/belts";
import { decodeState, encodeState } from "@/lib/encode";
import {
  collectTechniques,
  createEmptyState,
  defaultSteps,
  entryKey,
  locate,
  newStepId,
  type ProgramState,
  type TechniqueEntry,
} from "@/lib/program-state";
import { BeltVisual } from "@/components/ui/belt-visual";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BuilderLinkContext, type BuilderLinkApi } from "./builder-context";
import { LinkPickerDialog } from "./link-picker-dialog";
import { BuilderToc } from "./builder-toc";
import { FachSection } from "./fach-section";
import { ExportBar } from "./export-bar";

function initialState(beltParam: string | null, dParam: string | null): ProgramState {
  // A shared/edit link carries the full program in `?d=` and wins.
  const decoded = decodeState(dParam);
  if (decoded && getBelt(decoded.belt)) return decoded;

  if (beltParam && getBelt(beltParam)) {
    // Otherwise restore the locally auto-saved program for this grade.
    if (typeof window !== "undefined") {
      const saved = decodeState(window.localStorage.getItem(`juju:${beltParam}`));
      if (saved && saved.belt === beltParam) return saved;
    }
    return createEmptyState(beltParam as BeltId);
  }
  return createEmptyState((beltParam ?? "") as BeltId);
}

export function BuilderClient() {
  const search = useSearchParams();
  const [state, setState] = useState<ProgramState>(() =>
    initialState(search.get("belt"), search.get("d")),
  );

  const belt = getBelt(state.belt);

  // Auto-save to localStorage (first-party, functional — no cookies, so no consent
  // banner needed) and mirror the state into the URL so refresh/bookmark restores it.
  useEffect(() => {
    if (!belt) return;
    const handle = setTimeout(() => {
      const encoded = encodeState(state);
      const url = new URL(window.location.href);
      url.searchParams.set("belt", state.belt);
      url.searchParams.set("d", encoded);
      window.history.replaceState(null, "", url.toString());
      window.localStorage.setItem(`juju:${state.belt}`, encoded);
    }, 400);
    return () => clearTimeout(handle);
  }, [state, belt]);

  const patch = useCallback(
    (key: string, partial: Partial<TechniqueEntry>, fallbackAttack: string) => {
      setState((s) => {
        const current = s.entries[key] ?? { attack: fallbackAttack, steps: defaultSteps() };
        return { ...s, entries: { ...s.entries, [key]: { ...current, ...partial } } };
      });
    },
    [],
  );

  const setMeta = (partial: Partial<ProgramState>) =>
    setState((s) => ({ ...s, ...partial }));

  // ---- "Übernehmen": copy another technique's flowchart into this one -------
  const [pickerFor, setPickerFor] = useState<string | null>(null);

  const copyInto = useCallback((destKey: string, srcKey: string) => {
    setState((s) => {
      const src = s.entries[srcKey];
      if (!src) return s;
      const dest = s.entries[destKey];
      // Deep copy the flowchart with fresh ids; keep the destination's own attack.
      const steps = src.steps.map((st) => ({ id: newStepId(), kind: st.kind, text: st.text }));
      return {
        ...s,
        entries: { ...s.entries, [destKey]: { attack: dest?.attack ?? "", steps } },
      };
    });
    setPickerFor(null);
  }, []);

  const linkApi = useMemo<BuilderLinkApi>(
    () => ({
      locate: (key) => (belt ? locate(belt, key) : null),
      openPicker: (destKey) => setPickerFor(destKey),
    }),
    [belt],
  );

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const confirmClear = () => {
    setState((s) => ({ belt: s.belt, entries: {} }));
    setConfirmClearOpen(false);
  };

  const progress = useMemo(() => {
    if (!belt) return { filled: 0, total: 0 };
    let total = 0;
    let filled = 0;
    for (const fach of belt.faecher) {
      if (fach.kind !== "techniques" || !fach.techniques) continue;
      for (const tech of fach.techniques) {
        if (tech.attackMode !== "user" && !tech.flowchart) continue;
        const execs = tech.executions ?? 1;
        for (let ex = 0; ex < execs; ex++) {
          total++;
          const entry = state.entries[entryKey(tech.id, ex)];
          const done =
            entry &&
            ((tech.attackMode === "user" && entry.attack.trim().length > 0) ||
              entry.steps.some((s) => s.text.trim().length > 0));
          if (done) filled++;
        }
      }
    }
    return { filled, total };
  }, [belt, state.entries]);

  if (!belt) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="text-2xl font-semibold text-white">Gürtelgrad nicht gefunden</h1>
        <p className="max-w-sm text-white/55">
          Der angeforderte Grad existiert nicht. Wähle einen Gürtel auf der Startseite.
        </p>
        <Link
          href="/#gurte"
          className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm text-white hover:bg-white/[0.08]"
        >
          Zur Gürtelauswahl
        </Link>
      </div>
    );
  }

  const pct = progress.total > 0 ? Math.round((progress.filled / progress.total) * 100) : 0;

  return (
    <BuilderLinkContext.Provider value={linkApi}>
    <div style={{ "--accent": belt.color } as React.CSSProperties} className="min-h-screen">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/#gurte"
            className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Gürtel</span>
          </Link>
          <span className="h-5 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full" style={{ backgroundColor: belt.color }} />
            <span className="text-sm font-medium text-white">
              {belt.kyu}. Kyu
              <span className="hidden text-white/45 sm:inline"> · {belt.name}</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <ExportBar state={state} accent={belt.color} onAccent={belt.onColor} />
          </div>
        </div>
      </div>

      <main className="mx-auto flex max-w-6xl gap-8 px-4 pb-28 pt-8 sm:px-6">
        <aside className="hidden w-56 shrink-0 xl:block">
          <BuilderToc faecher={belt.faecher} accent={belt.color} />
        </aside>

        <div className="min-w-0 flex-1">
        {/* Program header */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 shrink-0">
              <BeltVisual color={belt.color} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                Prüfungsprogramm
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {belt.kyu}. Kyu — {belt.name}
              </h1>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Field
              label="Name des Prüflings"
              value={state.examinee ?? ""}
              onChange={(v) => setMeta({ examinee: v })}
              placeholder="Vor- und Nachname"
            />
            <Field
              label="Verein / Dojo"
              value={state.club ?? ""}
              onChange={(v) => setMeta({ club: v })}
              placeholder="z. B. Seimitsu e.V."
            />
            <Field
              label="Datum"
              type="date"
              value={state.date ?? ""}
              onChange={(v) => setMeta({ date: v })}
            />
          </div>

          {/* progress */}
          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between text-xs text-white/45">
              <span>Fortschritt</span>
              <span>
                {progress.filled} / {progress.total} Techniken ausgefüllt
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${pct}%`, backgroundColor: belt.color }}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setConfirmClearOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-rose-300"
            >
              <Trash2 className="size-3.5" />
              Vorlage leeren
            </button>
          </div>
        </div>

        {/* Prüfungsfächer */}
        <div className="mt-6 space-y-4">
          {belt.faecher.map((fach, i) => (
            <FachSection
              key={fach.number}
              fach={fach}
              index={i}
              accent={belt.color}
              entries={state.entries}
              onPatch={patch}
            />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-white/35">
          Automatisch in diesem Browser gespeichert (lokal, ohne Cookies). Über „Link teilen“
          oder „PDF“ nimmst du dein Programm überallhin mit.
        </p>
        <p className="mt-1.5 text-center text-xs text-white/25">
          Tipp: In den Flowchart-Nodes erzeugt <kbd>Enter</kbd> einen neuen Schritt,
          mit <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> springst du zwischen ihnen.
        </p>
        </div>
      </main>

      <ConfirmDialog
        open={confirmClearOpen}
        tone="danger"
        icon={<Trash2 className="size-5" />}
        title="Vorlage leeren?"
        description="Alle Eingaben (Techniken, Name, Verein und Datum) für diesen Grad werden entfernt. Das kann nicht rückgängig gemacht werden."
        confirmLabel="Leeren"
        cancelLabel="Abbrechen"
        onConfirm={confirmClear}
        onCancel={() => setConfirmClearOpen(false)}
      />

      <LinkPickerDialog
        open={!!pickerFor}
        candidates={pickerFor ? collectTechniques(state, belt, pickerFor) : []}
        accent={belt.color}
        onSelect={(c) => {
          if (pickerFor) copyInto(pickerFor, c.key);
        }}
        onClose={() => setPickerFor(null)}
      />
    </div>
    </BuilderLinkContext.Provider>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-white/45">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-white/25 focus:outline-none"
      />
    </label>
  );
}
