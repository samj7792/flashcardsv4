import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.resolve(__dirname, "../data/verbs.csv");
const output = path.resolve(
  __dirname,
  "../src/features/verbPractice/verbData.ts"
);

const VALID_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const FORMS = ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"];

function parseCSV(text) {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

function validateRow(row, index) {
  const rowNum = index + 2;

  if (!row.id) throw new Error(`Missing id (row ${rowNum})`);
  if (!row.german) throw new Error(`Missing german (row ${rowNum})`);

  if (!VALID_LEVELS.includes(row.level)) {
    throw new Error(`Invalid level "${row.level}" (row ${rowNum})`);
  }

  FORMS.forEach((form) => {
    if (!row[form]) {
      throw new Error(`Missing form "${form}" (row ${rowNum})`);
    }
  });

  if (!row.glosses) {
    throw new Error(`Missing glosses (row ${rowNum})`);
  }
}

const csv = fs.readFileSync(input, "utf8");
const rows = parseCSV(csv);

rows.forEach(validateRow);

const verbs = rows.map((row) => ({
  id: row.id,
  german: row.german,
  level: row.level,
  glosses: row.glosses
    .split("|")
    .map((g) => g.trim())
    .filter(Boolean),

  conjugations: {
    praesens: {
      ich: row.ich,
      du: row.du,
      er: row.er,
      sie: row.sie,
      es: row.es,
      wir: row.wir,
      ihr: row.ihr,
      Sie: row.Sie,
    },
  },
  separable: row.separable === "true",
}));

// Can later add columns with perfekt_ich, etc, which will create conjugations.perfekt
// as well as columns for separabe, prefix, baseVerbId

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

Object.entries(byLevel).forEach(([l, c]) => console.log(`  ${l}: ${c}`));

console.log("\n✅ Verb data generated\n");
