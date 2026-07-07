"use client";

import { Fragment, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Pencil, Printer } from "lucide-react";
import type { PruefungsfachDef, TechniqueDef } from "@/data/types";
import { getBelt } from "@/data/belts";
import { decodeState } from "@/lib/encode";
import { entryKey, stepNodeLabel, type ProgramState, type StepNode } from "@/lib/program-state";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ProgramView() {
  const search = useSearchParams();
  const dParam = search.get("d");
  const shouldPrint = search.get("print") === "1";
  const state = decodeState(dParam);
  const belt = getBelt(state?.belt);

  useEffect(() => {
    if (shouldPrint && belt) {
      const t = setTimeout(() => window.print(), 700);
      return () => clearTimeout(t);
    }
  }, [shouldPrint, belt]);

  if (!state || !belt) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="text-2xl font-semibold text-white">Programm nicht lesbar</h1>
        <p className="max-w-sm text-white/55">
          Dieser Link enthält kein gültiges Prüfungsprogramm.
        </p>
        <Link
          href="/#gurte"
          className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm text-white hover:bg-white/[0.08]"
        >
          Neues Programm erstellen
        </Link>
      </div>
    );
  }

  const editHref = `/builder?belt=${belt.id}${dParam ? `&d=${dParam}` : ""}`;

  return (
    <div
      style={{ "--accent": belt.color } as React.CSSProperties}
      className="program-print min-h-screen"
    >
      {/* Action bar (hidden when printing) */}
      <div className="no-print sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Start</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={editHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/[0.08]"
            >
              <Pencil className="size-4" />
              <span className="hidden sm:inline">Bearbeiten</span>
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium text-white transition-[filter] hover:brightness-110"
              style={{ backgroundColor: belt.color, color: belt.onColor }}
            >
              <Printer className="size-4" />
              <span className="hidden sm:inline">Drucken / PDF</span>
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 print:px-0 print:py-0">
        {/* Title block */}
        <header className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-5 print:border-neutral-300">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40 print:text-neutral-500">
              Ju-Jutsu Prüfungsprogramm
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white print:text-black">
              {belt.kyu}. Kyu — {belt.name}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/55 print:text-neutral-600">
              {state.examinee && (
                <span className="font-medium text-white print:text-black">{state.examinee}</span>
              )}
              {state.club && <span>Verein: {state.club}</span>}
              {state.date && <span>Datum: {formatDate(state.date)}</span>}
            </div>
          </div>
          <span
            className="hidden size-12 shrink-0 rounded-full sm:block"
            style={{ backgroundColor: belt.color }}
          />
        </header>

        <div className="space-y-4">
          {belt.faecher.map((fach) => (
            <FachReadOnly key={fach.number} fach={fach} state={state} accent={belt.color} />
          ))}
        </div>

        <p className="no-print mt-10 text-center text-xs text-white/35">
          Erstellt mit dem Ju-Jutsu Prüfungsprogramm-Builder.
        </p>
      </main>
    </div>
  );
}

function FachReadOnly({
  fach,
  state,
  accent,
}: {
  fach: PruefungsfachDef;
  state: ProgramState;
  accent: string;
}) {
  const dimmed = fach.kind === "notExamined";

  return (
    <section
      className={`print-avoid-break rounded-2xl border border-white/10 bg-white/[0.02] p-5 print:border-neutral-300 print:bg-[#fff] ${
        dimmed ? "opacity-60 print:opacity-100" : ""
      }`}
    >
      <header className="mb-3 flex items-center gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
          style={
            fach.kind === "techniques"
              ? { backgroundColor: `${accent}26`, color: accent }
              : { backgroundColor: "rgba(0,0,0,0.06)", color: "var(--accent)" }
          }
        >
          {fach.number}
        </span>
        <h2 className="text-base font-semibold text-white print:text-black">{fach.title}</h2>
      </header>

      {fach.kind === "techniques" && (
        <div className="space-y-3">
          {fach.techniques?.map((tech) => (
            <TechReadOnly key={tech.id} tech={tech} state={state} accent={accent} />
          ))}
        </div>
      )}

      {fach.kind === "info" && (
        <div className="pl-11">
          {fach.description && (
            <p className="text-sm text-white/65 print:text-neutral-700">{fach.description}</p>
          )}
          {fach.infoItems && (
            <ul className="mt-2 space-y-1">
              {fach.infoItems.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-white/80 print:text-neutral-800"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {fach.kind === "tbi" && (
        <p className="pl-11 text-sm text-white/65 print:text-neutral-700">
          {fach.description} <span className="text-white/35">(Angriffe gesondert vorgegeben)</span>
        </p>
      )}

      {fach.kind === "notExamined" && (
        <p className="pl-11 text-sm text-white/45 print:text-neutral-500">
          Wird in dieser Graduierung nicht geprüft.
        </p>
      )}
    </section>
  );
}

function TechReadOnly({
  tech,
  state,
  accent,
}: {
  tech: TechniqueDef;
  state: ProgramState;
  accent: string;
}) {
  const executions = tech.executions ?? 1;

  return (
    <div className="pl-11">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="font-mono text-xs text-white/35 print:text-neutral-400">{tech.id}</span>
        <span className="font-medium text-white print:text-black">{tech.label}</span>
        {tech.category && (
          <span className="text-[0.7rem] text-white/40 print:text-neutral-500">· {tech.category}</span>
        )}
        {tech.note && (
          <span className="text-xs italic text-white/40 print:text-neutral-500">({tech.note})</span>
        )}
      </div>

      {(tech.attackMode !== "none" || tech.flowchart) && (
        <div className="mt-1.5 space-y-1.5">
          {Array.from({ length: executions }).map((_, ex) => {
            const entry = state.entries[entryKey(tech.id, ex)];
            const predefined = tech.predefinedAttacks?.[ex] ?? "";
            const attack = entry?.attack ?? predefined;
            const steps = entry?.steps ?? [];
            return (
              <FlowChain
                key={ex}
                attack={tech.attackMode === "none" ? "" : attack}
                showAttack={tech.attackMode !== "none"}
                steps={tech.flowchart ? steps : []}
                accent={accent}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function FlowChain({
  attack,
  showAttack,
  steps,
  accent,
}: {
  attack: string;
  showAttack: boolean;
  steps: StepNode[];
  accent: string;
}) {
  const filled = steps.map((s, i) => ({ s, i })).filter(({ s }) => s.text.trim().length > 0);

  if ((!showAttack || !attack.trim()) && filled.length === 0) {
    return <p className="text-sm italic text-white/30 print:text-neutral-400">— noch offen —</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {showAttack && (
        <span
          className="rounded-lg border px-2.5 py-1 text-sm text-white/90 print:text-black"
          style={{ borderColor: `${accent}66`, backgroundColor: `${accent}12` }}
        >
          <span className="mr-1.5 text-[0.6rem] font-semibold uppercase tracking-wide" style={{ color: accent }}>
            Angriff
          </span>
          {attack.trim() || "—"}
        </span>
      )}
      {filled.map(({ s, i }, idx) => (
        <Fragment key={i}>
          {(showAttack || idx > 0) && (
            <ChevronRight className="size-4 text-white/25 print:text-neutral-400" />
          )}
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-sm text-white/90 print:border-neutral-300 print:bg-neutral-50 print:text-black">
            <span className="mr-1.5 text-[0.6rem] font-semibold uppercase tracking-wide text-white/40 print:text-neutral-500">
              {stepNodeLabel(steps, i)}
            </span>
            {s.text}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}
