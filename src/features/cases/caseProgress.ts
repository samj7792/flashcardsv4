import { GrammaticalCase } from "../nounPractice/types";
import { CaseProgress, ExerciseStats } from "./types";

function emptyExerciseStats(): ExerciseStats {
  return { attempts: 0, correct: 0 };
}

export function updateCaseProgress(
  progress: CaseProgress,
  exerciseId: string,
  grammaticalCase: GrammaticalCase,
  correct: boolean,
): CaseProgress {
  const prevCase = progress.byCase[grammaticalCase] ?? {
    attempts: 0,
    correct: 0,
  };

  const prevExercise = progress.byExercise[exerciseId] ?? emptyExerciseStats();

  return {
    ...progress,
    byCase: {
      ...progress.byCase,
      [grammaticalCase]: {
        attempts: prevCase.attempts + 1,
        correct: prevCase.correct + (correct ? 1 : 0),
      },
    },
    byExercise: {
      ...progress.byExercise,
      [exerciseId]: {
        attempts: prevExercise.attempts + 1,
        correct: prevExercise.correct + (correct ? 1 : 0),
      },
    },
  };
}
