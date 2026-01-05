export type Article = "der" | "die" | "das";

export interface Noun {
  english: string;
  german: string;
  article: Article;
}
