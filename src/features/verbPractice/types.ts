export type Form = "ich" | "du" | "er" | "sie" | "es" | "wir" | "ihr" | "Sie";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Tense =
  | "praesens"
  | "perfekt"
  | "praeteritum"
  | "plusquamperfekt"
  | "futur_i"
  | "futur_ii";

export type Conjugation = Record<Form, string>;

export interface Verb {
  id: string;
  german: string;
  level: Level;
  glosses: string[];

  conjugations: Partial<Record<Tense, Conjugation>>;

  // morphology & syntax
  separable: boolean;
  prefix?: string;
  baseVerbId?: string;

  auxiliary?: "sein" | "haben" | "both";
  reflexive?: {
    pronoun: "mich" | "dich" | "sich" | "uns" | "euch";
    case: "akkusativ" | "dativ";
  };

  valency?: {
    object?: "akkusativ" | "dativ" | "genitiv" | "none";
    preposition?: {
      prep: string;
      case: "akkusativ" | "dativ";
    };
  };

  // pedagogy
  irregular?: boolean;
  notes?: string[];
}

export interface VerbStats {
  attempts: number;
  correct: number;
  lastSeen: number;
  byTense?: Record<Tense, { attempts: number; correct: number }>;
  byForm?: Record<Form, { attempts: number; correct: number }>;
}

export interface Progress {
  total: number;
  correct: number;
  byVerb: Record<string, VerbStats>;
}
