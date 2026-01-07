import { Progress } from "../features/nounPractice/types";
import { useState, Dispatch, SetStateAction } from "react";
import { initialProgress } from "../features/nounPractice/logic";
import { saveProgress } from "./storage";

export default function ResetProgress({
  setProgress,
}: {
  setProgress: Dispatch<SetStateAction<Progress>>;
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  function resetProgress() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    const fresh = initialProgress();
    setProgress(fresh);
    saveProgress(fresh);
    setConfirmReset(false);
  }

  return (
    <>
      {/* <p>
        Progress: {progress.correct} / {progress.total}
      </p> */}

      <button onClick={resetProgress} style={{ marginTop: "0.5rem" }}>
        {confirmReset ? "Click again to confirm reset" : "Reset Progress"}
      </button>
    </>
  );
}
