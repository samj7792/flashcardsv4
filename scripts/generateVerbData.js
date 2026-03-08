// scripts/generateVerbData.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.resolve(__dirname, "../data/verbs.csv");
const output = path.resolve(
  __dirname,
  "../src/features/verbPractice/verbData.ts",
);

const VALID_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const FORMS = ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"];

const ENDINGS = {
  ich: "e",
  du: "st",
  er: "t",
  sie: "t",
  es: "t",
  wir: "en",
  ihr: "t",
  Sie: "en",
};

const AUX = {
  haben: {
    ich: "habe",
    du: "hast",
    er: "hat",
    sie: "hat",
    es: "hat",
    wir: "haben",
    ihr: "habt",
    Sie: "haben",
  },
  sein: {
    ich: "bin",
    du: "bist",
    er: "ist",
    sie: "ist",
    es: "ist",
    wir: "sind",
    ihr: "seid",
    Sie: "sind",
  },
};

const PARTICIPLE_OVERRIDES = {
  gehen: "gegangen",
  kommen: "gekommen",
  sehen: "gesehen",
  geben: "gegeben",
  nehmen: "genommen",
  essen: "gegessen",
  trinken: "getrunken",
  fahren: "gefahren",
  schlafen: "geschlafen",
};

function parseCSV(text) {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

function validateRow(row, i) {
  const rowNum = i + 2;

  if (!row.id) throw new Error(`Missing id row ${rowNum}`);
  if (!row.german) throw new Error(`Missing german row ${rowNum}`);

  if (!VALID_LEVELS.includes(row.level)) {
    throw new Error(`Invalid level ${row.level} row ${rowNum}`);
  }
}

function getStem(verb) {
  return verb.replace(/en$/, "");
}

function generatePraesens(row) {
  const baseVerb =
    row.separable === "true" ? row.german.replace(row.prefix, "") : row.german;

  const stem = getStem(baseVerb);

  const forms = {};

  FORMS.forEach((f) => {
    const base = `${stem}${ENDINGS[f]}`;

    forms[f] = row.separable === "true" ? `${base} ${row.prefix}` : base;
  });

  return forms;
}

function buildParticiple(row) {
  if (PARTICIPLE_OVERRIDES[row.german]) {
    return PARTICIPLE_OVERRIDES[row.german];
  }

  const stem = getStem(row.german);

  if (row.separable === "true" && row.prefix) {
    return `${row.prefix}ge${stem}t`;
  }

  return `ge${stem}t`;
}

function buildPerfekt(row) {
  const auxiliary = row.auxiliary || "haben";
  const participle = buildParticiple(row);

  const forms = {};

  FORMS.forEach((f) => {
    forms[f] = `${AUX[auxiliary][f]} ${participle}`;
  });

  return forms;
}

function buildPraeteritum(row) {
  if (row.irregular === "true") return undefined;

  const stem = getStem(row.german);

  return {
    ich: `${stem}te`,
    du: `${stem}test`,
    er: `${stem}te`,
    sie: `${stem}te`,
    es: `${stem}te`,
    wir: `${stem}ten`,
    ihr: `${stem}tet`,
    Sie: `${stem}ten`,
  };
}

function buildValency(row) {
  if (!row.object && !row.prep) return undefined;

  return {
    object: row.object || undefined,
    preposition: row.prep ? { prep: row.prep, case: row.prepCase } : undefined,
  };
}

function buildReflexive(row) {
  if (!row.reflexivePronoun) return undefined;

  return {
    pronoun: row.reflexivePronoun,
    case: row.reflexiveCase || "akkusativ",
  };
}

function buildExamples(row) {
  if (!row.sentence) return undefined;

  return [
    {
      german: row.sentence,
      english: row.sentenceEnglish || undefined,
    },
  ];
}

const csv = fs.readFileSync(input, "utf8");
const rows = parseCSV(csv);

rows.forEach(validateRow);

const verbs = rows.map((row) => {
  const conjugations = {
    praesens: generatePraesens(row),
    perfekt: buildPerfekt(row),
  };

  const praeteritum = buildPraeteritum(row);
  if (praeteritum) {
    conjugations.praeteritum = praeteritum;
  }

  return {
    id: row.id,
    german: row.german,
    level: row.level,

    glosses: row.glosses
      .split("|")
      .map((g) => g.trim())
      .filter(Boolean),

    conjugations,

    separable: row.separable === "true",
    prefix: row.prefix || undefined,

    auxiliary: row.auxiliary || undefined,
    irregular: row.irregular === "true",

    reflexive: buildReflexive(row),
    valency: buildValency(row),

    examples: buildExamples(row),
  };
});

const content = `import { Verb } from "./types";

export const VERBS: Verb[] = ${JSON.stringify(verbs, null, 2)};
`;

fs.writeFileSync(output, content);

console.log("\n📊 Verb Dataset Summary");
console.log("----------------------");
console.log(`Total verbs: ${verbs.length}`);

const byLevel = {};

verbs.forEach((v) => {
  byLevel[v.level] = (byLevel[v.level] ?? 0) + 1;
});

Object.entries(byLevel).forEach(([l, c]) => {
  console.log(`  ${l}: ${c}`);
});

console.log("\n✅ Verb data generated\n");
