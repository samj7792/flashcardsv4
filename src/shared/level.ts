import { Level } from "../features/nounPractice/types";

const LEVEL_KEY = "german-practice:level";

export function loadLevel(): Level {
  const stored = localStorage.getItem(LEVEL_KEY);
  if (stored === "A1" || stored === "A2" || stored === "B1" || stored === "B2") {
    return stored;
  }
  return "A1";
}

export function saveLevel(level: Level): void {
  localStorage.setItem(LEVEL_KEY, level);
}
