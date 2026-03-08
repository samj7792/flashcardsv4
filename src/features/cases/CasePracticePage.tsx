import { useEffect, useState } from "react";
import { CASE_EXERCISES } from "./caseExercises";
import { loadLevels } from "../../shared/level";
import ModeToggle from "../../shared/ModeToggle";
import { CASE_EXPLANATIONS } from "./caseExplanations";
import { loadOrInitProgress, saveProgress } from "../../shared/storage";
import { updateCaseProgress } from "./caseProgress";
import { ExerciseStats } from "./types";
import { Progress } from "../../shared/progressTypes";

type Exercise = (typeof CASE_EXERCISES)[number];
type GrammaticalCase = "Nominativ" | "Akkusativ" | "Dativ" | "Genitiv";
type ArticleType = "Definite Article" | "Indefinite Article";

const DEFAULT_CASES: GrammaticalCase[] = ["Nominativ", "Akkusativ", "Dativ"];
const DEFAULT_ARTICLE_TYPE: ArticleType[] = ["Definite Article"];
const DEFINITE_ARTICLES = new Set(["der", "die", "das", "den", "dem", "des"]);
const INDEFINITE_ARTICLES = new Set([
  "ein",
  "eine",
  "einen",
  "einem",
  "einer",
  "eines",
]);

function getArticleType(form: string): ArticleType {
  return DEFINITE_ARTICLES.has(form)
    ? "Definite Article"
    : "Indefinite Article";
}

function getExerciseArticleForms(correctForm: string): string[] {
  if (DEFINITE_ARTICLES.has(correctForm)) {
    return Array.from(DEFINITE_ARTICLES);
  }

  if (INDEFINITE_ARTICLES.has(correctForm)) {
    return Array.from(INDEFINITE_ARTICLES);
  }

  throw new Error(`Unknown article form: ${correctForm}`);
}

const CASE_COLORS = {
  Nominativ: "#2563eb",
  Akkusativ: "#16a34a",
  Dativ: "#ca8a04",
  Genitiv: "#9333ea",
};

