import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
const VALID_SLOTS = ["article"];
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
  "einen",
  "einem",
  "eines",
];

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
  return text
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => {
      const [
        level,
        base_sentence,
        slot,
        grammaticalCase,
        correct_form,
        english,
      ] = line.split(",");

      return {
        level: level?.trim(),
        baseSentence: base_sentence?.trim(),
        slot: slot?.trim(),
        grammaticalCase: grammaticalCase?.trim(),
        correctForm: correct_form?.trim(),
        english: english?.trim(),
      };
    });
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

const exercises = rows.map((r) => ({
  level: r.level,
  baseSentence: r.baseSentence,
  slot: r.slot,
  grammaticalCase: r.grammaticalCase,
  correctForm: r.correctForm,
  english: r.english,
}));

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
