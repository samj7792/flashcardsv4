import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STRICT_MODE = false;

const input = path.resolve(__dirname, "../data/nouns.csv");
const output = path.resolve(
  __dirname,
  "../src/features/nounPractice/nounData.ts"
);

const VALID_ARTICLES = ["der", "die", "das"];
const VALID_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

let warningCount = 0;

function reportIssue(message) {
  if (STRICT_MODE) {
    throw new Error(`❌ ${message}`);
  } else {
    warningCount++;
    console.warn(`⚠️  ${message}`);
  }
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

function parseCSV(text) {
  const lines = text.trim().split("\n").slice(1);

  return lines.map((line) => {
    const [german, article, plural, level, glosses, example_de, example_en] =
      line.split(",");

    const glossList = glosses
      ?.split("|")
      .map((g) => g.trim())
      .filter(Boolean);

    return {
      german: german?.trim(),
      article: article?.trim(),
      plural: plural?.trim(),
      level: level?.trim(),
      glosses: glossList,
      example_de: example_de?.trim(),
      example_en: example_en?.trim(),
    };
  });
}

function validate(row, index) {
  const rowNum = index + 2;

  if (!VALID_ARTICLES.includes(row.article)) {
    throw new Error(`Invalid article "${row.article}" (row ${rowNum})`);
  }

  if (!VALID_LEVELS.includes(row.level)) {
    throw new Error(`Invalid level "${row.level}" (row ${rowNum})`);
  }

  if (!row.plural || row.plural.length < 2) {
    reportIssue(`Missing or invalid plural (row ${rowNum})`);
  }

  if (!row.glosses || row.glosses.length === 0) {
    throw new Error(`No glosses provided (row ${rowNum})`);
  }

  const articleRegex = new RegExp(`\\b${row.article}\\b`, "i");

  // if (!articleRegex.test(row.example_de)) {
  //   reportIssue(`Article missing in German example (row ${rowNum})`);
  // }

  // const pattern = new RegExp(`\\b${row.article}\\s+${row.german}\\b`, "i");

  // if (!pattern.test(row.example_de)) {
  //   reportIssue(`Article not directly attached to noun (row ${rowNum})`);
  // }
}

const csv = fs.readFileSync(input, "utf8");
const rows = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

rows.forEach(validate);

/**
 * Group rows by noun (German + article define identity)
 */
const grouped = new Map();

for (const row of rows) {
  const key = `${row.german}|${row.article}`;

  if (!grouped.has(key)) {
    const id = `noun-${slugify(row.german)}-${row.article}`;

    grouped.set(key, {
      id,
      german: row.german,
      article: row.article,
      plural: row.plural,
      level: row.level,
      glosses: new Set(),
      examples: [],
    });
  }

  const noun = grouped.get(key);

  // Merge glosses
  const glossList = row.glosses
    .split("|")
    .map((g) => g.trim())
    .filter(Boolean);

  if (!glossList.length) {
    reportIssue(`No glosses found for "${row.german}"`);
  }

  glossList.forEach((g) => noun.glosses.add(g.toLowerCase()));

  if (noun.level !== row.level) {
    reportIssue(`Level mismatch for "${key}"`);
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
          `Duplicate German example for "${key}" (examples ${
            firstIndex + 1
          } and ${i + 1})`
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

const nouns = Array.from(grouped.values()).map((n) => ({
  ...n,
  glosses: Array.from(n.glosses),
}));

detectDuplicateIds(nouns);

detectDuplicateExamples(grouped);

const content = `import { Noun } from "./types";

export const NOUNS: Noun[] = ${JSON.stringify(nouns, null, 2)};
`;

fs.writeFileSync(output, content);

printSummary(nouns);

function printSummary(nouns) {
  const levelCounts = {};
  let totalExamples = 0;

  nouns.forEach((noun) => {
    levelCounts[noun.level] = (levelCounts[noun.level] ?? 0) + 1;
    totalExamples += noun.examples.length;
  });

  console.log("\n📊 Dataset Summary");
  console.log("------------------");
  console.log(`Total nouns: ${nouns.length}`);
  console.log(`Total examples: ${totalExamples}`);

  console.log("\nNouns by level:");
  Object.entries(levelCounts).forEach(([level, count]) =>
    console.log(`  ${level}: ${count}`)
  );

  if (!STRICT_MODE) {
    console.log(`\nWarnings: ${warningCount}`);
  }

  console.log("\n✅ Generation complete\n");
}