export default function CasePracticePage() {
  const [progress, setProgress] = useState<Progress>(() =>
    loadOrInitProgress(),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [weakMode, setWeakMode] = useState(true);
  const [enabledCases, setEnabledCases] = useState<Set<GrammaticalCase>>(
    () => new Set(DEFAULT_CASES),
  );
  const [enabledArticleType, setEnabledArticleType] = useState<
    Set<ArticleType>
  >(() => new Set(DEFAULT_ARTICLE_TYPE));
  const [exercise, setExercise] = useState<Exercise>(() => {
    const pool = CASE_EXERCISES;
    return pool[Math.floor(Math.random() * pool.length)];
  });

  function getExercisePool(): Exercise[] {
    const levels = loadLevels();

    return CASE_EXERCISES.filter((e) => {
      if (!levels.has(e.level)) return false;
      if (!enabledCases.has(e.grammaticalCase)) return false;

      const articleType = getArticleType(e.correctForm);
      if (!enabledArticleType.has(articleType)) return false;

      return true;
    });
  }

  function selectAnswer(form: string) {
    if (hasAnswered) return;

    const correct = form === exercise.correctForm;

    setSelected(form);
    setHasAnswered(true);

    setProgress((p) => {
      const nextCases = updateCaseProgress(
        p.cases,
        exercise.id,
        exercise.grammaticalCase,
        correct,
      );
      const updatedProgress = { ...p, cases: nextCases };
      saveProgress(updatedProgress);
      return updatedProgress;
    });
  }

  function exerciseWeight(stats: ExerciseStats | undefined): number {
    if (!stats || stats.attempts === 0) return 3; // unseen = high priority

    const accuracy = stats.correct / stats.attempts;
    return Math.max(0.25, 1 - accuracy) * 3;
  }

  function nextExercise(): Exercise {
    const pool = getExercisePool();

    if (!pool.length) {
      throw new Error("No case exercises available");
    }

    if (!weakMode) {
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const weighted = pool.map((ex) => ({
      exercise: ex,
      weight: exerciseWeight(progress.cases.byExercise[ex.id]),
    }));

    const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);

    let r = Math.random() * totalWeight;

    for (const { exercise, weight } of weighted) {
      r -= weight;
      if (r <= 0) return exercise;
    }

    return weighted[weighted.length - 1].exercise;
  }

  function next() {
    setHasAnswered(false);
    setExercise(nextExercise());
    setSelected(null);
  }

  const answerForms = getExerciseArticleForms(exercise.correctForm);

  useEffect(() => {
    const pool = getExercisePool();
    if (pool.length > 0) {
      setExercise(pool[Math.floor(Math.random() * pool.length)]);
      setHasAnswered(false);
      setSelected(null);
    }
  }, [enabledCases, enabledArticleType, weakMode]);

  const filledSentence = exercise.baseSentence.replace(
    "___",
    selected ?? "___",
  );

  return (
    <main style={{ maxWidth: 640, margin: "3rem auto" }}>
      <h1>Case Practice</h1>

      <ModeToggle
        label="Focus on weak cases"
        description="Practice case exercises you struggle with more often"
        checked={weakMode}
        onChange={setWeakMode}
      />

      <section style={{ marginBottom: "1.5rem" }}>
        <strong>Practice cases:</strong>
        <div style={{ display: "inline-flex" }}>
          {(
            ["Nominativ", "Akkusativ", "Dativ", "Genitiv"] as GrammaticalCase[]
          ).map((c) => (
            <ModeToggle
              key={c}
              style={{ marginLeft: "1rem" }}
              label={c}
              checked={enabledCases.has(c)}
              onChange={() => {
                const next = new Set(enabledCases);
                next.has(c) ? next.delete(c) : next.add(c);
                if (next.size > 0) setEnabledCases(next);
              }}
            />
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <strong>Article Type:</strong>
        <div style={{ display: "inline-flex" }}>
          {(["Definite Article", "Indefinite Article"] as ArticleType[]).map(
            (c) => (
              <ModeToggle
                key={c}
                style={{ marginLeft: "1rem" }}
                label={c}
                checked={enabledArticleType.has(c)}
                onChange={() => {
                  const next = new Set(enabledArticleType);
                  next.has(c) ? next.delete(c) : next.add(c);
                  if (next.size > 0) setEnabledArticleType(next);
                }}
              />
            ),
          )}
        </div>
      </section>

      <section style={{ margin: "2rem 0", fontSize: "1.3rem" }}>
        {filledSentence}
      </section>

      {hasAnswered ? (
        <section>
          <button onClick={() => next()}>Next</button>
        </section>
      ) : (
        <section>
          {answerForms.map((form) => (
            <button
              key={form}
              onClick={() => selectAnswer(form)}
              disabled={hasAnswered}
              style={{
                marginRight: "0.5rem",
                fontWeight: "bold",
              }}
            >
              {form}
            </button>
          ))}
        </section>
      )}

      {hasAnswered && (
        <section style={{ marginTop: "1.5rem" }}>
          <div>
            {selected === exercise.correctForm ? "✅ Correct" : "❌ Incorrect"}
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            Correct answer: <strong>{exercise.correctForm}</strong>
          </div>

          {hasAnswered && (
            <section style={{ marginTop: "1rem" }}>
              <div
                style={{
                  fontStyle: "italic",
                  color: CASE_COLORS[exercise.grammaticalCase],
                }}
              >
                {CASE_EXPLANATIONS[exercise.grammaticalCase]}
              </div>
            </section>
          )}

          <div style={{ marginTop: "0.5rem", color: "#555" }}>
            {exercise.english}
          </div>
        </section>
      )}
    </main>
  );
}
