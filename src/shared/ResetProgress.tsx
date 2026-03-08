import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { resetProgress } from "./storage";
import { Progress } from "./progressTypes";

export default function ResetProgress({
  // setProgress,
  progress,
}: {
  setProgress: Dispatch<SetStateAction<Progress>>;
  progress: Progress;
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    // setProgress(fresh);
  }

  const isEmpty =
    Object.keys(progress.nouns.byNoun || {}).length === 0 &&
    Object.keys(progress.cases.byCase || {}).length === 0;
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
