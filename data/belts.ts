import type { BeltDef, PruefungsfachDef, TechniqueDef } from "@/data/types";

/* ------------------------------------------------------------------ *
 * Helpers to keep the dataset terse and consistent.
 * ------------------------------------------------------------------ */

/** A technique with a free attack field + defence flowchart (the default case). */
function tech(
  id: string,
  label: string,
  extra: Partial<TechniqueDef> = {},
): TechniqueDef {
  return { id, label, attackMode: "user", flowchart: true, executions: 1, ...extra };
}

/** A weapon defence (stick/knife): attack is prefilled per Angriffswinkel. */
function weapon(id: string, label: string, angles: number[]): TechniqueDef {
  return {
    id,
    label,
    attackMode: "predefined",
    flowchart: true,
    executions: angles.length,
    predefinedAttacks: angles.map((a) => `Angriffswinkel ${a}`),
  };
}

/** A demonstration-only technique (e.g. Falltechniken): just the label, no fields. */
function fall(id: string, label: string): TechniqueDef {
  return { id, label, attackMode: "none", flowchart: false, executions: 1 };
}

const notExamined = (number: number, title: string): PruefungsfachDef => ({
  number,
  title,
  kind: "notExamined",
});

const techFach = (
  number: number,
  title: string,
  techniques: TechniqueDef[],
): PruefungsfachDef => ({ number, title, kind: "techniques", techniques });

const infoFach = (
  number: number,
  title: string,
  description: string,
  infoItems?: string[],
): PruefungsfachDef => ({ number, title, kind: "info", description, infoItems });

const tbiFach = (
  number: number,
  title: string,
  description: string,
): PruefungsfachDef => ({ number, title, kind: "tbi", description });

/* Shared closing fields (15 & 16 are identical across all grades). */
const KOMBINATIONEN = infoFach(
  15,
  "Kombinationen / Vielfältigkeit",
  "Sinnvolle Technikkombinationen während der gesamten Prüfung.",
);
const PARTNERVERHALTEN = infoFach(
  16,
  "Angriffs- / Partnerverhalten",
  "Verhalten als Prüfling wie auch als Partner während der gesamten Prüfung.",
);

const TITLES = {
  fall: "Falltechniken",
  boden: "Bodentechniken",
  abwehr: "Abwehrtechniken",
  atemi: "Atemitechniken",
  wuerge: "Würge- / Nervendrucktechniken",
  hebel: "Hebeltechniken",
  wurf: "Wurftechniken",
  stock: "Stockabwehr / -anwendung",
  messer: "Messerabwehr",
  weiter: "Weiterführungstechniken",
  gegen: "Gegentechniken",
  freie: "Freie Selbstverteidigung",
  anwendung: "Anwendungsformen",
  bewegung: "Bewegungsformen",
} as const;

/* ================================================================== *
 * 5. KYU — GELBGURT
 * ================================================================== */
