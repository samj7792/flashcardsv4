import { useEffect, useRef, useState } from "react";
import { NOUNS } from "./nounData";
import {
  getRandomNoun,
  initialProgress,
  updateProgress,
  validateAnswer,
} from "./logic";
import { Answer, Article, Noun, PracticeResult, Progress } from "./types";
import { selectWeakFullNoun } from "./weakSelection";
import { loadProgress, saveProgress } from "../../shared/storage";
import { loadLevels } from "../../shared/level";
import ModeToggle from "../../shared/ModeToggle";

const ARTICLES: Article[] = ["der", "die", "das"];

export default function NounPracticePage() {
  const [weakMode, setWeakMode] = useState(true);
  const [noun, setNoun] = useState<Noun>(() => nextNoun());
  const [answer, setAnswer] = useState<Partial<Answer>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [progress, setProgress] = useState<Progress>(() => {
    return loadProgress() ?? initialProgress();
  });

  const inputRef = useRef<HTMLInputElement>(null);

  function getNounPool(): Noun[] {
    const levels = loadLevels();
    return NOUNS.filter((n) => levels.has(n.level));
  }

  function nextNoun(): Noun {
    const pool = getNounPool();

    if (weakMode) {
      const progress = loadProgress();
      if (progress) {
        return selectWeakFullNoun(pool, progress);
      }
    }

    return getRandomNoun(pool);
  }

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit() {
    if (!answer.article || !answer.translation) return;
    const validated = validateAnswer(noun, answer as Answer);
    setResult(validated);
    setProgress((p) => updateProgress(p, noun, validated, "FULL"));
  }

  function next() {
    setNoun(nextNoun());
    setAnswer({});
    setResult(null);
    setTimeout(() => inputRef.current?.focus());
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        result ? next() : submit();
        return;
      }
      if (result) return;
      if (e.key === "1") {
        e.preventDefault();
        setAnswer((a) => ({ ...a, article: "der" }));
      }

      if (e.key === "2") {
        e.preventDefault();
        setAnswer((a) => ({ ...a, article: "die" }));
      }

      if (e.key === "3") {
        e.preventDefault();
        setAnswer((a) => ({ ...a, article: "das" }));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, result]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const nounKey = `${noun.english}|${noun.german}`;
  const stats = progress.byNoun[nounKey];

  return (
    <main style={{ maxWidth: 480, margin: "3rem auto" }}>
      <h1>German Noun Practice</h1>

      <ModeToggle
        label="Focus on weak nouns"
        description="Practice nouns you struggle with more often"
        checked={weakMode}
        onChange={setWeakMode}
      />

      <p>
        <strong>Translate:</strong> {noun.english}
      </p>

      <section>
        {ARTICLES.map((article, i) => (
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
            {article} <small>({i + 1})</small>
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
          <button onClick={submit}>Submit (Enter)</button>
        ) : (
          <button onClick={next}>Next (Enter)</button>
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

      {result && noun.examples.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "#f7f7f7",
            borderRadius: 6,
          }}
        >
          <div style={{ fontWeight: 600 }}>Example</div>
          <div>{noun.examples[0].german}</div>
          <div style={{ fontSize: "0.85rem", color: "#555" }}>
            {noun.examples[0].english}
          </div>
        </div>
      )}

      {stats && (
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
          This noun accuracy: {stats.correct}/{stats.attempts}
        </p>
      )}
    </main>
  );
}
