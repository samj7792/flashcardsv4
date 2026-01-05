export type Article = "der" | "die" | "das";

export interface Noun {
  english: string;
  german: string;
  article: Article;
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

export interface Progress {
  total: number;
  correct: number;
}
