import { useEffect } from "react";
import { useTestStore } from "../store/useTestStore";
import { TIMED_DURATION } from "../constants";

export function useTypingEngine() {
  const status = useTestStore((s) => s.status);
  const accuracy = useTestStore((s) => s.accuracy);
  const time = useTestStore((s) => s.time);
  const mode = useTestStore((s) => s.mode);

  const accuracyChanged = status === "STARTED" && accuracy !== 100;
  const timeChanged = status === "STARTED" && time !== (mode === "TIMED" ? TIMED_DURATION : 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const {
        status: currentStatus,
        targetText,
        start,
        appendChar,
        backspace,
        updateMetrics,
      } = useTestStore.getState();

      if (currentStatus === "COMPLETED") return;
      if (e.isComposing || e.keyCode === 229) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!targetText) return;

      const isPrintable = e.key.length === 1;
      const isBackspace = e.key === "Backspace";
      if (!isPrintable && !isBackspace) return;

      if (e.key === " ") e.preventDefault();

      if (currentStatus === "NOT_STARTED") start();

      if (isBackspace) {
        backspace();
      } else {
        appendChar(e.key);
      }

      updateMetrics();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status]);

  return { accuracyChanged, timeChanged };
}
