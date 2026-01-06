import { useEffect, useState } from "react";
import { NOUNS } from "../nounPractice/nounData";
import { getRandomNoun, updateProgress } from "../nounPractice/logic";
import { Article, Noun, Progress } from "../nounPractice/types";
import { selectWeakArticleNoun } from "../nounPractice/weakSelection";
import { loadProgress, saveProgress } from "../../shared/storage";
import { loadLevel } from "../../shared/level";
import ModeToggle from "../../shared/ModeToggle";

const ARTICLES: Article[] = ["der", "die", "das"];

export default function ArticleDrillPage() {
  const [weakMode, setWeakMode] = useState(true);

  const [noun, setNoun] = useState<Noun>(() => nextNoun());
  const [selected, setSelected] = useState<Article | null>(null);
  const [progress, setProgress] = useState<Progress>(() => {
    return loadProgress()!;
  });

  function nextNoun() {
    const level = loadLevel();
    const pool = NOUNS.filter((n) => n.level === level);

    if (weakMode) {
      const progress = loadProgress();
      if (progress) {
        return selectWeakArticleNoun(pool, progress);
      }
    }

    return getRandomNoun(pool);
  }

  function submit(article: Article) {
    const correct = article === noun.article;
    setProgress((p) =>
      updateProgress(
        p,
        noun,
        {
          correctArticle: correct,
          correctTranslation: false,
          isCorrect: false,
        },
        "ARTICLE_ONLY"
      )
    );

    setSelected(article);

    setTimeout(() => {
      setSelected(null);
      setNoun(nextNoun());
    }, 400);
  }

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "1") submit("der");
      if (e.key === "2") submit("die");
      if (e.key === "3") submit("das");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [noun]);

  return (
    <main style={{ maxWidth: 480, margin: "3rem auto" }}>
      <h1>Article Speed Drill</h1>
      <p>Select the correct article.</p>

      <ModeToggle
        label="Focus on weak nouns"
        description="Practice nouns you struggle with more often"
        checked={weakMode}
        onChange={setWeakMode}
      />

      <p style={{ fontSize: "1.5rem", margin: "2rem 0" }}>
        <strong>{noun.german}</strong>
      </p>

      <section>
        {ARTICLES.map((article, i) => {
          const isCorrect = selected && article === noun.article;
          const isWrong = selected === article && !isCorrect;

          return (
            <button
              key={article}
              onClick={() => submit(article)}
              style={{
                marginRight: "0.5rem",
                fontWeight: "bold",
                background: isCorrect
                  ? "#d1fae5"
                  : isWrong
                  ? "#fee2e2"
                  : undefined,
              }}
            >
              {article} <small>({i + 1})</small>
            </button>
          );
        })}
      </section>
    </main>
  );
}
