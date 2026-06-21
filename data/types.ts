export type BeltId = "5kyu" | "4kyu" | "3kyu" | "2kyu" | "1kyu";

/**
 * How the attack ("Angriff") behaves for a technique row:
 * - "user":       free text the examinee fills in.
 * - "predefined": fixed & read-only (e.g. Stock-/Messer-Angriffswinkel).
 * - "none":       no attack field at all (e.g. Falltechniken).
 */
export type AttackMode = "user" | "predefined" | "none";

export interface TechniqueDef {
  /** Official numbering from the BC-Berlin programme, e.g. "3.3" or "6.1.1". */
  id: string;
  /** The concrete technique label, e.g. "Abwehrtechnik mit der Hand". */
  label: string;
  /** Parent category for nested techniques, e.g. "Armhebel im Stand". */
  category?: string;
  /** Extra hint shown next to the label, e.g. "z. B. Gunting". */
  note?: string;
  /** How many times the technique must be shown (=> that many rows). Default 1. */
  executions?: number;
  attackMode: AttackMode;
  /** For weapon defence: one prefilled attack per execution (length === executions). */
  predefinedAttacks?: string[];
  /** Whether to render the Verteidigung -> Gegentechnik flowchart editor. */
  flowchart: boolean;
}

export type FachKind = "techniques" | "info" | "tbi" | "notExamined";

export interface PruefungsfachDef {
  /** 1..16 */
  number: number;
  title: string;
  kind: FachKind;
  /** Headline text for "info" / "tbi" fields. */
  description?: string;
  /** Bullet list for "info" fields (e.g. demo combinations, movement forms). */
  infoItems?: string[];
  /** Technique rows for "techniques" fields. */
  techniques?: TechniqueDef[];
}

export interface BeltDef {
  id: BeltId;
  kyu: number;
  /** Full grade name, e.g. "Gelbgurt". */
  name: string;
  /** Short colour name, e.g. "Gelb". */
  colorName: string;
  /** Accent colour (hex) used across the UI for this grade. */
  color: string;
  /** A readable text colour to place on top of `color`. */
  onColor: string;
  faecher: PruefungsfachDef[];
}
