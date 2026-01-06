import { Noun, Progress } from "./types";

function unseenWeight(): number {
  return 1.5;
}

export function selectWeakFullNoun(
  nouns: Noun[],
  progress: Progress
): Noun {
  const weights = nouns.map((noun) => {
    const key = `${noun.english}|${noun.german}`;
    const stats = progress.byNoun[key];

    if (!stats || stats.attempts === 0) {
      return unseenWeight();
    }

    const accuracy = stats.correct / stats.attempts;
    return Math.max(0.2, 1 - accuracy);
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;

  for (let i = 0; i < nouns.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return nouns[i];
  }

  return nouns[0];
}

export function selectWeakArticleNoun(
  nouns: Noun[],
  progress: Progress
): Noun {
  const weights = nouns.map((noun) => {
    const key = `${noun.english}|${noun.german}`;
    const stats = progress.byNoun[key];

    if (!stats || stats.articleAttempts === 0) {
      return unseenWeight(); // unseen nouns are prioritized
    }

    const accuracy =
      stats.articleCorrect / stats.articleAttempts;

    return Math.max(0.2, 1 - accuracy);
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;

  for (let i = 0; i < nouns.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return nouns[i];
  }

  return nouns[0];
}
