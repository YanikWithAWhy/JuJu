export type BeltId =
  | "5kyu"
  | "4kyu"
  | "3kyu"
  | "2kyu"
  | "1kyu"
  | "1dan"
  | "2dan"
  | "3dan"
  | "4dan"
  | "5dan";

/** Schülergrade (Kyu) vs. Meistergrade (Dan). */
export type GradeLevel = "kyu" | "dan";

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
  /** The examiner asks for *up to* `executions` (Dan: "max. N Ausführungen"). */
  executionsMax?: boolean;
  attackMode: AttackMode;
  /** For weapon defence: one prefilled attack per execution (length === executions). */
  predefinedAttacks?: string[];
  /** Placeholder for a free attack field, e.g. "z. B. Angriffswinkel 3". */
  attackPlaceholder?: string;
  /** Whether to render the Verteidigung -> Gegentechnik flowchart editor. */
  flowchart: boolean;
}

export type FachKind = "techniques" | "info" | "tbi" | "notExamined";

export interface PruefungsfachDef {
  /** 1..16 */
  number: number;
  title: string;
  kind: FachKind;
  /** Headline text for "info" / "tbi" fields; a short hint for "techniques" fields. */
  description?: string;
  /** Bullet list for "info" fields (e.g. demo combinations, movement forms). */
  infoItems?: string[];
  /** Technique rows for "techniques" fields. */
  techniques?: TechniqueDef[];
}

export interface BeltDef {
  id: BeltId;
  level: GradeLevel;
  /** The number of the grade, e.g. 5 for "5. Kyu" or 1 for "1. Dan". */
  grade: number;
  /** Full grade name, e.g. "Gelbgurt". */
  name: string;
  /** Short tag shown on the belt card, e.g. "Gelb" or "Shodan". */
  colorName: string;
  /** Accent colour (hex) used across the UI for this grade. */
  color: string;
  /** Colour of the belt itself if it differs from the accent (black Dan belts). */
  beltColor?: string;
  /** Number of stripes on the belt visual (Dan grades). */
  stripes?: number;
  /** A readable text colour to place on top of `color`. */
  onColor: string;
  faecher: PruefungsfachDef[];
}
