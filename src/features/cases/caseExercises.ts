export const CASE_EXERCISES = [
  {
    "level": "A1",
    "baseSentence": "___ Mann sieht den Hund.",
    "slot": "article",
    "grammaticalCase": "Nominativ",
    "correctForm": "der",
    "english": "The man sees the dog."
  },
  {
    "level": "A1",
    "baseSentence": "Der Mann sieht ___ Hund.",
    "slot": "article",
    "grammaticalCase": "Akkusativ",
    "correctForm": "den",
    "english": "The man sees the dog."
  },
  {
    "level": "A2",
    "baseSentence": "Ich helfe ___ Kind.",
    "slot": "article",
    "grammaticalCase": "Dativ",
    "correctForm": "dem",
    "english": "I help the child."
  },
  {
    "level": "B2",
    "baseSentence": "Das ist das Auto ___ Mannes.",
    "slot": "article",
    "grammaticalCase": "Genitiv",
    "correctForm": "des",
    "english": "That is the man’s car."
  }
] as const;