const gelb: BeltDef = {
  id: "5kyu",
  kyu: 5,
  name: "Gelbgurt",
  colorName: "Gelb",
  color: "#FACC15",
  onColor: "#1c1700",
  faecher: [
    techFach(1, TITLES.fall, [fall("1.1", "Sturz seitwärts")]),
    techFach(2, TITLES.boden, [
      tech("2.1", "Haltetechnik in seitlicher Position und Übergang in die Haltetechnik in Kreuzposition"),
      tech("2.2", "Haltetechnik in Kreuzposition und Übergang in die Haltetechnik in Reitposition"),
    ]),
    techFach(3, TITLES.abwehr, [
      tech("3.1", "Passivblock am Kopf"),
      tech("3.2", "Passivblock am Rumpf"),
      tech("3.3", "Abwehrtechnik mit der Hand", { executions: 2 }),
      tech("3.4", "Grifflösen"),
      tech("3.5", "Griffsprengen"),
    ]),
    techFach(4, TITLES.atemi, [
      tech("4.1", "Handballentechnik"),
      tech("4.2", "Knietechnik"),
      tech("4.3", "Hammerfaustschlag"),
    ]),
    notExamined(5, TITLES.wuerge),
    techFach(6, TITLES.hebel, [
      tech("6.1.1", "Armstreckhebel zum Boden", { category: "Armhebel im Stand" }),
      tech("6.2.1", "Seitstreckhebel", { category: "Armhebel am Boden" }),
      tech("6.3", "Körperabbiegen"),
    ]),
    techFach(7, TITLES.wurf, [tech("7.1", "Beinstellen")]),
    notExamined(8, TITLES.stock),
    notExamined(9, TITLES.messer),
    notExamined(10, TITLES.weiter),
    notExamined(11, TITLES.gegen),
    tbiFach(12, TITLES.freie, "Verteidigung gegen 3 von 5 angesagten Angriffen."),
    infoFach(
      13,
      TITLES.anwendung,
      "Demonstration von Handballentechniken gegen Pratzen oder Schlagpolster.",
      [
        "Führhand, Schlaghand",
        "Führhand, Schlaghand, Hammerfaust",
        "Handballentechniken in Kombination gegen Partner mit Pratzen",
        "oder gegen Partner mit passender Schutzausrüstung",
      ],
    ),
    infoFach(
      14,
      TITLES.bewegung,
      "Wird im Verlauf der Abwehrhandlungen bewertet. Auf Wunsch gesondert prüfbar:",
      ["Auspendeln", "Gleiten", "Körperabdrehen", "Schrittdrehung"],
    ),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

/* ================================================================== *
 * 4. KYU — ORANGEGURT
 * ================================================================== */
const orange: BeltDef = {
  id: "4kyu",
  kyu: 4,
  name: "Orangegurt",
  colorName: "Orange",
  color: "#FB923C",
  onColor: "#1f0e00",
  faecher: [
    techFach(1, TITLES.fall, [
      fall("1.1", "Rolle vorwärts in den Stand"),
      fall("1.2", "Rolle rückwärts in den Stand"),
    ]),
    techFach(2, TITLES.boden, [
      tech("2.1", "Befreiung aus Haltetechnik in seitlicher Position"),
      tech("2.2", "Befreiung aus Haltetechnik in Kreuzposition"),
      tech("2.3", "Befreiung aus Haltetechnik in Reitposition"),
    ]),
    techFach(3, TITLES.abwehr, [
      tech("3.1", "Unterarmblock nach innen"),
      tech("3.2", "Unterarmblock nach außen"),
    ]),
    techFach(4, TITLES.atemi, [
      tech("4.1", "Fußtechnik vorwärts"),
      tech("4.2", "Fauststoß"),
      tech("4.3", "Faustschlag", { executions: 2 }),
    ]),
    notExamined(5, TITLES.wuerge),
    techFach(6, TITLES.hebel, [
      tech("6.1.1", "Verriegelter Armbeugehebel", { category: "Armhebel im Stand" }),
      tech("6.2.1", "Verriegelter Armbeugehebel", { category: "Armhebel am Boden" }),
    ]),
    techFach(7, TITLES.wurf, [
      tech("7.1", "Hüftwurf"),
      tech("7.2", "Große Außensichel"),
    ]),
    notExamined(8, TITLES.stock),
    notExamined(9, TITLES.messer),
    techFach(10, TITLES.weiter, [
      tech("10.1", "Weiterführung eines verriegelten Armbeugehebels im Stand"),
    ]),
    techFach(11, TITLES.gegen, [
      tech("11.1.1", "Gegentechnik gegen Beinstellen", { category: "Gegentechniken gegen Wurftechniken" }),
      tech("11.2.1", "Gegentechnik gegen einen verriegelten Armbeugehebel im Stand", { category: "Gegentechnik gegen Hebeltechniken im Stand" }),
    ]),
    tbiFach(12, TITLES.freie, "Verteidigung gegen 4 von 6 angesagten Angriffen."),
    infoFach(
      13,
      TITLES.anwendung,
      "Demonstration von Fausttechniken gegen Pratzen oder Schlagpolster.",
      [
        "Führhand, Schlaghand, Faustschlag zum Kopf",
        "Führhand, Schlaghand, Körperhaken",
        "Fausttechniken in Kombination gegen Partner mit Pratzen",
        "oder gegen Partner mit passender Schutzausrüstung",
      ],
    ),
    infoFach(
      14,
      TITLES.bewegung,
      "Wird im Verlauf der Abwehrhandlungen bewertet. Auf Wunsch gesondert prüfbar:",
      ["Ausfallschritt mit dem vorderen Bein", "Ausfallschritt mit dem hinteren Bein", "Doppelschrittdrehung"],
    ),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

/* ================================================================== *
 * 3. KYU — GRÜNGURT
 * ================================================================== */
const gruen: BeltDef = {
  id: "3kyu",
  kyu: 3,
  name: "Grüngurt",
  colorName: "Grün",
  color: "#22C55E",
  onColor: "#03190c",
  faecher: [
    techFach(1, TITLES.fall, [
      fall("1.1", "Sturz vorwärts"),
      fall("1.2", "Sturz rückwärts"),
    ]),
    techFach(2, TITLES.boden, [
      tech("2.1", "Haltetechnik in Verteidigungsposition bei eigener Rückenlage (Full Guard)"),
      tech("2.2", "Aus eigener Rückenlage in die Oberlage gelangen"),
      tech("2.3", "Befreiung aus der Haltetechnik in Rückenlage (Guard Pass / Escape)"),
    ]),
    techFach(3, TITLES.abwehr, [
      tech("3.1", "Abwehrtechnik mit der Hand", { executions: 3 }),
      tech("3.2", "Dreierkontakt", { note: "Ausführung beliebig" }),
    ]),
    techFach(4, TITLES.atemi, [
      tech("4.1", "Ellbogentechnik", { executions: 2 }),
      tech("4.2", "Lowkick"),
    ]),
    techFach(5, TITLES.wuerge, [
      tech("5.1.1", "Drosselgrubendruck", { category: "Nervendrucktechnik" }),
      tech("5.2.1", "Schränkwürge", { category: "Würgetechnik mit Armen oder Händen" }),
    ]),
    techFach(6, TITLES.hebel, [
      tech("6.1.1", "Handbeugehebel zum Boden", { category: "Handgelenkhebel" }),
      tech("6.2.1", "Fingerstreckhebel", { category: "Fingerhebel" }),
    ]),
    techFach(7, TITLES.wurf, [
      tech("7.1", "Schulterwurf"),
      tech("7.2", "Große Innensichel"),
      tech("7.3.1", "Doppelhandsichel von vorne", { category: "Beingreifer" }),
    ]),
    techFach(8, TITLES.stock, [weapon("8.1", "Stockabwehr", [1, 2])]),
    notExamined(9, TITLES.messer),
    techFach(10, TITLES.weiter, [
      tech("10.1", "Weiterführung von Hebeltechniken", { executions: 2 }),
      tech("10.2", "Weiterführung von Atemitechniken"),
    ]),
    techFach(11, TITLES.gegen, [
      tech("11.1", "Gegentechnik gegen Handbeugehebel im Stand"),
      tech("11.2", "Gegentechnik gegen eine weitere Hebeltechnik im Stand nach eigener Wahl"),
      tech("11.3", "Gegentechnik gegen Hüftwurf"),
      tech("11.4", "Gegentechnik gegen eine weitere Wurftechnik nach eigener Wahl"),
    ]),
    tbiFach(12, TITLES.freie, "Verteidigung gegen 4 von 8 angesagten Angriffen."),
    infoFach(
      13,
      TITLES.anwendung,
      "Demonstration von Atemitechniken gegen Pratzen oder Schlagpolster.",
      [
        "Führhand, Schlaghand, Lowkick",
        "Führhand, Schlaghand, Führhand, Beintechnik",
        "Atemitechniken in Kombination gegen Partner mit Pratzen",
        "oder gegen Partner mit passender Schutzausrüstung",
      ],
    ),
    infoFach(
      14,
      TITLES.bewegung,
      "Wird im Verlauf der Abwehrhandlungen bewertet. Auf Wunsch gesondert prüfbar:",
      ["Übersetzschritte"],
    ),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

/* ================================================================== *
 * 2. KYU — BLAUGURT
 * ================================================================== */
const blau: BeltDef = {
  id: "2kyu",
  kyu: 2,
  name: "Blaugurt",
  colorName: "Blau",
  color: "#3B82F6",
  onColor: "#020c1f",
  faecher: [
    techFach(1, TITLES.fall, [fall("1.1", "Falltechniken unter Einwirkung des Partners")]),
    techFach(2, TITLES.boden, [
      tech("2.1", "Verteidigung gegen Atemiangriffe in eigener Rückenlage (Angreifer kniet zwischen den Beinen)"),
      tech("2.2", "Verteidigung gegen Atemiangriffe in eigener Rückenlage (Angreifer in Reitposition)"),
    ]),
    techFach(3, TITLES.abwehr, [
      tech("3.1", "Abwehrtechnik mit dem Fuß oder Unterschenkel", { executions: 2 }),
      tech("3.2", "Abwehrtechnik mit der Hand oder dem Arm mit gleichzeitiger Störtechnik", { note: "z. B. Gunting" }),
    ]),
    techFach(4, TITLES.atemi, [
      tech("4.1", "Handkantentechnik"),
      tech("4.2", "Fußtechnik abwärts"),
      tech("4.3", "Fußtechnik seitwärts"),
    ]),
    techFach(5, TITLES.wuerge, [
      tech("5.1", "Nervendrucktechnik", { executions: 2 }),
      tech("5.2", "Würgetechnik mit Verwendung der Kleidung", { executions: 2 }),
    ]),
    techFach(6, TITLES.hebel, [
      tech("6.1", "Armhebel im Stand"),
      tech("6.2", "Armhebel am Boden"),
      tech("6.3", "Handgelenkhebel"),
      tech("6.4", "Fingerhebel"),
      tech("6.5", "Beinhebel"),
    ]),
    techFach(7, TITLES.wurf, [
      tech("7.1", "Hüftfegen"),
      tech("7.2", "Rückriss"),
    ]),
    techFach(8, TITLES.stock, [weapon("8.1", "Stockabwehr", [1, 2, 3, 4])]),
    techFach(9, TITLES.messer, [weapon("9.1", "Messerabwehr", [1, 2])]),
    techFach(10, TITLES.weiter, [
      tech("10.1", "Weiterführung von Wurftechniken", { executions: 2 }),
      tech("10.2", "Weiterführung von Atemitechniken", { executions: 2 }),
    ]),
    techFach(11, TITLES.gegen, [
      tech("11.1", "Gegentechniken gegen Hebeltechniken", { executions: 2 }),
      tech("11.2", "Gegentechniken gegen Wurftechniken", { executions: 2 }),
    ]),
    tbiFach(12, TITLES.freie, "Verteidigung gegen je 2 angesagte Angriffe aus 3 Gruppen."),
    infoFach(
      13,
      TITLES.anwendung,
      "Demonstration von Atemi- und Wurftechniken nach hinten gegen Pratzen oder Schlagpolster.",
      [
        "Führhand, Schlaghand, Führhand, Ellenbogen, Wurftechnik nach hinten",
        "Führhand, Schlaghand, Körperhaken, Knietechnik",
        "Atemi- und Wurftechniken (nach hinten) in Kombination gegen Partner mit Pratzen",
        "oder gegen Partner mit passender Schutzausrüstung",
      ],
    ),
    infoFach(14, TITLES.bewegung, "Freie Bewegungsformen im Stand.", ["Freie Bewegungsformen im Stand"]),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

/* ================================================================== *
 * 1. KYU — BRAUNGURT
 * ================================================================== */
const braun: BeltDef = {
  id: "1kyu",
  kyu: 1,
  name: "Braungurt",
  colorName: "Braun",
  color: "#A86B43",
  onColor: "#1a0d04",
  faecher: [
    notExamined(1, TITLES.fall),
    techFach(2, TITLES.boden, [
      tech("2.1", "Verteidigung nach erfolgter Wurftechnik", { executions: 2 }),
    ]),
    techFach(3, TITLES.abwehr, [
      tech("3.1", "Kombinierte Abwehrtechnik", { executions: 2 }),
    ]),
    techFach(4, TITLES.atemi, [
      tech("4.1", "Fingerstich"),
      tech("4.2", "Pressluftschlag"),
      tech("4.3", "Atemitechnik mit dem Kopf"),
      tech("4.4", "Halbkreisfußtritt vorwärts"),
    ]),
    techFach(5, TITLES.wuerge, [
      tech("5.1", "Würgetechnik mit Armen oder Händen", { executions: 2 }),
    ]),
    techFach(6, TITLES.hebel, [
      tech("6.1", "Armhebel im Stand", { executions: 2 }),
      tech("6.2", "Armhebel am Boden", { executions: 2 }),
      tech("6.3", "Handgelenkhebel", { executions: 2 }),
      tech("6.4", "Fingerhebel"),
      tech("6.5", "Beinhebel"),
    ]),
    techFach(7, TITLES.wurf, [
      tech("7.1.1", "Schaufelwurf", { category: "Beingreifertechnik" }),
      tech("7.1.2", "Eine weitere Beingreifertechnik nach Wahl des Prüflings", { category: "Beingreifertechnik" }),
      tech("7.2", "Talfallzug"),
    ]),
    techFach(8, TITLES.stock, [weapon("8.1", "Stockabwehr", [1, 2, 3, 4, 5, 6])]),
    techFach(9, TITLES.messer, [weapon("9.1", "Messerabwehr", [1, 2, 3, 4, 5])]),
    techFach(10, TITLES.weiter, [
      tech("10.1", "Weiterführung von Hebeltechniken", { executions: 2 }),
      tech("10.2", "Weiterführung von Wurftechniken", { executions: 2 }),
      tech("10.3", "Weiterführung von Atemitechniken", { executions: 3 }),
    ]),
    techFach(11, TITLES.gegen, [
      tech("11.1", "Gegentechniken gegen Hebeltechniken", { executions: 2 }),
      tech("11.2", "Gegentechniken gegen Wurftechniken", { executions: 2 }),
    ]),
    tbiFach(12, TITLES.freie, "Verteidigung gegen je 2 angesagte Angriffe aus 4 Gruppen."),
    infoFach(
      13,
      TITLES.anwendung,
      "Demonstration von Atemi- und Wurftechniken gegen Pratzen oder Schlagpolster.",
      [
        "Führhand, Schlaghand, Lowkick, Beingreifertechnik",
        "Führhand, Schlaghand, Körperhaken, Wurftechnik nach vorne",
        "Atemi- und Wurftechniken in Kombination gegen Partner mit Pratzen",
        "oder gegen Partner mit passender Schutzausrüstung",
      ],
    ),
    notExamined(14, TITLES.bewegung),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

export const BELTS: BeltDef[] = [gelb, orange, gruen, blau, braun];

export const BELT_BY_ID: Record<string, BeltDef> = Object.fromEntries(
  BELTS.map((b) => [b.id, b]),
);

export function getBelt(id: string | null | undefined): BeltDef | undefined {
  if (!id) return undefined;
  return BELT_BY_ID[id];
}
