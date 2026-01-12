import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STRICT_MODE = true;

const input = path.resolve(__dirname, "../data/cases.csv");
const output = path.resolve(
  __dirname,
  "../src/features/cases/caseExercises.ts"
);

const VALID_LEVELS = ["A1", "A2", "B1", "B2"];
const VALID_CASES = ["Nominativ", "Akkusativ", "Dativ", "Genitiv"];
const VALID_SLOTS = ["Definite Article", "Indefinite Article"];
const VALID_ARTICLE_FORMS = [
  // definite
  "der",
  "die",
  "das",
  "den",
  "dem",
  "des",

  // indefinite
  "ein",
  "eine",
  "einer",
  "einen",
  "einem",
  "eines",
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h).toString(16);
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let warningCount = 0;

function reportIssue(message) {
  if (STRICT_MODE) {
    throw new Error(`❌ ${message}`);
  } else {
    warningCount++;
    console.warn(`⚠️  ${message}`);
  }
}

function parseCSV(text) {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }).map((row) => ({
    level: row.level,
    baseSentence: row.base_sentence,
    slot: row.slot,
    grammaticalCase: row.case,
    correctForm: row.correct_form,
    english: row.english,
  }));
}

function validateRow(row, index) {
  const rowNum = index + 2;

  if (!VALID_LEVELS.includes(row.level)) {
    reportIssue(`Invalid level "${row.level}" (row ${rowNum})`);
  }

  if (!VALID_CASES.includes(row.grammaticalCase)) {
    reportIssue(`Invalid case "${row.grammaticalCase}" (row ${rowNum})`);
  }

  if (!VALID_SLOTS.includes(row.slot)) {
    reportIssue(`Invalid slot "${row.slot}" (row ${rowNum})`);
  }

  if (!VALID_ARTICLE_FORMS.includes(row.correctForm)) {
    reportIssue(`Invalid article form "${row.correctForm}" (row ${rowNum})`);
  }

  const blanks = (row.baseSentence.match(/___/g) || []).length;
  if (blanks !== 1) {
    reportIssue(`Sentence must contain exactly one blank (row ${rowNum})`);
  }

  if (!row.baseSentence.includes("___")) {
    reportIssue(`Missing blank placeholder ___ (row ${rowNum})`);
  }
}

const csv = fs.readFileSync(input, "utf8");
const rows = parseCSV(csv);

rows.forEach(validateRow);

function detectDuplicates(rows) {
  const seen = new Map();

  rows.forEach((row, index) => {
    const key = `${row.baseSentence}|${row.correctForm}`;
    if (seen.has(key)) {
      throw new Error(
        `❌ Duplicate exercise detected (rows ${seen.get(key) + 2} and ${
          index + 2
        })`
      );
    }
    seen.set(key, index);
  });
}

detectDuplicates(rows);

const exercises = rows.map((row) => {
  const idSource = `${row.level}|${row.grammaticalCase}|${row.baseSentence}|${row.correctForm}`;
  const id = `case-${hash(idSource).slice(0, 8)}`;

  return {
    id,
    level: row.level,
    baseSentence: row.baseSentence,
    slot: row.slot,
    grammaticalCase: row.grammaticalCase,
    correctForm: row.correctForm,
    english: row.english,
  };
});

function detectDuplicateCaseIds(exercises) {
  const seen = new Set();

  exercises.forEach((ex) => {
    if (seen.has(ex.id)) {
      throw new Error(`❌ Duplicate case exercise id: ${ex.id}`);
    }
    seen.add(ex.id);
  });
}

detectDuplicateCaseIds(exercises);

const content = `export const CASE_EXERCISES = ${JSON.stringify(
  exercises,
  null,
  2
)} as const;
`;

fs.writeFileSync(output, content);

printSummary(exercises);

function printSummary(exercises) {
  const byLevel = {};
  const byCase = {};

  exercises.forEach((ex) => {
    byLevel[ex.level] = (byLevel[ex.level] ?? 0) + 1;
    byCase[ex.grammaticalCase] = (byCase[ex.grammaticalCase] ?? 0) + 1;
  });

  console.log("\n📊 Case Exercise Summary");
  console.log("------------------------");
  console.log(`Total exercises: ${exercises.length}`);

  console.log("\nBy level:");
  Object.entries(byLevel).forEach(([l, c]) => console.log(`  ${l}: ${c}`));

  console.log("\nBy case:");
  Object.entries(byCase).forEach(([c, n]) => console.log(`  ${c}: ${n}`));

  if (!STRICT_MODE) {
    console.log(`\nWarnings: ${warningCount}`);
  }

  console.log("\n✅ Case exercises generated\n");
}
