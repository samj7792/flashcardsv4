import { useState, useEffect } from "react";
import ResetProgress from "../../shared/ResetProgress";
import { loadOrInitProgress } from "../../shared/storage";
import { Progress } from "../nounPractice/types";
import { NOUNS } from "../nounPractice/nounData";
import CollapsibleSection from "../../shared/CollapsibleSection";

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
const nounById = new Map(NOUNS.map((n) => [n.id, n]));

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

  if (
    Object.keys(progress.byNoun).length == 0 &&
    Object.keys(progress.byCase).length == 0
  ) {
    return (
      <main style={{ maxWidth: 640, margin: "3rem auto" }}>
        <h1>Progress Overview</h1>
        <p>No progress recorded yet.</p>
      </main>
    );
  }

  const nounRows: Row[] = Object.entries(progress.byNoun)
    .map(([id, stats]) => {
      const noun = nounById.get(id);
      if (!noun) return null;

      const fullAccuracy =
        stats.attempts === 0
          ? null
          : Math.round((stats.correct / stats.attempts) * 100);

      const articleAccuracy =
        stats.articleAttempts === 0
          ? 0
          : Math.round((stats.articleCorrect / stats.articleAttempts) * 100);

      return {
        noun: `${noun.glosses.join(" / ")} → ${noun.article} ${noun.german}`,
        fullAccuracy,
        articleAccuracy,
        attempts: stats.attempts,
      };
    })
    .filter(Boolean) as Row[];

  const nounLevelMap = new Map<string, string>();
  NOUNS.forEach((n) => {
    nounLevelMap.set(n.id, n.level);
  });

  nounRows.sort((a, b) =>
    a.fullAccuracy !== null && b.fullAccuracy !== null
      ? a.fullAccuracy - b.fullAccuracy
      : a.articleAccuracy - b.articleAccuracy
  );

  const nounRowsByLevel: Record<string, Row[]> = {
    A1: [],
    A2: [],
    B1: [],
    B2: [],
  };

  Object.entries(progress.byNoun).forEach(([id, stats]) => {
    const noun = nounById.get(id);
    if (!noun) return null;
    const level = nounLevelMap.get(id);

    if (!level) return;

    const fullAccuracy =
      stats.attempts === 0
        ? null
        : Math.round((stats.correct / stats.attempts) * 100);

    const articleAccuracy =
      stats.articleAttempts === 0
        ? 0
        : Math.round((stats.articleCorrect / stats.articleAttempts) * 100);

    nounRowsByLevel[level].push({
      noun: `${noun.glosses.join(" / ")} → ${noun.article} ${noun.german}`,
      fullAccuracy,
      articleAccuracy,
      attempts: stats.attempts,
    });
  });

  Object.values(nounRowsByLevel).forEach((rows) =>
    rows.sort((a, b) =>
      a.fullAccuracy !== null && b.fullAccuracy !== null
        ? a.fullAccuracy - b.fullAccuracy
        : a.articleAccuracy - b.articleAccuracy
    )
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

      {Object.entries(nounRowsByLevel).map(([level, rows]) =>
        rows.length > 0 ? (
          <CollapsibleSection
            key={level}
            title={`Nouns — ${level}`}
            detail={`(Overall accuracy: ${(
              rows
                .map((row) => {
                  if (row.fullAccuracy != null) return row.fullAccuracy;
                  else return 0;
                })
                .reduce((a, c) => a + c, 0) / rows.length
            ).toFixed(1)}%)`}
          >
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
          </CollapsibleSection>
        ) : null
      )}

      {caseRows.length > 0 && (
        <CollapsibleSection
          title={`Cases`}
          detail={`(Overall Accuracy: ${(
            caseRows
              .map((row) => {
                if (row.accuracy != null) return row.accuracy;
                else return 0;
              })
              .reduce((a, c) => a + c, 0) / caseRows.length
          ).toFixed(1)}%)`}
        >
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
              {CASE_ORDER.filter((c) => caseRows.some((r) => r.case === c)).map(
                (c) => {
                  const row = caseRows.find((r) => r.case === c)!;
                  return (
                    <tr key={row.case}>
                      <td>{row.case}</td>
                      <td align="right">{row.correct}</td>
                      <td align="right">{row.attempts}</td>
                      <td align="right">{row.accuracy}%</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CollapsibleSection>
      )}
    </main>
  );
}
