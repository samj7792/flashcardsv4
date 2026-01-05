import { loadProgress } from "../../shared/storage";
import { Progress } from "../nounPractice/types";

interface Row {
  noun: string;
  correct: number;
  attempts: number;
  accuracy: number;
}

export default function ProgressOverviewPage() {
  const progress = loadProgress() as Progress | null;

  if (!progress || !progress.byNoun) {
    return (
      <main style={{ maxWidth: 640, margin: "3rem auto" }}>
        <h1>Progress</h1>
        <p>No progress recorded yet.</p>
      </main>
    );
  }

  const rows = Object.entries(progress.byNoun).map(([key, stats]) => {
    const [english, german] = key.split("|");

    const accuracy =
      stats.attempts === 0
        ? 0
        : Math.round((stats.correct / stats.attempts) * 100);

    const articleAccuracy =
      stats.articleAttempts === 0
        ? 0
        : Math.round((stats.articleCorrect / stats.articleAttempts) * 100);

    return {
      noun: `${english} → ${german}`,
      correct: stats.correct,
      attempts: stats.attempts,
      accuracy,
      articleAccuracy,
    };
  });

  rows.sort((a, b) => a.accuracy - b.accuracy);

  return (
    <main style={{ maxWidth: 640, margin: "3rem auto" }}>
      <h1>Progress Overview</h1>

      <table width="100%" cellPadding={8}>
        <thead>
          <tr>
            <th align="left">Noun</th>
            <th align="right">Correct</th>
            <th align="right">Attempts</th>
            <th align="right">Accuracy</th>
            <th align="right">Article</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.noun}>
              <td>{row.noun}</td>
              <td align="right">{row.correct}</td>
              <td align="right">{row.attempts}</td>
              <td align="right">{row.accuracy}%</td>
              <td align="right">{row.articleAccuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
