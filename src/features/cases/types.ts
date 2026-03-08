import { Level } from "../verbPractice/types";
import { GrammaticalCase } from "./caseExplanations";

export interface CaseStats {
  attempts: number;
  correct: number;
}

export interface CaseExercise {
  id: string;
  level: Level;
  baseSentence: string;
  slot: string;
  grammaticalCase: GrammaticalCase;
  correctForm: string;
  english: string;
}

export interface ExerciseStats {
  attempts: number;
  correct: number;
}

export interface CaseProgress {
  byCase: Record<GrammaticalCase, CaseStats>;
  byExercise: Record<string, ExerciseStats>;
}
