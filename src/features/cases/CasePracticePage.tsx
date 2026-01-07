import { useEffect, useState } from "react";
import { CASE_EXERCISES } from "./caseExercises";
import { loadLevels } from "../../shared/level";
import ModeToggle from "../../shared/ModeToggle";
import { CASE_EXPLANATIONS } from "./caseExplanations";
import { loadOrInitProgress, saveProgress } from "../../shared/storage";
import { updateCaseProgress } from "./caseProgress";
import { Progress } from "../nounPractice/types";

type Exercise = (typeof CASE_EXERCISES)[number];
type GrammaticalCase = "Nominativ" | "Akkusativ" | "Dativ" | "Genitiv";

const DEFAULT_CASES: GrammaticalCase[] = ["Nominativ", "Akkusativ", "Dativ"];

const CASE_COLORS = {
  Nominativ: "#2563eb",
  Akkusativ: "#16a34a",
  Dativ: "#ca8a04",
  Genitiv: "#9333ea",
};

export default function CasePracticePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [weakMode, setWeakMode] = useState(true);
  const [enabledCases, setEnabledCases] = useState<Set<GrammaticalCase>>(
    () => new Set(DEFAULT_CASES)
  );
  const [exercise, setExercise] = useState<Exercise>(() => {
    const pool = CASE_EXERCISES;
    return pool[Math.floor(Math.random() * pool.length)];
  });
  const [progress, setProgress] = useState<Progress>(() =>
    loadOrInitProgress()
  );

  function getExercisePool(): Exercise[] {
    const levels = loadLevels();

    /*
    if (weakMode) {
      // weight by lowest accuracy in progress.byCase
    }
    */

    return CASE_EXERCISES.filter(
      (e) => levels.has(e.level) && enabledCases.has(e.grammaticalCase)
    );
  }

  function selectAnswer(form: string) {
    if (hasAnswered) return;
    const correct = form === exercise.correctForm;

    setSelected(form);
    setHasAnswered(true);

    setProgress((p) => {
      const next = updateCaseProgress(p, exercise.grammaticalCase, correct);
      saveProgress(next);
      return next;
    });
  }

  function nextExercise(): Exercise {
    const pool = getExercisePool();
    if (!pool.length) {
      throw new Error("No case exercises available");
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function next() {
    setHasAnswered(false);
    setExercise(nextExercise());
    setSelected(null);
  }

  useEffect(() => {
    const pool = getExercisePool();
    if (pool.length > 0) {
      setExercise(pool[Math.floor(Math.random() * pool.length)]);
      setHasAnswered(false);
      setSelected(null);
    }
  }, [enabledCases]);

  const filledSentence = exercise.baseSentence.replace(
    "___",
    selected ?? "___"
  );

  return (
    <main style={{ maxWidth: 640, margin: "3rem auto" }}>
      <h1>Akkusativ / Dativ Practice</h1>

      <ModeToggle
        label="Focus on weak cases"
        description="Practice case exercises you struggle with more often"
        checked={weakMode}
        onChange={setWeakMode}
      />

      <section style={{ marginBottom: "1.5rem" }}>
        <strong>Practice cases:</strong>

        {(
          ["Nominativ", "Akkusativ", "Dativ", "Genitiv"] as GrammaticalCase[]
        ).map((c) => (
          <label
            key={c}
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginRight: "0.75rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={enabledCases.has(c)}
              onChange={() => {
                const next = new Set(enabledCases);
                next.has(c) ? next.delete(c) : next.add(c);
                if (next.size > 0) setEnabledCases(next);
              }}
            />
            <span style={{ marginLeft: "0.25rem" }}>{c}</span>
          </label>
        ))}
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
          {["den", "dem", "der", "die", "das"].map((form) => (
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
