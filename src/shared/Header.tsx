import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <header
      style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "2rem",
      }}
    >
      <button onClick={() => navigate(isHome ? "/" : "/")}>
        {isHome ? "Home" : "← Back"}
      </button>
    </header>
  );
}
