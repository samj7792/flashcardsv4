import { Progress, GrammaticalCase } from "../nounPractice/types";

function emptyCaseStats() {
  return { attempts: 0, correct: 0 };
}

export function updateCaseProgress(
  progress: Progress,
  grammaticalCase: GrammaticalCase,
  isCorrect: boolean
): Progress {
  const prev = progress.byCase?.[grammaticalCase] ?? emptyCaseStats();

  return {
    ...progress,
    byCase: {
      ...progress.byCase,
      [grammaticalCase]: {
        attempts: prev.attempts + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
      },
    },
  };
}
