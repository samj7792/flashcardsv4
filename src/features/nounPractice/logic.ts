import { Answer, Noun, PracticeResult, Progress } from "./types";

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

function nounKey(noun: Noun): string {
  return `${noun.english}|${noun.german}`;
}

export function updateProgress(
  progress: Progress,
  noun: Noun,
  result: PracticeResult
): Progress {
  const key = nounKey(noun);
  const prev = progress.byNoun[key] ?? { attempts: 0, correct: 0 };

  return {
    total: progress.total + 1,
    correct: progress.correct + (result.isCorrect ? 1 : 0),
    byNoun: {
      ...progress.byNoun,
      [key]: {
        attempts: prev.attempts + 1,
        correct: prev.correct + (result.isCorrect ? 1 : 0),
      },
    },
  };
}

export function initialProgress(): Progress {
  return { total: 0, correct: 0, byNoun: {} };
}
