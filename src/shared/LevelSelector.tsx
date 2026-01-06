import { Level } from "../features/nounPractice/types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2"];

interface Props {
  value: Set<Level>;
  onChange: (levels: Set<Level>) => void;
}

export default function LevelSelector({ value, onChange }: Props) {
  function toggle(level: Level) {
    const next = new Set(value);

    if (next.has(level)) {
      next.delete(level);
    } else {
      next.add(level);
    }

    if (next.size === 0) return; // prevent empty selection
    onChange(next);
  }

  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <p>
        <strong>Practice levels:</strong>
      </p>

      {LEVELS.map((level) => (
        <label
          key={level}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            marginRight: "0.75rem",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={value.has(level)}
            onChange={() => toggle(level)}
          />
          {level}
        </label>
      ))}
    </section>
  );
}
