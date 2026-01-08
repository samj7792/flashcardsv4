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
  function toggle() {
    onChange(!checked);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  return (
    <div
      role="button"
      aria-pressed={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={onKeyDown}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.6rem 0.75rem",
        marginBottom: "1rem",
        border: "1px solid #ddd",
        borderRadius: 6,
        background: checked ? "#f0f8ff" : "#fafafa",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        {description && (
          <div style={{ fontSize: "0.85rem", color: "#555" }}>
            {description}
          </div>
        )}
      </div>

      {/* Visual indicator */}
      {/* <div
        aria-hidden
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? "#2563eb" : "#ccc",
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 2,
            left: checked ? 18 : 2,
            transition: "left 0.2s",
          }}
        />
      </div> */}
    </div>
  );
}
