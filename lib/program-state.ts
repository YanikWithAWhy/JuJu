import type { BeltId } from "@/data/types";

export type StepKind = "verteidigung" | "gegen" | "schritt";

/** One node in a technique's flowchart. */
export interface StepNode {
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

export const SCHEMA_VERSION = 2;

export function entryKey(techniqueId: string, execution: number): string {
  return `${techniqueId}#${execution}`;
}

export function createEmptyState(belt: BeltId): ProgramState {
  return { belt, entries: {} };
}

/** The default node set for a fresh flowchart: a single Verteidigungstechnik node. */
export function defaultSteps(): StepNode[] {
  return [{ kind: "verteidigung", text: "" }];
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
      return { kind: i === 0 ? "verteidigung" : "gegen", text: s };
    }
    if (s && typeof s === "object" && "text" in s) {
      const k = (s as { kind?: unknown }).kind;
      const kind: StepKind =
        k === "verteidigung" || k === "gegen" || k === "schritt"
          ? k
          : i === 0
            ? "verteidigung"
            : "gegen";
      return { kind, text: String((s as { text?: unknown }).text ?? "") };
    }
    return { kind: i === 0 ? "verteidigung" : "gegen", text: "" };
  });
  if (out[0].kind !== "verteidigung") out[0] = { ...out[0], kind: "verteidigung" };
  return out;
}

export function getEntry(
  state: ProgramState,
  key: string,
  defaultAttack = "",
): TechniqueEntry {
  return state.entries[key] ?? { attack: defaultAttack, steps: defaultSteps() };
}
