import { Verb, Form, VerbProgress, VerbStats } from "./types";

const FORMS: Form[] = ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"];

export function randomForm(): Form {
  // const forms: Form[] = ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"];
  return FORMS[Math.floor(Math.random() * FORMS.length)];
}

export function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

export function isCorrectConjugation(
  verb: Verb,
  form: Form,
  answer: string,
): boolean {
  const expected = verb.conjugations.praesens?.[form];
  if (!expected) return false;
  return normalize(expected) === normalize(answer);
}

export function initialVerbProgress(): VerbProgress {
  return {
    byVerb: {},
  };
}

function createEmptyByForm(): Record<
  Form,
  { attempts: number; correct: number }
> {
  const obj = {} as Record<Form, { attempts: number; correct: number }>;

  for (const f of FORMS) {
    obj[f] = { attempts: 0, correct: 0 };
  }

  return obj;
}

export function updateVerbProgress(
  progress: VerbProgress,
  verb: Verb,
  form: Form,
  correct: boolean,
): VerbProgress {
  const existing: VerbStats = progress.byVerb[verb.id] ?? {
    attempts: 0,
    correct: 0,
    lastSeen: 0,
    byForm: createEmptyByForm(),
  };

  const byForm = existing.byForm ?? createEmptyByForm();

  const formStats = byForm[form];

  const nextStats: VerbStats = {
    ...existing,
    attempts: existing.attempts + 1,
    correct: existing.correct + (correct ? 1 : 0),
    lastSeen: Date.now(),
    byForm: {
      ...byForm,
      [form]: {
        attempts: formStats.attempts + 1,
        correct: formStats.correct + (correct ? 1 : 0),
      },
    },
  };

  return {
    byVerb: {
      ...progress.byVerb,
      [verb.id]: nextStats,
    },
  };
}
