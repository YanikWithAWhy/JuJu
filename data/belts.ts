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
function weapon(
  id: string,
  label: string,
  angles: number[],
  extra: Partial<TechniqueDef> & { suffix?: string } = {},
): TechniqueDef {
  const { suffix, ...rest } = extra;
  return {
    id,
    label,
    attackMode: "predefined",
    flowchart: true,
    executions: angles.length,
    predefinedAttacks: angles.map((a) => `Angriffswinkel ${a}${suffix ? ` · ${suffix}` : ""}`),
    ...rest,
  };
}

/**
 * Dan "3x2 / 5x2"-tasks: the examiner announces N techniques, each shown twice
 * (two different reactions) — one row per announced technique.
 */
function announced(prefix: string, category: string, count: number): TechniqueDef[] {
  return Array.from({ length: count }, (_, i) =>
    tech(`${prefix}.${i + 1}`, `${i + 1}. angesagte Technik`, {
      category,
      executions: 2,
      attackPlaceholder: "Angesagte Technik / Angriff …",
    }),
  );
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
  description?: string,
): PruefungsfachDef => ({ number, title, kind: "techniques", techniques, description });

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
  level: "kyu",
  grade: 5,
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
  level: "kyu",
  grade: 4,
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
  level: "kyu",
  grade: 3,
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
  level: "kyu",
  grade: 2,
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
  level: "kyu",
  grade: 1,
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

/* ================================================================== *
 * 1. – 5. DAN — SCHWARZGURT (DJJV-Arbeitspapiere, Stand 30. Mai 2023)
 * ================================================================== */

/** All Dan grades share the black belt; the gold accent keeps the UI readable. */
const DAN_STYLE = {
  level: "dan",
  name: "Schwarzgurt",
  color: "#D4AF37",
  onColor: "#1a1405",
  beltColor: "#18181B",
} as const;

const HEBEL_HINT =
  "Mehrere Ausführungen können sich in Wirkungsweise, Griffart und/oder Position zum Angreifer unterscheiden.";
const STOCK_ATTACK = "Angriffswinkel nach Wahl, z. B. Angriffswinkel 3";
const MESSER_ANGESAGT = "vom Prüfer angesagt: Winkel 1–5, Winkel 1/2 in Dolchhaltung, Nahdistanz";

