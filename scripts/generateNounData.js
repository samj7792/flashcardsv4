import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.resolve(__dirname, "../data/nouns.csv");
const output = path.resolve(
  __dirname,
  "../src/features/nounPractice/nounData.ts"
);

const VALID_ARTICLES = ["der", "die", "das"];
const VALID_LEVELS = ["A1", "A2", "B1", "B2"];

function parseCSV(text) {
  const lines = text.trim().split("\n").slice(1);

  return lines.map((line) => {
    const [
      english,
      german,
      article,
      level,
      example_de,
      example_en,
    ] = line.split(",");

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

function validate(row, index) {
  if (!VALID_ARTICLES.includes(row.article)) {
    throw new Error(
      `Invalid article "${row.article}" on row ${index + 2}`
    );
  }

  if (!VALID_LEVELS.includes(row.level)) {
    throw new Error(
      `Invalid level "${row.level}" on row ${index + 2}`
    );
  }

  if (!row.example_de.includes(row.article)) {
    console.warn(
      `⚠️  Article missing in German example (row ${index + 2})`
    );
  }
}

const csv = fs.readFileSync(input, "utf8");
const rows = parseCSV(csv);

rows.forEach(validate);

/**
 * Group rows by noun
 */
const grouped = new Map();

for (const row of rows) {
  const key = `${row.english}|${row.german}`;

  if (!grouped.has(key)) {
    grouped.set(key, {
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

const nouns = Array.from(grouped.values());

const content = `import { Noun } from "./types";

export const NOUNS: Noun[] = ${JSON.stringify(nouns, null, 2)};
`;

fs.writeFileSync(output, content);
console.log(`✅ Generated ${nouns.length} nouns with examples`);
