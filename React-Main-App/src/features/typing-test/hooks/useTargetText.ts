import { useEffect } from "react";
import { useTestStore } from "../store/useTestStore";
import { usePassages } from "./usePassages";

export function useTargetText() {
  const status = useTestStore((s) => s.status);
  const difficulty = useTestStore((s) => s.difficulty);
  const setTargetText = useTestStore((s) => s.setTargetText);
  const { data: passages, isError } = usePassages();

  useEffect(() => {
    if (!passages || status !== "NOT_STARTED") return;
    const pool = passages[difficulty.toLowerCase() as "easy" | "medium" | "hard"];
    if (!pool?.length) return;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setTargetText(random.text);
  }, [passages, difficulty, status, setTargetText]);

  return { isError };
}
