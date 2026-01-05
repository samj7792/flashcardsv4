import { Answer, Noun, PracticeResult, Progress } from "./types";

export function getRandomNoun(nouns: Noun[]): Noun {
  if (nouns.length === 0) {
    throw new Error("No nouns available");
  }

  const index = Math.floor(Math.random() * nouns.length);
  return nouns[index];
}

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

export function validateAnswer(
  noun: Noun,
  answer: Answer
): PracticeResult {
  const correctArticle = noun.article === answer.article;
  const correctTranslation =
    normalize(noun.german) === normalize(answer.translation);

  return {
    correctArticle,
    correctTranslation,
    isCorrect: correctArticle && correctTranslation,
  };
}

export function updateProgress(
  progress: Progress,
  result: PracticeResult
): Progress {
  return {
    total: progress.total + 1,
    correct: progress.correct + (result.isCorrect ? 1 : 0),
  };
}

export function initialProgress(): Progress {
  return { total: 0, correct: 0 };
}
