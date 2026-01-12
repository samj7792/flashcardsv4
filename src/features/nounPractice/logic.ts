import {
  Answer,
  Noun,
  PracticeResult,
  Progress,
  PracticeMode,
  NounStats,
} from "./types";

export function getRandomNoun(nouns: Noun[]): Noun {
  if (!nouns.length) throw new Error("No nouns available");
  return nouns[Math.floor(Math.random() * nouns.length)];
}

function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

export function validateAnswer(noun: Noun, answer: Answer): PracticeResult {
  const correctArticle = noun.article === answer.article;
  const correctTranslation =
    normalize(noun.german) === normalize(answer.translation);

  return {
    correctArticle,
    correctTranslation,
    isCorrect: correctArticle && correctTranslation,
  };
}

function emptyStats(): NounStats {
  return {
    attempts: 0,
    correct: 0,
    articleAttempts: 0,
    articleCorrect: 0,
    lastSeen: 0,
  };
}

export function updateNounProgress(
  progress: Progress,
  noun: Noun,
  result: PracticeResult,
  mode: PracticeMode
): Progress {
  const key = noun.id;
  const prev = progress.byNoun[key] ?? emptyStats();

  const nextStats: NounStats = {
    ...prev,
    articleAttempts: prev.articleAttempts + 1,
    articleCorrect: prev.articleCorrect + (result.correctArticle ? 1 : 0),
    lastSeen: Date.now(),
  };

  if (mode === "FULL") {
    nextStats.attempts = prev.attempts + 1;
    nextStats.correct = prev.correct + (result.isCorrect ? 1 : 0);
  }

  return {
    ...progress, // ✅ preserve byCase and future fields
    total: progress.total + (mode === "FULL" ? 1 : 0),
    correct: progress.correct + (mode === "FULL" && result.isCorrect ? 1 : 0),
    byNoun: {
      ...progress.byNoun,
      [key]: nextStats,
    },
  };
}

export function initialProgress(): Progress {
  return {
    total: 0,
    correct: 0,
    byNoun: {},
    byCase: {},
    byCaseExercise: {},
  };
}
