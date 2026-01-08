import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LevelSelector from "../shared/LevelSelector";
import { loadLevels, saveLevels } from "../shared/level";
import { Level } from "../features/nounPractice/types";

export default function HomePage() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Set<Level>>(() => loadLevels());

  function changeLevels(next: Set<Level>) {
    setLevels(next);
    saveLevels(next);
  }

  return (
    <main style={{ maxWidth: 480, margin: "3rem auto" }}>
      <h1>German Practice</h1>

      <LevelSelector value={levels} onChange={changeLevels} />

      <button onClick={() => navigate("/nouns")}>Noun Practice</button>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/articles")}>
          Article Speed Drill
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/cases")}>Grammar Cases</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/progress")}>View Progress</button>
      </div>
    </main>
  );
}
