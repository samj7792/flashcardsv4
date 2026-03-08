import { useEffect, useRef, useState } from "react";
import { VERBS } from "./verbData";
import { Verb, Form } from "./types";
import { randomForm, isCorrectConjugation, updateVerbProgress } from "./logic";
import { verbWeight } from "./weighting";
import { loadOrInitProgress, saveProgress } from "../../shared/storage";
import ModeToggle from "../../shared/ModeToggle";
import { loadLevels } from "../../shared/level";
import { Progress } from "../../shared/progressTypes";

export default function VerbPracticePage() {
  const [progress, setProgress] = useState<Progress>(() =>
    loadOrInitProgress(),
  );

  const [weakMode, setWeakMode] = useState(true);
  const [verb, setVerb] = useState<Verb | null>(null);
  const [form, setForm] = useState<Form>("ich");

  const [answer, setAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  function getVerbPool(): Verb[] {
    const levels = loadLevels();
    return VERBS.filter((v) => levels.has(v.level));
  }

  function nextVerb(): Verb {
    const pool = getVerbPool();

    if (!pool.length) {
      throw new Error("No verbs available for selected levels");
    }

    if (!weakMode) {
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const weighted = pool.map((v) => ({
      verb: v,
      weight: verbWeight(progress.verbs.byVerb[v.id]),
    }));

    const total = weighted.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * total;

    for (const { verb, weight } of weighted) {
      r -= weight;
      if (r <= 0) return verb;
    }

    return weighted[weighted.length - 1].verb;
  }

  function next() {
    setVerb(nextVerb());
    setForm(randomForm());
    setAnswer("");
    setHasAnswered(false);
    setCorrect(false);

    setTimeout(() => inputRef.current?.focus());
  }

  function submit() {
    if (!verb || hasAnswered) return;

    const ok = isCorrectConjugation(verb, form, answer);

    setHasAnswered(true);
    setCorrect(ok);

    setProgress((p) => ({
      ...p,
      verbs: updateVerbProgress(p.verbs, verb, form, ok),
    }));
  }

  function renderPrompt() {
    if (!verb) return null;

    const example = verb.examples?.[0];

    if (example?.german) {
      return <div>{example.german}</div>;
    }

    return (
      <div>
        <strong>{form}</strong> ___
      </div>
    );
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        hasAnswered ? next() : submit();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    next();

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasAnswered]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [verb]);

  if (!verb) {
    return <div>Loading verb…</div>;
  }

  const correctAnswer = verb.conjugations.praesens?.[form];

  return (
    <main style={{ maxWidth: 520, margin: "3rem auto" }}>
      <h1>Verb Practice - Präsens</h1>

      <ModeToggle
        label="Focus on weak verbs"
        checked={weakMode}
        onChange={setWeakMode}
        description="Practice verbs you struggle with more often"
      />

      <section style={{ fontSize: "1.5rem", margin: "2rem 0" }}>
        {renderPrompt()}

        <div style={{ marginTop: "0.5rem", color: "#555" }}>
          ({verb.german})
        </div>
      </section>

      {!hasAnswered ? (
        <section>
          <input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ fontSize: "1.1rem", padding: "0.4rem" }}
          />

          <button onClick={submit} style={{ marginTop: "1rem" }}>
            Submit
          </button>
        </section>
      ) : (
        <section>
          <div style={{ marginBottom: "0.5rem" }}>
            {correct ? "✅ Correct" : "❌ Incorrect"}
          </div>

          {!correct && (
            <div>
              Correct answer: <strong>{correctAnswer}</strong>
            </div>
          )}

          <button onClick={next} style={{ marginTop: "1rem" }}>
            Next
          </button>
        </section>
      )}
    </main>
  );
}
