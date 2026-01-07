import { Progress } from "../features/nounPractice/types";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { initialProgress } from "../features/nounPractice/logic";
import { saveProgress } from "./storage";

export default function ResetProgress({
  setProgress,
  progress,
}: {
  setProgress: Dispatch<SetStateAction<Progress>>;
  progress: Progress;
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

  const isEmpty = Object.keys(progress.byNoun).length == 0;
  useEffect(() => {
    if (isEmpty) setConfirmReset(false);
  }, [isEmpty]);

  return (
    <>
      {/* <p>
        Progress: {progress.correct} / {progress.total}
      </p> */}

      <button
        onClick={resetProgress}
        disabled={isEmpty}
        style={{
          marginTop: "1rem",
          opacity: isEmpty ? 0.5 : 1,
          cursor: isEmpty ? "not-allowed" : "pointer",
        }}
      >
        {isEmpty
          ? "Progress already empty"
          : confirmReset
          ? "Click again to confirm"
          : "Reset Progress"}
      </button>
    </>
  );
}
