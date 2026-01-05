import { Progress } from "../features/nounPractice/types";

const STORAGE_KEY = "german-practice:v1";

export function loadProgress(): Progress | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const parsed = JSON.parse(raw);

  return {
    total: parsed.total ?? 0,
    correct: parsed.correct ?? 0,
    byNoun: parsed.byNoun ?? {},
  };
}

export function saveProgress(data: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
