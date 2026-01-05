import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import NounPracticePage from "../features/nounPractice/NounPracticePage";
import ProgressOverviewPage from "../features/progress/ProgressOverviewPage";
import Header from "../shared/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nouns" element={<NounPracticePage />} />
        <Route path="/progress" element={<ProgressOverviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
