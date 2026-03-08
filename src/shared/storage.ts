// import { initialNounProgress } from "../features/nounPractice/logic";
import { Progress } from "./progressTypes";
import { NOUNS } from "../features/nounPractice/nounData";
import { VerbProgress } from "../features/verbPractice/types";
import { initialVerbProgress } from "../features/verbPractice/logic";

// const STORAGE_KEY = "german-practice:v1";
const NOUN_PROGRESS = "noun-progress";
const VERB_PROGRESS = "verb-progress";
const STORAGE_KEY = "german-practice:v2";

const legacyKeyToId = new Map<string, string>();

NOUNS.forEach((noun) => {
  const legacyKey = `${noun.glosses[0]}|${noun.german}|${noun.article}`;
  legacyKeyToId.set(legacyKey, noun.id);
});

// function migrateNounProgress(byNoun: Record<string, any>) {
//   let migrated = false;
//   const next: Record<string, any> = {};

//   for (const [key, stats] of Object.entries(byNoun)) {
//     // Already migrated (new IDs start with "noun-")
//     if (key.startsWith("noun-")) {
//       next[key] = stats;
//       continue;
//     }

//     const id = legacyKeyToId.get(key);

//     if (!id) {
//       console.warn(`⚠️ Unknown legacy noun key skipped: ${key}`);
//       continue;
//     }

//     next[id] = stats;
//     migrated = true;
//   }

//   return { next, migrated };
// }

function migrateProgress(data: any): Progress {
  // Fresh install
  if (!data.version) {
    return {
      ...initialProgress(),
      nouns: {
        byNoun: data.byNoun ?? {},
      },
      cases: {
        byCase: data.byCase ?? initialProgress().cases.byCase,
        byExercise: data.byCaseExercise ?? {},
      },
    };
  }

  return data as Progress;
}

export function initialProgress(): Progress {
  return {
    version: 1,
    summary: {
      totalAttempts: 0,
      totalCorrect: 0,
    },
    nouns: {
      byNoun: {},
    },
    verbs: {
      byVerb: {},
    },
    cases: {
      byCase: {
        Nominativ: { attempts: 0, correct: 0 },
        Akkusativ: { attempts: 0, correct: 0 },
        Dativ: { attempts: 0, correct: 0 },
        Genitiv: { attempts: 0, correct: 0 },
      },
      byExercise: {},
    },
  };
}

// export function loadProgress(): Progress | null {
//   const raw = localStorage.getItem(NOUN_PROGRESS);
//   if (!raw) return null;

//   const parsed = JSON.parse(raw);

//   const rawByNoun = parsed.byNoun ?? {};
//   const { next: byNoun, migrated } = migrateNounProgress(rawByNoun);
//   const byCase = parsed.byCase ?? {};
//   const byCaseExercise = parsed.byCaseExercise ?? {};

//   // Backward compatibility for older saves
//   Object.values(byNoun).forEach((stats: any) => {
//     stats.articleAttempts ??= stats.attempts ?? 0;
//     stats.articleCorrect ??= stats.correct ?? 0;
//     stats.lastSeen ??= 0;
//   });

//   const progress = {
//     total: parsed.total ?? 0,
//     correct: parsed.correct ?? 0,
//     byNoun,
//     byCase: byCase,
//     byCaseExercise: byCaseExercise,
//   };

//   if (migrated) {
//     console.log("🔄 Migrated noun progress to ID-based keys");
//     saveProgress(progress);
//   }

//   return progress;
// }

export function loadOrInitProgress(): Progress {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialProgress();

  const parsed = JSON.parse(raw);

  return migrateProgress(parsed);
  // return parsed;
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress() {
  const fresh = initialProgress();
  // localStorage.setItem(NOUN_PROGRESS, JSON.stringify(fresh));
  saveProgress(fresh);
  // return fresh;
}

export function loadVerbProgress(): VerbProgress | null {
  const raw = localStorage.getItem(VERB_PROGRESS);
  if (!raw) return null;

  const parsed = JSON.parse(raw);

  const progress = {
    total: parsed.total ?? 0,
    correct: parsed.correct ?? 0,
    byVerb: parsed.byVerb ?? 0,
  };

  return progress;
}

export function loadOrInitVerbProgress(): VerbProgress {
  return loadVerbProgress() ?? initialVerbProgress();
}

export function saveVerbProgress(data: VerbProgress): void {
  localStorage.setItem(VERB_PROGRESS, JSON.stringify(data));
}

export function resetVerbProgress(): VerbProgress {
  const fresh = initialVerbProgress();
  localStorage.setItem(VERB_PROGRESS, JSON.stringify(fresh));
  return fresh;
}
