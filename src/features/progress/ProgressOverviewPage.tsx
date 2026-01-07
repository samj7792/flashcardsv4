import { useState, useEffect } from "react";
import ResetProgress from "../../shared/ResetProgress";
import { loadProgress } from "../../shared/storage";
import { initialProgress } from "../nounPractice/logic";
import { Progress } from "../nounPractice/types";

interface Row {
  noun: string;
  fullAccuracy: number | null;
  articleAccuracy: number;
  attempts: number;
}

export default function ProgressOverviewPage() {
  const [progress, setProgress] = useState<Progress>(() => {
    return loadProgress() ?? initialProgress();
  });

  if (!progress || !progress.byNoun) {
    return (
      <main style={{ maxWidth: 640, margin: "3rem auto" }}>
        <h1>Progress Overview</h1>
        <p>No progress recorded yet.</p>
      </main>
    );
  }

  const rows: Row[] = Object.entries(progress.byNoun).map(([key, stats]) => {
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
  });

  rows.sort((a, b) => a.articleAccuracy - b.articleAccuracy);

  useEffect(() => {
    function sync() {
      setProgress(loadProgress() ?? initialProgress());
    }

    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  return (
    <main style={{ maxWidth: 720, margin: "3rem auto" }}>
      <h1>Progress Overview</h1>

      <p style={{ fontSize: "0.9rem", color: "#555" }}>
        <strong>Full Accuracy</strong>: noun + article (translation practice
        only)
        <br />
        <strong>Article Accuracy</strong>: gender only (all modes)
      </p>

      <ResetProgress setProgress={setProgress} />

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
          {rows.map((row) => (
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
    </main>
  );
}
