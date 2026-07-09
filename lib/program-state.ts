import type { BeltDef, BeltId } from "@/data/types";

export type StepKind = "verteidigung" | "gegen" | "schritt";

/** One node in a technique's flowchart. */
export interface StepNode {
  /** Stable id (used as a React key; regenerated when a combination is copied). */
  id: string;
  kind: StepKind;
  text: string;
}

/** One filled-in technique row: the attack plus the flowchart nodes. */
export interface TechniqueEntry {
  /** Attack text (prefilled for weapon techniques). */
  attack: string;
  /** Flowchart nodes after the attack: [Verteidigungstechnik, …]. */
  steps: StepNode[];
}

export interface ProgramState {
  belt: BeltId;
  examinee?: string;
  club?: string;
  date?: string;
  /** Keyed by `${techniqueId}#${executionIndex}`. */
  entries: Record<string, TechniqueEntry>;
}

export const SCHEMA_VERSION = 3;

export function entryKey(techniqueId: string, execution: number): string {
  return `${techniqueId}#${execution}`;
}

export function newStepId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function createEmptyState(belt: BeltId): ProgramState {
  return { belt, entries: {} };
}

/** The default node set for a fresh flowchart: a single Verteidigungstechnik node. */
export function defaultSteps(): StepNode[] {
  return [{ id: newStepId(), kind: "verteidigung", text: "" }];
}

/**
 * Human label for a flowchart node. Defence + follow-up nodes are numbered
 * together as "Schritt 1/2/3 …"; counter techniques are labelled separately.
 */
export function stepNodeLabel(steps: StepNode[], index: number): string {
  const step = steps[index];
  if (!step) return "Schritt 1";
  if (step.kind === "gegen") {
    const total = steps.filter((s) => s.kind === "gegen").length;
    if (total <= 1) return "Gegentechnik";
    const ordinal = steps.slice(0, index + 1).filter((s) => s.kind === "gegen").length;
    return `Gegentechnik ${ordinal}`;
  }
  const n = steps.slice(0, index + 1).filter((s) => s.kind !== "gegen").length;
  return `Schritt ${n}`;
}

/** Accept legacy (string[]) or current (StepNode[]) shapes and normalise. */
export function normalizeSteps(raw: unknown): StepNode[] {
  if (!Array.isArray(raw) || raw.length === 0) return defaultSteps();
  const out: StepNode[] = raw.map((s, i) => {
    if (typeof s === "string") {
      return { id: newStepId(), kind: i === 0 ? "verteidigung" : "gegen", text: s };
    }
    if (s && typeof s === "object" && "text" in s) {
      const obj = s as { kind?: unknown; text?: unknown; id?: unknown };
      const k = obj.kind;
      const kind: StepKind =
        k === "verteidigung" || k === "gegen" || k === "schritt"
          ? k
          : i === 0
            ? "verteidigung"
            : "gegen";
      return {
        id: typeof obj.id === "string" && obj.id ? obj.id : newStepId(),
        kind,
        text: String(obj.text ?? ""),
      };
    }
    return { id: newStepId(), kind: i === 0 ? "verteidigung" : "gegen", text: "" };
  });
  if (out[0].kind !== "verteidigung") out[0] = { ...out[0], kind: "verteidigung" };
  return out;
}

export interface KeyLocation {
  fachNumber: number;
  fachTitle: string;
  techId: string;
  techLabel: string;
  exec: number;
  executions: number;
}

/** Resolve a `${techId}#${exec}` key to its Fach + technique (from static belt data). */
export function locate(belt: BeltDef, key: string): KeyLocation | null {
  const [techId, execStr] = key.split("#");
  const exec = Number(execStr) || 0;
  for (const fach of belt.faecher) {
    if (fach.kind !== "techniques" || !fach.techniques) continue;
    const t = fach.techniques.find((x) => x.id === techId);
    if (t) {
      return {
        fachNumber: fach.number,
        fachTitle: fach.title,
        techId: t.id,
        techLabel: t.label,
        exec,
        executions: t.executions ?? 1,
      };
    }
  }
  return null;
}

export interface TechniqueCandidate {
  key: string;
  location: KeyLocation | null;
  attack: string;
  steps: StepNode[];
}

/** All other techniques whose flowchart has at least one filled step (for "übernehmen"). */
export function collectTechniques(
  state: ProgramState,
  belt: BeltDef,
  excludeKey: string,
): TechniqueCandidate[] {
  const out: TechniqueCandidate[] = [];
  for (const [k, e] of Object.entries(state.entries)) {
    if (k === excludeKey) continue;
    if (!e.steps.some((s) => s.text.trim().length > 0)) continue;
    out.push({ key: k, location: locate(belt, k), attack: e.attack, steps: e.steps });
  }
  return out;
}

export function getEntry(
  state: ProgramState,
  key: string,
  defaultAttack = "",
): TechniqueEntry {
  return state.entries[key] ?? { attack: defaultAttack, steps: defaultSteps() };
}
