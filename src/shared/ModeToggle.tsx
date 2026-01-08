import { useState } from "react";

interface ModeToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  style?: React.CSSProperties;
}

export default function ModeToggle({
  label,
  checked,
  onChange,
  description,
  style,
}: ModeToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);

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
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      style={{
        position: "relative",
        // display: "flex",
        // alignItems: "center",
        // justifyContent: "space-between",
        // gap: "0.75rem",
        padding: "0.6rem 0.75rem",
        marginBottom: "1rem",
        border: "1px solid #ddd",
        borderRadius: 6,
        background:
          showTooltip && !checked
            ? "#f0eaeaff"
            : showTooltip
            ? "#8ce2c1ff"
            : checked
            ? "#cef2e4ff"
            : "#fafafa",
        boxShadow: showTooltip ? "0 4px 12px rgba(0,0,0,0.15)" : "",
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
    >
      <div style={{ fontWeight: 600 }}>{label}</div>

      {description && showTooltip && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 6,
            padding: "0.4rem 0.6rem",
            background: "#111",
            color: "#fff",
            fontSize: "0.75rem",
            borderRadius: 4,
            maxWidth: 260,
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
