interface ModeToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export default function ModeToggle({
  label,
  checked,
  onChange,
  description,
}: ModeToggleProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.6rem 0.75rem",
        marginBottom: "1rem",
        border: "1px solid #ddd",
        borderRadius: 6,
        background: checked ? "#f0f8ff" : "#fafafa",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 2 }}
      />

      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        {description && (
          <div style={{ fontSize: "0.85rem", color: "#555" }}>
            {description}
          </div>
        )}
      </div>
    </label>
  );
}
