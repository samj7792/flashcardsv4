import { Noun } from "./types";

/*
Currently leaving in the option to cloze article or noun separately
this will likely be useful when practicing dativ, akkusativ
*/
export function makeClozeSentence(
  sentence: string,
  noun: Noun,
  mode: "none" | "article" | "noun" | "both"
): string {
  if (mode === "none") return sentence;

  let result = sentence;

  if (mode === "article" || mode === "both") {
    result = result.replace(
      new RegExp(`\\b${noun.article}\\b`, "i"),
      "___"
    );
  }

  if (mode === "noun" || mode === "both") {
    result = result.replace(
      new RegExp(`\\b${noun.german}\\b`, "i"),
      "_____"
    );
  }

  return result;
}
