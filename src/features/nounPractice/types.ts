export type Article = "der" | "die" | "das";
export type Level = "A1" | "A2" | "B1" | "B2";
export type PracticeMode = "FULL" | "ARTICLE_ONLY";
export type ClozeMode = "both" | "none";
export type GrammaticalCase =
  | "Nominativ"
  | "Akkusativ"
  | "Dativ"
  | "Genitiv";

export interface Noun {
  english: string;
  german: string;
  article: Article;
  level: Level;
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
}

export interface CaseStats {
  attempts: number;
  correct: number;
}

export interface Progress {
  total: number;
  correct: number;
  byNoun: Record<string, NounStats>;
  byCase: Partial<Record<GrammaticalCase, CaseStats>>;
}
