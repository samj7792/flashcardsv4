import { useState, useEffect } from "react";
import ResetProgress from "../../shared/ResetProgress";
import { loadOrInitProgress } from "../../shared/storage";
import { Progress } from "../nounPractice/types";

interface Row {
  noun: string;
  fullAccuracy: number | null;
  articleAccuracy: number;
  attempts: number;
}
interface CaseRow {
  case: string;
  correct: number;
  attempts: number;
  accuracy: number;
}
const CASE_ORDER = ["Nominativ", "Akkusativ", "Dativ", "Genitiv"];

export default function ProgressOverviewPage() {
  const [progress, setProgress] = useState<Progress>(() =>
    loadOrInitProgress()
  );

  useEffect(() => {
    function sync() {
      setProgress(loadOrInitProgress());
    }

    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  // this needs to be updated, not working as intended
  if (!progress || !progress.byNoun) {
    return (
      <main style={{ maxWidth: 640, margin: "3rem auto" }}>
        <h1>Progress Overview</h1>
        <p>No progress recorded yet.</p>
      </main>
    );
  }

  const nounRows: Row[] = Object.entries(progress.byNoun).map(
    ([key, stats]) => {
      const [english, german, article] = key.split("|");

      const fullAccuracy =
        stats.attempts === 0
          ? null
          : Math.round((stats.correct / stats.attempts) * 100);

      const articleAccuracy =
        stats.articleAttempts === 0
          ? 0
          : Math.round((stats.articleCorrect / stats.articleAttempts) * 100);

      return {
        noun: `${english} → ${article} ${german}`,
        fullAccuracy,
        articleAccuracy,
        attempts: stats.attempts,
      };
    }
  );

  nounRows.sort((a, b) =>
    a.fullAccuracy !== null && b.fullAccuracy !== null
      ? a.fullAccuracy - b.fullAccuracy
      : a.articleAccuracy - b.articleAccuracy
  );

  const caseRows: CaseRow[] = Object.entries(progress.byCase ?? {}).map(
    ([grammaticalCase, stats]) => {
      const accuracy =
        stats.attempts === 0
          ? 0
          : Math.round((stats.correct / stats.attempts) * 100);

      return {
        case: grammaticalCase,
        correct: stats.correct,
        attempts: stats.attempts,
        accuracy,
      };
    }
  );

  caseRows.sort((a, b) => a.accuracy - b.accuracy);

  return (
    <main style={{ maxWidth: 720, margin: "3rem auto" }}>
      <h1>Progress Overview</h1>

      <p style={{ fontSize: "0.9rem", color: "#555" }}>
        <strong>Full Accuracy</strong>: noun + article (translation practice
        only)
        <br />
        <strong>Article Accuracy</strong>: gender only (all modes)
      </p>

      <ResetProgress progress={progress} setProgress={setProgress} />

      {nounRows.length > 0 && (
        <section>
          <h2>Noun Accuracy</h2>
          <table width="100%" cellPadding={8}>
            <thead>
              <tr>
                <th align="left">Noun</th>
                <th align="right">Full Accuracy</th>
                <th align="right">Article Accuracy</th>
                <th align="right">Full Attempts</th>
              </tr>
            </thead>
            <tbody>
              {nounRows.map((row) => (
                <tr key={row.noun}>
                  <td>{row.noun}</td>
                  <td align="right">
                    {row.fullAccuracy === null ? "—" : `${row.fullAccuracy}%`}
                  </td>
                  <td align="right">{row.articleAccuracy}%</td>
                  <td align="right">{row.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {caseRows.length > 0 && (
        <section>
          <h2>Case Accuracy</h2>

          <table width="100%" cellPadding={8}>
            <thead>
              <tr>
                <th align="left">Case</th>
                <th align="right">Correct</th>
                <th align="right">Attempts</th>
                <th align="right">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {caseRows.map((row) => (
                <tr key={row.case}>
                  <td>{row.case}</td>
                  <td align="right">{row.correct}</td>
                  <td align="right">{row.attempts}</td>
                  <td align="right">{row.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
