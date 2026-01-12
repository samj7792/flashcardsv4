import {
  Progress,
  GrammaticalCase,
  ExerciseStats,
} from "../nounPractice/types";

function emptyExerciseStats(): ExerciseStats {
  return { attempts: 0, correct: 0 };
}

export function updateCaseProgress(
  progress: Progress,
  exerciseId: string,
  grammaticalCase: GrammaticalCase,
  correct: boolean
): Progress {
  const prevCase = progress.byCase[grammaticalCase] ?? {
    attempts: 0,
    correct: 0,
  };

  const prevExercise =
    progress.byCaseExercise[exerciseId] ?? emptyExerciseStats();

  return {
    ...progress,
    byCase: {
      ...progress.byCase,
      [grammaticalCase]: {
        attempts: prevCase.attempts + 1,
        correct: prevCase.correct + (correct ? 1 : 0),
      },
    },
    byCaseExercise: {
      ...progress.byCaseExercise,
      [exerciseId]: {
        attempts: prevExercise.attempts + 1,
        correct: prevExercise.correct + (correct ? 1 : 0),
      },
    },
  };
}
