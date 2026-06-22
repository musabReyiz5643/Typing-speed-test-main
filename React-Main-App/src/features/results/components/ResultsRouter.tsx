import { useTestStore } from "../../typing-test/store/useTestStore";
import { FirstResult } from "./FirstResult";
import { HighScore } from "./HighScore";
import { TestCompleted } from "./TestCompleted";

export function ResultsRouter() {
  const resultType = useTestStore((s) => s.resultType);

  if (resultType === "FIRST") return <FirstResult />;
  if (resultType === "HIGHSCORE") return <HighScore />;
  return <TestCompleted />;
}
