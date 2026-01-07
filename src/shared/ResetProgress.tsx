import { Progress } from "../features/nounPractice/types";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { resetProgress } from "./storage";

export default function ResetProgress({
  setProgress,
  progress,
}: {
  setProgress: Dispatch<SetStateAction<Progress>>;
  progress: Progress;
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  function handleReset() {
    const fresh = resetProgress();
    setProgress(fresh);
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
        onClick={handleReset}
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
