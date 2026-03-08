// import { VerbStats } from "../verbPractice/types";

export type Article = "der" | "die" | "das";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type PracticeMode = "FULL" | "ARTICLE_ONLY";
export type ClozeMode = "both" | "none";
export type GrammaticalCase = "Nominativ" | "Akkusativ" | "Dativ" | "Genitiv";

export interface Noun {
  id: string;
  german: string;
  article: Article;
  plural: string;
  level: Level;
  glosses: string[];
  examples: ExampleSentence[];
}

export interface ExampleSentence {
  german: string;
  english: string;
}

export interface Answer {
  article: Article;
  translation: string;
}

export interface PracticeResult {
  correctArticle: boolean;
  correctTranslation: boolean;
  isCorrect: boolean;
}

export interface NounStats {
  attempts: number;
  correct: number;
  articleAttempts: number;
  articleCorrect: number;
  lastSeen: number;
}

export interface NounProgress {
  byNoun: Record<string, NounStats>;
}
