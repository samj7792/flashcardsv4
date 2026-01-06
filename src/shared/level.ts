import { Level } from "../features/nounPractice/types";

const LEVEL_KEY = "german-practice:levels";
const ALL_LEVELS: Level[] = ["A1", "A2", "B1", "B2"];

export function loadLevels(): Set<Level> {
  const raw = localStorage.getItem(LEVEL_KEY);
  if (!raw) return new Set(["A1"]);

  try {
    const parsed = JSON.parse(raw) as Level[];
    return new Set(parsed.filter(l => ALL_LEVELS.includes(l)));
  } catch {
    return new Set(["A1"]);
  }
}

export function saveLevels(levels: Set<Level>): void {
  localStorage.setItem(
    LEVEL_KEY,
    JSON.stringify(Array.from(levels))
  );
}
