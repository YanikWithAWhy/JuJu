import LZString from "lz-string";
import type { ProgramState } from "@/lib/program-state";
import { SCHEMA_VERSION, normalizeSteps } from "@/lib/program-state";

interface Envelope {
  v: number;
  s: ProgramState;
}

/** Compress a program state into a URL-safe string for the `?d=` param. */
export function encodeState(state: ProgramState): string {
  const envelope: Envelope = { v: SCHEMA_VERSION, s: state };
  return LZString.compressToEncodedURIComponent(JSON.stringify(envelope));
}

/** Decode a `?d=` param back into a program state. Returns null on failure. */
export function decodeState(encoded: string | null | undefined): ProgramState | null {
  if (!encoded) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json) as Envelope | ProgramState;
    // Tolerate both the enveloped and (future) bare shapes.
    const state = "s" in parsed ? parsed.s : (parsed as ProgramState);
    if (!state || typeof state !== "object" || !("belt" in state)) return null;
    if (!state.entries || typeof state.entries !== "object") state.entries = {};
    // Migrate/normalise every entry's flowchart nodes to the current shape.
    for (const key of Object.keys(state.entries)) {
      const entry = state.entries[key];
      state.entries[key] = {
        attack: typeof entry?.attack === "string" ? entry.attack : "",
        steps: normalizeSteps(entry?.steps),
      };
    }
    return state;
  } catch {
    return null;
  }
}
