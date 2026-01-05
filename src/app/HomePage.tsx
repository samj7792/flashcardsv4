import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main style={{ maxWidth: 480, margin: "3rem auto" }}>
      <h1>German Practice</h1>
      <p>Select a practice mode.</p>

      <button onClick={() => navigate("/nouns")}>
        Noun Practice with Articles
      </button>
    </main>
  );
}
