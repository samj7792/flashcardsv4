import { useEffect, useRef, useState } from "react";
import { NOUNS } from "./nounData";
import {
  getRandomNoun,
  initialProgress,
  updateProgress,
  validateAnswer,
} from "./logic";
import { Answer, Article, Noun, PracticeResult, Progress } from "./types";
import { loadProgress, saveProgress } from "../../shared/storage";

const ARTICLES: Article[] = ["der", "die", "das"];

export default function NounPracticePage() {
  const [noun, setNoun] = useState<Noun>(() => getRandomNoun(NOUNS));
  const [answer, setAnswer] = useState<Partial<Answer>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [progress, setProgress] = useState<Progress>(() => {
    return loadProgress<Progress>() ?? initialProgress();
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function submit() {
    if (!answer.article || !answer.translation) return;

    const validated = validateAnswer(noun, answer as Answer);
    setResult(validated);
    setProgress(updateProgress(progress, validated));
  }

  function next() {
    setNoun(getRandomNoun(NOUNS));
    setAnswer({});
    setResult(null);

    setTimeout(() => {
      inputRef.current?.focus();
    });
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        result ? next() : submit();
        return;
      }

      if (result) return;

      if (e.key === "1") setAnswer((a) => ({ ...a, article: "der" }));
      if (e.key === "2") setAnswer((a) => ({ ...a, article: "die" }));
      if (e.key === "3") setAnswer((a) => ({ ...a, article: "das" }));
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, result]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <main style={{ maxWidth: 480, margin: "3rem auto" }}>
      <h1>German Noun Practice</h1>

      <p>
        <strong>Translate:</strong> {noun.english}
      </p>

      <section>
        {ARTICLES.map((article) => (
          <button
            key={article}
            onClick={() => {
              setAnswer({ ...answer, article });
              inputRef.current?.focus();
            }}
            disabled={!!result}
            style={{
              marginRight: "0.5rem",
              fontWeight: answer.article === article ? "bold" : "normal",
            }}
          >
            {article}
          </button>
        ))}
      </section>

      <section style={{ marginTop: "1rem" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="German translation"
          value={answer.translation ?? ""}
          disabled={!!result}
          onChange={(e) =>
            setAnswer({ ...answer, translation: e.target.value })
          }
        />
      </section>

      <section style={{ marginTop: "1rem" }}>
        {!result ? (
          <button onClick={submit}>Submit</button>
        ) : (
          <button onClick={next}>Next</button>
        )}
      </section>

      {result && (
        <section style={{ marginTop: "1rem" }}>
          <p>
            Article: {result.correctArticle ? "✅" : `❌ (${noun.article})`}
          </p>
          <p>
            Translation:{" "}
            {result.correctTranslation ? "✅" : `❌ (${noun.german})`}
          </p>
        </section>
      )}

      <hr />

      <p>
        Progress: {progress.correct} / {progress.total}
      </p>
    </main>
  );
}
