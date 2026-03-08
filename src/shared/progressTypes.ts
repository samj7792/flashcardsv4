import { CaseProgress } from "../features/cases/types";
import { NounProgress } from "../features/nounPractice/types";
import { VerbProgress } from "../features/verbPractice/types";

export interface Progress {
  version: number;

  summary: {
    totalAttempts: number;
    totalCorrect: number;
  };

  nouns: NounProgress;
  verbs: VerbProgress;
  cases: CaseProgress;
}
