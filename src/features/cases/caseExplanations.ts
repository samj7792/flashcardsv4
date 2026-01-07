export type GrammaticalCase =
  | "Nominativ"
  | "Akkusativ"
  | "Dativ"
  | "Genitiv";

export const CASE_EXPLANATIONS: Record<GrammaticalCase, string> = {
  Nominativ: "Nominativ: Wer oder was? (the subject)",
  Akkusativ: "Akkusativ: Wen oder was? (direct object)",
  Dativ: "Dativ: Wem? (indirect object)",
  Genitiv: "Genitiv: Wessen? (possession / relationship)",
};
