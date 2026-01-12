import { initialProgress } from "../features/nounPractice/logic";
import { Progress } from "../features/nounPractice/types";
import { NOUNS } from "../features/nounPractice/nounData";

const STORAGE_KEY = "german-practice:v1";

const legacyKeyToId = new Map<string, string>();

NOUNS.forEach((noun) => {
  const legacyKey = `${noun.english}|${noun.german}|${noun.article}`;
  legacyKeyToId.set(legacyKey, noun.id);
});

function migrateNounProgress(byNoun: Record<string, any>) {
  let migrated = false;
  const next: Record<string, any> = {};

  for (const [key, stats] of Object.entries(byNoun)) {
    // Already migrated (new IDs start with "noun-")
    if (key.startsWith("noun-")) {
      next[key] = stats;
      continue;
    }

    const id = legacyKeyToId.get(key);

    if (!id) {
      console.warn(`⚠️ Unknown legacy noun key skipped: ${key}`);
      continue;
    }

    next[id] = stats;
    migrated = true;
  }

  return { next, migrated };
}

export function loadProgress(): Progress | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const parsed = JSON.parse(raw);

  const rawByNoun = parsed.byNoun ?? {};
  const { next: byNoun, migrated } = migrateNounProgress(rawByNoun);
  const byCase = parsed.byCase ?? {};

  // Backward compatibility for older saves
  Object.values(byNoun).forEach((stats: any) => {
    stats.articleAttempts ??= stats.attempts ?? 0;
    stats.articleCorrect ??= stats.correct ?? 0;
  });

  const progress = {
    total: parsed.total ?? 0,
    correct: parsed.correct ?? 0,
    byNoun,
    byCase: byCase,
  };

  if (migrated) {
    console.log("🔄 Migrated noun progress to ID-based keys");
    saveProgress(progress);
  }

  return progress;
}

export function loadOrInitProgress(): Progress {
  return loadProgress() ?? initialProgress();
}

export function saveProgress(data: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetProgress(): Progress {
  const fresh = initialProgress();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}
