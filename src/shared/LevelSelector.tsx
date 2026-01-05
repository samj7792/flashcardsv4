import { Level } from "../features/nounPractice/types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2"];

interface Props {
  value: Level;
  onChange: (level: Level) => void;
}

export default function LevelSelector({ value, onChange }: Props) {
  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <p>
        <strong>Level:</strong>
      </p>
      {LEVELS.map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          style={{
            marginRight: "0.5rem",
            fontWeight: value === level ? "bold" : "normal",
          }}
        >
          {level}
        </button>
      ))}
    </section>
  );
}
