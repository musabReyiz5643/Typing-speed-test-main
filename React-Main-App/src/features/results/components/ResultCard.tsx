import { type ReactNode } from "react";
import { useTestStore } from "../../typing-test/store/useTestStore";
import { useShallow } from "zustand/shallow";
import { countCorrect } from "../../../shared/lib/metrics";

interface StatProps {
  label: string;
  value: ReactNode;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="flex flex-col gap-2 w-full rounded-xl border border-neutral-800 bg-neutral-900 z-10 px-6 py-5">
      <span className="text-lg text-neutral-400">{label}:</span>
      <span className="text-3xl font-bold text-neutral-0">{value}</span>
    </div>
  );
}

export function ResultCard() {
  const { wpm, accuracy, status } = useTestStore(
    useShallow((state) => ({
      wpm: state.wpm,
      accuracy: state.accuracy,
      status: state.status,
    })),
  );

  const typedCharacters = useTestStore((s) => s.typedCharacters);
  const targetText = useTestStore((s) => s.targetText);

  const correct = countCorrect(typedCharacters, targetText);
  const incorrect = typedCharacters.length - correct;

  return (
    <div className="flex w-full max-w-xl items-center justify-center flex-col gap-3 sm:flex-row sm:gap-4 ">
      <Stat label="WPM" value={<span className="text-neutral-0">{wpm}</span>} />
      <Stat
        label="Accuracy"
        value={
          <span
            key={`${status}-${accuracy}`}
            className={accuracy === 100 ? "text-neutral-0" : "text-red-500"}
          >
            {accuracy}%
          </span>
        }
      />
      <Stat
        label="Characters"
        value={
          <>
            <span className="text-green-500">{correct}</span>
            <span className="text-neutral-400">/</span>
            <span className="text-red-500">{incorrect}</span>
          </>
        }
      />
    </div>
  );
}
