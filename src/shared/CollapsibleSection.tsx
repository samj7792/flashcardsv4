import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  detail?: string;
}

export default function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
  detail,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        style={{
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          // justifyContent: "space-between",
          padding: "0.5rem 0",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2 style={{ margin: 0, marginRight: "1rem" }}>{title}</h2>
        {detail}
        <span
          style={{
            display: "flex",
            flex: "auto",
            justifyContent: "flex-end",
            fontSize: "0.9rem",
            color: "#555",
          }}
        >
          {open ? "▾" : "▸"}
        </span>
      </div>

      {open && <div style={{ marginTop: "0.75rem" }}>{children}</div>}
    </section>
  );
}
