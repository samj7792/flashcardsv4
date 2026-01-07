import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import NounPracticePage from "../features/nounPractice/NounPracticePage";
import ProgressOverviewPage from "../features/progress/ProgressOverviewPage";
import ArticleDrillPage from "../features/articleDrill/ArticleDrillPage";
import CasePracticePage from "../features/cases/CasePracticePage";
import Header from "../shared/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nouns" element={<NounPracticePage />} />
        <Route path="/articles" element={<ArticleDrillPage />} />
        <Route path="/cases" element={<CasePracticePage />} />
        <Route path="/progress" element={<ProgressOverviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