const shodan: BeltDef = {
  ...DAN_STYLE,
  id: "1dan",
  grade: 1,
  colorName: "Shodan",
  stripes: 1,
  faecher: [
    notExamined(1, TITLES.fall),
    techFach(2, TITLES.boden, [
      tech("2.1", "Haltetechniken in Verbindung mit Hebeln und Übergängen", {
        note: "alle vier Haltetechniken durchlaufen",
      }),
    ]),
    techFach(3, TITLES.abwehr, [
      tech("3.1", "Abwehrtechnik mit dem Ellenbogen", { executions: 2 }),
      tech("3.2", "Abwehrtechnik mit sofort folgender Armkontrolle und Konter", {
        note: "Block-Check-Konter",
      }),
    ]),
    techFach(4, TITLES.atemi, [
      tech("4.1", "Ellenbogentechnik", { executions: 4 }),
      tech("4.2", "Atemi mit dem Unterarm nach innen oder außen", { note: "„Clothesline“" }),
    ]),
    techFach(5, TITLES.wuerge, [
      tech("5.1", "Würgetechnik mit Beinen oder Füßen", { executions: 2 }),
    ]),
    techFach(
      6,
      TITLES.hebel,
      [
        tech("6.1", "Armhebel im Stand", { executions: 2 }),
        tech("6.2", "Armhebel am Boden", { executions: 2 }),
        tech("6.3", "Handgelenkhebel", { executions: 2 }),
        tech("6.4", "Fingerhebel"),
        tech("6.5", "Beinhebel"),
        tech("6.6", "Genickhebel"),
      ],
      HEBEL_HINT,
    ),
    techFach(7, TITLES.wurf, [
      tech("7.1", "Wurf nach Wahl des Prüflings", {
        executions: 3,
        note: "max. 1 aus dem Kyu-Bereich, mind. 1 Selbstfallwurf",
      }),
    ]),
    techFach(8, TITLES.stock, [
      tech("8.1", "Folgetechnik mit dem Stock", {
        executions: 4,
        note: "nach der Entwaffnung: Atemi-, Wurf-, Würge- oder Hebeltechnik",
        attackPlaceholder: STOCK_ATTACK,
      }),
    ]),
    techFach(9, TITLES.messer, [
      tech("9.1", "Messerabwehr gegen Angriffswinkel nach freier Wahl", {
        executions: 3,
        attackPlaceholder: "z. B. Angriffswinkel 4",
      }),
      weapon("9.2", "Messerabwehr in Dolchhaltung", [1, 2], { suffix: "Dolchhaltung" }),
    ]),
    techFach(10, TITLES.weiter, [
      tech("10.1", "Weiterführung von Hebeltechniken", { executions: 3 }),
      tech("10.2", "Weiterführung von Wurftechniken", { executions: 3 }),
      tech("10.3", "Weiterführung von Würgetechniken"),
    ]),
    techFach(11, TITLES.gegen, [
      tech("11.1", "Gegentechniken gegen Hebeltechniken", { executions: 3 }),
      tech("11.2", "Gegentechniken gegen Wurftechniken", { executions: 3 }),
      tech("11.3", "Gegentechniken gegen Würgetechniken", {
        executions: 2,
        note: "Würgetechnik aus dem Prüfungsprogramm, nicht aus dem Angriffskatalog",
        attackPlaceholder: "Würgetechnik des Angreifers …",
      }),
    ]),
    tbiFach(
      12,
      TITLES.freie,
      "Verteidigung gegen 2 unbewaffnete Angreifer: je 3–5 angesagte und freie Angriffe, jeweils mit und ohne Kontakt.",
    ),
    infoFach(13, TITLES.anwendung, "Eine der beiden Formen nach Wahl des Prüflings:", [
      "13.1 Selbstgewählte Darstellung als freie Form: mind. 10 Techniken als Verkettung in max. 2 Kombinationen (Atemi-, Hebel- und Wurftechniken, nicht nur aus einem Fach)",
      "alternativ: Teil einer traditionellen Kata (Goshin-Jutsu, Kime no Kata oder Ebo no Kata) mit mind. 5 Abwehrhandlungen",
      "13.2 Freie Auseinandersetzung mit Ju-Jutsu-Techniken",
    ]),
    notExamined(14, TITLES.bewegung),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

const nidan: BeltDef = {
  ...DAN_STYLE,
  id: "2dan",
  grade: 2,
  colorName: "Nidan",
  stripes: 2,
  faecher: [
    notExamined(1, TITLES.fall),
    techFach(2, TITLES.boden, [
      tech("2.1", "Haltetechniken in Verbindung mit Würgetechniken und Übergängen"),
    ]),
    techFach(3, TITLES.abwehr, [
      tech("3.1", "Dreierkontakt als Abwehrhandlung", { executions: 2 }),
    ]),
    techFach(4, TITLES.atemi, [
      tech("4.1", "Fußstoß rückwärts"),
      tech("4.2", "Fußtritt rückwärts"),
      tech("4.3", "Halbkreisfußtritt rückwärts"),
    ]),
    techFach(5, TITLES.wuerge, [
      tech("5.1", "Nervendrucktechnik", {
        executions: 4,
        note: "auf vier unterschiedliche Vitalpunkte",
      }),
      tech("5.2", "Kombinierte Würgetechnik", {
        executions: 2,
        note: "mit Hebel- und/oder Nervendrucktechnik",
      }),
    ]),
    techFach(
      6,
      TITLES.hebel,
      [
        tech("6.1", "Armhebel im Stand", { executions: 3 }),
        tech("6.2", "Armhebel am Boden", { executions: 3 }),
        tech("6.3", "Handgelenkhebel", { executions: 3 }),
        tech("6.4", "Fingerhebel"),
        tech("6.5", "Beinhebel"),
        tech("6.6", "Genickhebel"),
      ],
      HEBEL_HINT,
    ),
    techFach(7, TITLES.wurf, [
      tech("7.1", "Wurf nach Wahl des Prüflings", {
        executions: 4,
        note: "max. 2 aus dem Kyu-Bereich, mind. 1 Selbstfallwurf",
      }),
    ]),
    techFach(8, TITLES.stock, [
      tech("8.1.1", "Atemitechniken", {
        category: "Folgetechniken mit dem Stock",
        executions: 2,
        attackPlaceholder: STOCK_ATTACK,
      }),
      tech("8.1.2", "Wurf-, Würge- oder Hebeltechniken", {
        category: "Folgetechniken mit dem Stock",
        executions: 2,
        attackPlaceholder: STOCK_ATTACK,
      }),
    ]),
    techFach(9, TITLES.messer, [
      tech("9.1", "Messerabwehr gegen Bedrohungen aus der Nahdistanz", {
        executions: 3,
        note: "unterschiedliche Bedrohungen nach Wahl des Prüflings",
        attackPlaceholder: "z. B. Messer am Hals von hinten",
      }),
    ]),
    techFach(10, TITLES.weiter, [
      tech("10.1", "Weiterführung von Hebeltechniken", { executions: 3 }),
      tech("10.2", "Weiterführung von Wurftechniken", { executions: 3 }),
      tech("10.3", "Weiterführung von Würgetechniken", { executions: 3 }),
    ]),
    techFach(11, TITLES.gegen, [
      tech("11.1", "Gegentechniken gegen Hebeltechniken", { executions: 3 }),
      tech("11.2", "Gegentechniken gegen Wurftechniken aus der Bewegung", { executions: 3 }),
    ]),
    tbiFach(
      12,
      TITLES.freie,
      "Verteidigung gegen 2 bewaffnete Angreifer: je 5–10 angesagte und freie Angriffe mit Stock und beweglichem Gegenstand.",
    ),
    infoFach(13, TITLES.anwendung, "Eine der beiden Formen nach Wahl des Prüflings:", [
      "13.1 Selbstgewählte Darstellung als freie Form: mind. 15 Techniken als Verkettung in max. 3 Kombinationen",
      "13.2 Freie Auseinandersetzung mit Ju-Jutsu-Techniken",
    ]),
    notExamined(14, TITLES.bewegung),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

const sandan: BeltDef = {
  ...DAN_STYLE,
  id: "3dan",
  grade: 3,
  colorName: "Sandan",
  stripes: 3,
  faecher: [
    notExamined(1, TITLES.fall),
    techFach(2, TITLES.boden, [
      tech("2.1", "Übergang vom Stand zum Boden mit abschließender Kontrolltechnik", {
        executions: 2,
      }),
    ]),
    notExamined(3, TITLES.abwehr),
    techFach(4, TITLES.atemi, [
      tech("4.1", "Atemitechnik nach Wahl des Prüflings", {
        executions: 8,
        note: "je mind. 2 aus Hand/Faust, Knie/Fuß und Ellenbogen",
      }),
    ]),
    techFach(5, TITLES.wuerge, [
      tech("5.1", "Würgetechnik mit sonstigen Hilfsmitteln", {
        executions: 2,
        note: "Alltagsgegenstände, nicht Kleidung oder Stock",
      }),
    ]),
    techFach(6, TITLES.hebel, [
      tech("6.1", "Armhebel im Stand", { executions: 3 }),
      tech("6.2", "Armhebel am Boden", { executions: 3 }),
      tech("6.3", "Handgelenkhebel", { executions: 3 }),
      tech("6.4", "Fingerhebel", { executions: 2 }),
      tech("6.5", "Beinhebel", { executions: 2 }),
      tech("6.6", "Genickhebel", { executions: 2 }),
    ]),
    techFach(7, TITLES.wurf, [
      tech("7.1", "Wurf nach Wahl des Prüflings", {
        executions: 5,
        note: "max. 2 aus dem Kyu-Bereich, mind. 1 Selbstfallwurf",
      }),
    ]),
    techFach(8, TITLES.stock, [
      tech("8.1", "Weitergeführte Verteidigungshandlung nach Stockabwehr", {
        executions: 6,
        note: "Folgetechnik mit dem Stock wird gestört und passend weitergeführt",
        attackPlaceholder: STOCK_ATTACK,
      }),
    ]),
    techFach(9, TITLES.messer, [
      tech("9.1", "Messerabwehr", {
        executions: 5,
        note: "je mind. 1 aus Winkel 1–5, Dolchhaltung und Nahdistanz",
        attackPlaceholder: "z. B. Angriffswinkel 2 · Dolchhaltung",
      }),
    ]),
    techFach(
      10,
      TITLES.weiter,
      [
        tech("10.1", "Weiterführung von Hebeltechniken", { executions: 4 }),
        tech("10.2", "Weiterführung von Wurftechniken", { executions: 4 }),
        tech("10.3", "Weiterführung von Würgetechniken", { executions: 3 }),
      ],
      "Die Techniken sagt der Prüfer an – aus allen Hebel-, Wurf- und Würgetechniken des Prüfungsprogramms und der Stoffsammlung.",
    ),
    techFach(
      11,
      TITLES.gegen,
      [
        tech("11.1", "Gegentechniken gegen Hebeltechniken", { executions: 4 }),
        tech("11.2", "Gegentechniken gegen Wurftechniken aus der Bewegung", { executions: 4 }),
      ],
      "Die Techniken sagt der Prüfer an – aus allen Hebel- und Wurftechniken des Prüfungsprogramms und der Stoffsammlung.",
    ),
    tbiFach(
      12,
      TITLES.freie,
      "Verteidigung gegen 2 Angreifer: je 6–12 angesagte und freie Angriffe aus dem Bereich Stock sowie mit und ohne Kontakt.",
    ),
    infoFach(13, TITLES.anwendung, "Eine der beiden Formen nach Wahl des Prüflings:", [
      "13.1 Selbstgewählte Darstellung als freie Form: mind. 20 Techniken als Verkettung in max. 4 Kombinationen",
      "13.2 Freie Auseinandersetzung mit Ju-Jutsu-Techniken",
    ]),
    notExamined(14, TITLES.bewegung),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

const yondan: BeltDef = {
  ...DAN_STYLE,
  id: "4dan",
  grade: 4,
  colorName: "Yondan",
  stripes: 4,
  faecher: [
    notExamined(1, TITLES.fall),
    techFach(2, TITLES.boden, [
      tech("2.1", "Übergang vom Stand zum Boden mit abschließender Kontrolltechnik", {
        executions: 4,
      }),
    ]),
    notExamined(3, TITLES.abwehr),
    techFach(4, TITLES.atemi, [
      tech("4.1", "Atemitechnik nach Wahl des Prüflings", {
        executions: 10,
        note: "je mind. 3 aus Hand/Faust, Knie/Fuß und Ellenbogen",
      }),
    ]),
    techFach(5, TITLES.wuerge, [
      tech("5.1", "Nervendrucktechnik", { executions: 6 }),
      tech("5.2", "Würgetechnik", { executions: 6 }),
    ]),
    techFach(6, TITLES.hebel, [
      tech("6.1", "Armhebel im Stand", { executions: 4 }),
      tech("6.2", "Armhebel am Boden", { executions: 4 }),
      tech("6.3", "Handgelenkhebel", { executions: 4 }),
      tech("6.4", "Fingerhebel", { executions: 3 }),
      tech("6.5", "Beinhebel", { executions: 3 }),
    ]),
    techFach(7, TITLES.wurf, [
      tech("7.1", "Wurf nach Wahl des Prüflings", {
        executions: 6,
        note: "max. 3 aus dem Kyu-Bereich, mind. 2 Selbstfallwürfe",
      }),
    ]),
    techFach(8, TITLES.stock, [
      weapon("8.1", "Verteidigungshandlung mit dem Stock", [1, 2, 3, 4, 5, 6], {
        note: "Verteidigung freigestellt, Angreifer ist zu entwaffnen",
      }),
    ]),
    techFach(9, TITLES.messer, [
      tech("9.1", "Messerabwehr", { executions: 5, note: MESSER_ANGESAGT }),
    ]),
    techFach(
      10,
      TITLES.weiter,
      announced("10.1", "Weiterführung von Ju-Jutsu-Techniken", 3),
      "Der Prüfer sagt 3 Techniken an. Jede wird zweimal angesetzt, der Partner reagiert jeweils unterschiedlich – jede Weiterführung als eigene Sequenz.",
    ),
    techFach(
      11,
      TITLES.gegen,
      announced("11.1", "Gegentechniken gegen Ju-Jutsu-Techniken", 3),
      "Der Prüfer sagt 3 Techniken an. Der Angreifer setzt jede zweimal an, der Verteidiger zeigt jeweils eine andere Gegentechnik – jede als eigene Sequenz.",
    ),
    tbiFach(
      12,
      TITLES.freie,
      "Verteidigung gegen 2 Angreifer: je 9–15 angesagte und freie Angriffe aus dem Bereich Stock sowie mit und ohne Kontakt.",
    ),
    infoFach(13, TITLES.anwendung, "Eine der beiden Formen nach Wahl des Prüflings:", [
      "13.1 Traditionelle Kata",
      "13.2 Selbstgewählte Darstellung von mind. 20 Ju-Jutsu-Techniken in Kata-ähnlicher Form",
      "Eine schriftliche Ausarbeitung (Absicht, Inhalt, Raumaufteilung, Ablauf) geht in die Bewertung ein",
    ]),
    notExamined(14, TITLES.bewegung),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

const godan: BeltDef = {
  ...DAN_STYLE,
  id: "5dan",
  grade: 5,
  colorName: "Godan",
  stripes: 5,
  faecher: [
    notExamined(1, TITLES.fall),
    infoFach(
      2,
      TITLES.boden,
      "Aufgabenstellung nach freier Wahl des Prüfers: bis zu 5 Bodentechniken, Übergänge vom Stand zum Boden oder Aufgaben zur Selbstverteidigung in der Bodenlage aus dem gesamten Prüfungsprogramm.",
    ),
    infoFach(
      3,
      TITLES.abwehr,
      "Aufgabenstellung nach freier Wahl des Prüfers: Stichproben der im gesamten Prüfungsprogramm geforderten und in der Stoffsammlung aufgeführten Abwehrtechniken.",
    ),
    infoFach(
      4,
      TITLES.atemi,
      "Aufgabenstellung nach freier Wahl des Prüfers: Stichproben der im gesamten Prüfungsprogramm geforderten und in der Stoffsammlung aufgeführten Atemitechniken – auch in explizit benannter Form (z. B. Knieschlag vertikal).",
    ),
    techFach(
      5,
      TITLES.wuerge,
      [
        tech("5.1", "Würgetechnik mit Armen oder Händen", { executions: 3, executionsMax: true }),
        tech("5.2", "Würgetechnik mit Beinen oder Füßen", { executions: 2, executionsMax: true }),
        tech("5.3", "Würgetechnik mit Verwendung der Kleidung", { executions: 3, executionsMax: true }),
        tech("5.4", "Würgetechnik mit sonstigen Hilfsmitteln", { executions: 2, executionsMax: true }),
        tech("5.5", "Kombinierte Würgetechnik", { executions: 3, executionsMax: true }),
      ],
      "Stichprobe nach Wahl des Prüfers (je bis zu 3 verschiedene Techniken). Die Auswahl innerhalb einer Gruppe obliegt dem Prüfling.",
    ),
    techFach(
      6,
      TITLES.hebel,
      [
        tech("6.1", "Armhebel im Stand", { executions: 5, executionsMax: true }),
        tech("6.2", "Armhebel am Boden", { executions: 5, executionsMax: true }),
        tech("6.3", "Handgelenkhebel", { executions: 5, executionsMax: true }),
        tech("6.4", "Fingerhebel", { executions: 4, executionsMax: true }),
        tech("6.5", "Beinhebel", { executions: 4, executionsMax: true }),
      ],
      "Stichprobe nach Wahl des Prüfers. Die Auswahl innerhalb einer Gruppe obliegt dem Prüfling.",
    ),
    techFach(7, TITLES.wurf, [
      tech("7.1", "Wurf nach Wahl des Prüflings", {
        executions: 8,
        executionsMax: true,
        note: "max. 4 aus dem Kyu-Bereich, mind. 3 Selbstfallwürfe",
      }),
    ]),
    techFach(8, TITLES.stock, [
      tech("8.1", "Verteidigungshandlung mit dem Stock gegen freie Angriffswinkel", {
        executions: 6,
        executionsMax: true,
        note: "nur Angriffswinkel 1–6, Angreifer ist zu entwaffnen",
        attackPlaceholder: "z. B. Angriffswinkel 5",
      }),
    ]),
    techFach(9, TITLES.messer, [
      tech("9.1", "Messerabwehr", { executions: 7, executionsMax: true, note: MESSER_ANGESAGT }),
    ]),
    techFach(
      10,
      TITLES.weiter,
      announced("10.1", "Weiterführung von Ju-Jutsu-Techniken", 5),
      "Der Prüfer gibt 5 unterschiedliche Techniken vor. Jede wird zweimal angesetzt, der Partner reagiert jeweils unterschiedlich – jede Weiterführung als eigene Sequenz.",
    ),
    techFach(
      11,
      TITLES.gegen,
      announced("11.1", "Gegentechniken gegen Ju-Jutsu-Techniken", 5),
      "Der Prüfer gibt 5 unterschiedliche Techniken vor. Der Angreifer setzt jede zweimal an, der Verteidiger zeigt jeweils eine andere Gegentechnik – jede als eigene Sequenz.",
    ),
    tbiFach(
      12,
      TITLES.freie,
      "Verteidigung gegen 2 Angreifer: je 9–15 angesagte und freie Angriffe aus dem Bereich Stock sowie mit und ohne Kontakt.",
    ),
    infoFach(
      13,
      TITLES.anwendung,
      "Eine der beiden Formen nach Wahl des Prüflings – Form und/oder Inhalt müssen sich grundlegend von der Darstellung zum 4. Dan unterscheiden:",
      [
        "13.1 Traditionelle Kata",
        "13.2 Selbstgewählte Darstellung von mind. 20 Ju-Jutsu-Techniken in Kata-ähnlicher Form",
        "Eine schriftliche Ausarbeitung geht in die Bewertung ein",
        "Bewerten mind. 2 Prüfer dieses Fach mit weniger als 3 Punkten, ist die Prüfung nicht bestanden",
      ],
    ),
    notExamined(14, TITLES.bewegung),
    KOMBINATIONEN,
    PARTNERVERHALTEN,
  ],
};

export const KYU_BELTS: BeltDef[] = [gelb, orange, gruen, blau, braun];
export const DAN_BELTS: BeltDef[] = [shodan, nidan, sandan, yondan, godan];
export const BELTS: BeltDef[] = [...KYU_BELTS, ...DAN_BELTS];

export const BELT_BY_ID: Record<string, BeltDef> = Object.fromEntries(
  BELTS.map((b) => [b.id, b]),
);

export function getBelt(id: string | null | undefined): BeltDef | undefined {
  if (!id) return undefined;
  return BELT_BY_ID[id];
}

/** "5. Kyu" / "1. Dan" */
export function gradeLabel(belt: BeltDef): string {
  return `${belt.grade}. ${belt.level === "dan" ? "Dan" : "Kyu"}`;
}
