import { useEffect, useMemo, useRef, useState } from "react";
import { NOUNS } from "./nounData";
import { updateNounProgress, validateAnswer } from "./logic";
import {
  Answer,
  Article,
  Noun,
  PracticeResult,
  Progress,
  ClozeMode,
  NounStats,
} from "./types";
import { loadOrInitProgress, saveProgress } from "../../shared/storage";
import { loadLevels } from "../../shared/level";
import ModeToggle from "../../shared/ModeToggle";
import { makeClozeSentence } from "./cloze";

const ARTICLES: Article[] = ["der", "die", "das"];

export default function NounPracticePage() {
  const [weakMode, setWeakMode] = useState(true);
  const [noun, setNoun] = useState<Noun>(() => nextNoun());
  const [answer, setAnswer] = useState<Partial<Answer>>({});
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [progress, setProgress] = useState<Progress>(() =>
    loadOrInitProgress()
  );
  const [hasAnswered, setHasAnswered] = useState(false);

  const clozeMode: ClozeMode = hasAnswered ? "none" : "both";

  const inputRef = useRef<HTMLInputElement>(null);

  function nounWeight(stats: NounStats | undefined): number {
    if (!stats || stats.attempts === 0) return 3;

    const accuracy = stats.correct / stats.attempts;

    const hoursSinceSeen = (Date.now() - stats.lastSeen) / (1000 * 60 * 60);

    const recencyBoost = Math.exp(-hoursSinceSeen / 24);

    const baseWeakness = 1 - accuracy;

    return Math.max(0.2, baseWeakness + recencyBoost);
  }

  function getNounPool(): Noun[] {
    const levels = loadLevels();
    return NOUNS.filter((n) => levels.has(n.level));
  }

  function nextNoun(): Noun {
    const pool = getNounPool();
    if (!pool.length) throw new Error("No nouns available");

    if (!weakMode) {
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const weighted = pool.map((noun) => ({
      noun,
      weight: nounWeight(progress.byNoun[noun.id]),
    }));

    const total = weighted.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * total;

    for (const { noun, weight } of weighted) {
      r -= weight;
      if (r <= 0) return noun;
    }

    return weighted[weighted.length - 1].noun;
  }

  function submit() {
    if (!answer.article || !answer.translation) return;
    setHasAnswered(true);
    const validated = validateAnswer(noun, answer as Answer);
    setResult(validated);
    setProgress((p) => updateNounProgress(p, noun, validated, "FULL"));
  }

  function next() {
    setHasAnswered(false);
    setNoun(nextNoun());
    setAnswer({});
    setResult(null);
    setTimeout(() => inputRef.current?.focus());
  }

  const example = useMemo(() => {
    return noun.examples[Math.floor(Math.random() * noun.examples.length)];
  }, [noun]);

  const clozeSentence = makeClozeSentence(example.german, noun, clozeMode);

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
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const stats = progress.byNoun[noun.id];

  return (
    <main style={{ maxWidth: 480, margin: "3rem auto" }}>
      <h1>German Noun Practice</h1>

      <ModeToggle
        label="Focus on weak nouns"
        checked={weakMode}
        onChange={setWeakMode}
      />

      <p>
        <strong>Translate:</strong> {noun.english}
      </p>

      {/* <label>
        Cloze mode:
        <select
          value={clozeMode}
          onChange={(e) => setClozeMode(e.target.value as any)}
        >
          <option value="none">Off</option>
          <option value="article">Hide article</option>
          <option value="noun">Hide noun</option>
          <option value="both">Hide both</option>
        </select>
      </label> */}

      <div style={{ margin: "1rem" }}>
        <strong>Example</strong>
        <div>{clozeSentence}</div>
        {hasAnswered && (
          <div style={{ fontSize: "0.85rem", color: "#666" }}>
            {example.english}
          </div>
        )}
      </div>

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

      {/* {result && noun.examples.length > 0 && (
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
      )} */}

      {stats && (
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
          This noun accuracy: {stats.correct}/{stats.attempts}
        </p>
      )}
    </main>
  );
}
