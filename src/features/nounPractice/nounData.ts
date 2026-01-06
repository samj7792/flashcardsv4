import { Noun } from "./types";

export const NOUNS: Noun[] = [
  // =====================
  // A1 — concrete, daily life
  // =====================
  { english: "man", german: "Mann", article: "der", level: "A1", examples: [] },
  { english: "woman", german: "Frau", article: "die", level: "A1", examples: [] },
  { english: "child", german: "Kind", article: "das", level: "A1", examples: [] },
  { english: "house", german: "Haus", article: "das", level: "A1", examples: [] },
  { english: "dog", german: "Hund", article: "der", level: "A1", examples: [] },
  { english: "cat", german: "Katze", article: "die", level: "A1", examples: [] },
  { english: "book", german: "Buch", article: "das", level: "A1", examples: [] },
  { english: "school", german: "Schule", article: "die", level: "A1", examples: [] },
  { english: "teacher", german: "Lehrer", article: "der", level: "A1", examples: [] },
  { english: "student", german: "Student", article: "der", level: "A1", examples: [] },
  { english: "apple", german: "Apfel", article: "der", level: "A1", examples: [] },
  { english: "bread", german: "Brot", article: "das", level: "A1", examples: [] },
  { english: "water", german: "Wasser", article: "das", level: "A1", examples: [] },
  { english: "coffee", german: "Kaffee", article: "der", level: "A1", examples: [] },
  { english: "table", german: "Tisch", article: "der", level: "A1", examples: [] },
  { english: "chair", german: "Stuhl", article: "der", level: "A1", examples: [] },
  { english: "door", german: "Tür", article: "die", level: "A1", examples: [] },
  { english: "window", german: "Fenster", article: "das", level: "A1", examples: [] },
  { english: "city", german: "Stadt", article: "die", level: "A1", examples: [] },
  { english: "car", german: "Auto", article: "das", level: "A1", examples: [] },

  // =====================
  // A2 — environments, routines
  // =====================
  { english: "friend", german: "Freund", article: "der", level: "A2", examples: [{english: "the friend", german: "the friend"}] },
  { english: "family", german: "Familie", article: "die", level: "A2", examples: [] },
  { english: "work", german: "Arbeit", article: "die", level: "A2", examples: [] },
  { english: "job", german: "Beruf", article: "der", level: "A2", examples: [] },
  { english: "street", german: "Straße", article: "die", level: "A2", examples: [] },
  { english: "place", german: "Ort", article: "der", level: "A2", examples: [{english: "the place", german: "the place"}] },
  { english: "time", german: "Zeit", article: "die", level: "A2", examples: [] },
  { english: "week", german: "Woche", article: "die", level: "A2", examples: [] },
  { english: "month", german: "Monat", article: "der", level: "A2", examples: [] },
  { english: "year", german: "Jahr", article: "das", level: "A2", examples: [] },
  { english: "food", german: "Essen", article: "das", level: "A2", examples: [] },
  { english: "drink", german: "Getränk", article: "das", level: "A2", examples: [] },
  { english: "restaurant", german: "Restaurant", article: "das", level: "A2", examples: [] },
  { english: "hotel", german: "Hotel", article: "das", level: "A2", examples: [] },
  { english: "train", german: "Zug", article: "der", level: "A2", examples: [] },
  { english: "station", german: "Bahnhof", article: "der", level: "A2", examples: [] },
  { english: "ticket", german: "Ticket", article: "das", level: "A2", examples: [] },
  { english: "weather", german: "Wetter", article: "das", level: "A2", examples: [] },
  { english: "music", german: "Musik", article: "die", level: "A2", examples: [] },
  { english: "movie", german: "Film", article: "der", level: "A2", examples: [] },

  // =====================
  // B1 — abstract & societal
  // =====================
  { english: "money", german: "Geld", article: "das", level: "B1", examples: [] },
  { english: "health", german: "Gesundheit", article: "die", level: "B1", examples: [] },
  { english: "language", german: "Sprache", article: "die", level: "B1", examples: [] },
  { english: "experience", german: "Erfahrung", article: "die", level: "B1", examples: [] },
  { english: "education", german: "Bildung", article: "die", level: "B1", examples: [] },
  { english: "government", german: "Regierung", article: "die", level: "B1", examples: [] },
  { english: "history", german: "Geschichte", article: "die", level: "B1", examples: [] },
  { english: "culture", german: "Kultur", article: "die", level: "B1", examples: [] },
  { english: "technology", german: "Technologie", article: "die", level: "B1", examples: [] },
  { english: "information", german: "Information", article: "die", level: "B1", examples: [] },
  { english: "problem", german: "Problem", article: "das", level: "B1", examples: [] },
  { english: "solution", german: "Lösung", article: "die", level: "B1", examples: [] },
  { english: "chance", german: "Chance", article: "die", level: "B1", examples: [] },
  { english: "reason", german: "Grund", article: "der", level: "B1", examples: [] },
  { english: "example", german: "Beispiel", article: "das", level: "B1", examples: [] },
  { english: "idea", german: "Idee", article: "die", level: "B1", examples: [] },
  { english: "plan", german: "Plan", article: "der", level: "B1", examples: [] },
  { english: "goal", german: "Ziel", article: "das", level: "B1", examples: [] },
  { english: "result", german: "Ergebnis", article: "das", level: "B1", examples: [] },
  { english: "difference", german: "Unterschied", article: "der", level: "B1", examples: [] },

  // =====================
  // B2 — abstract, academic, conceptual
  // =====================
  { english: "society", german: "Gesellschaft", article: "die", level: "B2", examples: [] },
  { english: "freedom", german: "Freiheit", article: "die", level: "B2", examples: [] },
  { english: "responsibility", german: "Verantwortung", article: "die", level: "B2", examples: [] },
  { english: "development", german: "Entwicklung", article: "die", level: "B2", examples: [] },
  { english: "research", german: "Forschung", article: "die", level: "B2", examples: [] },
  { english: "science", german: "Wissenschaft", article: "die", level: "B2", examples: [] },
  { english: "economy", german: "Wirtschaft", article: "die", level: "B2", examples: [] },
  { english: "politics", german: "Politik", article: "die", level: "B2", examples: [] },
  { english: "environment", german: "Umwelt", article: "die", level: "B2", examples: [] },
  { english: "justice", german: "Gerechtigkeit", article: "die", level: "B2", examples: [] },
  { english: "security", german: "Sicherheit", article: "die", level: "B2", examples: [] },
  { english: "knowledge", german: "Wissen", article: "das", level: "B2", examples: [] },
  { english: "behavior", german: "Verhalten", article: "das", level: "B2", examples: [] },
  { english: "relationship", german: "Beziehung", article: "die", level: "B2", examples: [] },
  { english: "influence", german: "Einfluss", article: "der", level: "B2", examples: [] },
  { english: "condition", german: "Bedingung", article: "die", level: "B2", examples: [] },
  { english: "effect", german: "Wirkung", article: "die", level: "B2", examples: [] },
  { english: "cause", german: "Ursache", article: "die", level: "B2", examples: [] },
  { english: "structure", german: "Struktur", article: "die", level: "B2", examples: [] },
  { english: "process", german: "Prozess", article: "der", level: "B2", examples: [] },
];
