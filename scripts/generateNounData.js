import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STRICT_MODE = false; // set false to allow warnings

const input = path.resolve(__dirname, "../data/nouns.csv");
const output = path.resolve(
  __dirname,
  "../src/features/nounPractice/nounData.ts"
);

const VALID_ARTICLES = ["der", "die", "das"];
const VALID_LEVELS = ["A1", "A2", "B1", "B2"];

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
  const lines = text.trim().split("\n").slice(1);

  return lines.map((line) => {
    const [english, german, article, level, example_de, example_en] =
      line.split(",");

    return {
      english: english?.trim(),
      german: german?.trim(),
      article: article?.trim(),
      level: level?.trim(),
      example_de: example_de?.trim(),
      example_en: example_en?.trim(),
    };
  });
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

function validate(row, index) {
  if (!VALID_ARTICLES.includes(row.article)) {
    throw new Error(`Invalid article "${row.article}" on row ${index + 2}`);
  }

  if (!VALID_LEVELS.includes(row.level)) {
    throw new Error(`Invalid level "${row.level}" on row ${index + 2}`);
  }

  const articleRegex = new RegExp(`\\b${row.article}\\b`, "i");

  if (!articleRegex.test(row.example_de)) {
    reportIssue(`⚠️  Article missing in German example (row ${index + 2})`);
  }

  const pattern = new RegExp(`\\b${row.article}\\s+${row.german}\\b`, "i");

  if (!pattern.test(row.example_de)) {
    reportIssue(`⚠️  Article not directly attached to noun (row ${index + 2})`);
  }
}

const csv = fs.readFileSync(input, "utf8");
const rows = parseCSV(csv);

rows.forEach(validate);

function detectDuplicateNouns(rows) {
  const seen = new Map();

  rows.forEach((row, index) => {
    const key = `${row.english.toLowerCase()}|${row.german.toLowerCase()}`;

    if (seen.has(key)) {
      const firstRow = seen.get(key);
      reportIssue(
        `❌ Duplicate noun detected:
        "${row.english}" / "${row.german}"
        Rows: ${firstRow + 2} and ${index + 2}`
      );
    }

    seen.set(key, index);
  });
}

detectDuplicateNouns(rows);

/**
 * Group rows by noun
 */
const grouped = new Map();

for (const row of rows) {
  const key = `${row.english}|${row.german}`;

  if (!grouped.has(key)) {
    const id = `noun-${slugify(row.german)}-${row.article}`;

    grouped.set(key, {
      id,
      english: row.english,
      german: row.german,
      article: row.article,
      level: row.level,
      examples: [],
    });
  }

  const noun = grouped.get(key);

  // consistency checks
  if (noun.article !== row.article) {
    throw new Error(`Article mismatch for "${key}"`);
  }

  if (noun.level !== row.level) {
    throw new Error(`Level mismatch for "${key}"`);
  }

  noun.examples.push({
    german: row.example_de,
    english: row.example_en,
  });
}

function detectDuplicateExamples(grouped) {
  for (const [key, noun] of grouped.entries()) {
    const seen = new Map();

    noun.examples.forEach((ex, i) => {
      const normalized = ex.german.toLowerCase().replace(/\s+/g, " ").trim();

      if (seen.has(normalized)) {
        const firstIndex = seen.get(normalized);

        reportIssue(
          `Duplicate German example for "${key}":
          "${ex.german}"
          Examples ${firstIndex + 1} and ${i + 1}`
        );
      }

      seen.set(normalized, i);
    });
  }
}

function detectDuplicateIds(nouns) {
  const seen = new Set();

  nouns.forEach((noun) => {
    if (seen.has(noun.id)) {
      throw new Error(`❌ Duplicate noun id detected: ${noun.id}`);
    }
    seen.add(noun.id);
  });
}

const nouns = Array.from(grouped.values());

detectDuplicateIds(nouns);

detectDuplicateExamples(grouped);

const content = `import { Noun } from "./types";

export const NOUNS: Noun[] = ${JSON.stringify(nouns, null, 2)};
`;

function printSummary(nouns) {
  const levelCounts = {};
  let totalExamples = 0;
  let minExamples = Infinity;
  let maxExamples = 0;

  for (const noun of nouns) {
    levelCounts[noun.level] = (levelCounts[noun.level] ?? 0) + 1;

    const count = noun.examples.length;
    totalExamples += count;
    minExamples = Math.min(minExamples, count);
    maxExamples = Math.max(maxExamples, count);
  }

  const avgExamples =
    nouns.length === 0 ? 0 : (totalExamples / nouns.length).toFixed(2);

  console.log("\n📊 Dataset Summary");
  console.log("------------------");
  console.log(`Total nouns: ${nouns.length}`);
  console.log(`Total examples: ${totalExamples}`);
  console.log(`Avg examples / noun: ${avgExamples}`);
  console.log(`Min examples / noun: ${minExamples}`);
  console.log(`Max examples / noun: ${maxExamples}`);

  console.log("\nNouns by level:");
  Object.entries(levelCounts).forEach(([level, count]) => {
    console.log(`  ${level}: ${count}`);
  });

  if (!STRICT_MODE) {
    console.log(`\nWarnings: ${warningCount}`);
  }

  console.log("\n✅ Generation complete\n");
}

fs.writeFileSync(output, content);

console.log(`✅ Generated ${nouns.length} nouns with examples`);

printSummary(nouns);
