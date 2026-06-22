import { useTestStore } from "../store/useTestStore";
import { useTimer } from "../hooks/useTimer";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { useTargetText } from "../hooks/useTargetText";
import { SegmentedControl } from "../../../shared/components/SegmentedControl";
import { MobileDropdown } from "../../../shared/components/MobileDropdown";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { StatsBar } from "./StatsBar";
import { TextDisplay } from "./TextDisplay";
import { StartOverlay } from "./StartOverlay";
import { RestartButton } from "./RestartButton";
import { DIFFICULTY_OPTIONS, MODE_OPTIONS } from "../constants";

export function TypingTestScreen() {
  const status = useTestStore((s) => s.status);
  const mode = useTestStore((s) => s.mode);
  const difficulty = useTestStore((s) => s.difficulty);
  const setMode = useTestStore((s) => s.setMode);
  const setDifficulty = useTestStore((s) => s.setDifficulty);

  const isDesktop = useMediaQuery("(min-width: 640px)");

  useTimer();
  const { isError } = useTargetText();
  const { accuracyChanged, timeChanged } = useTypingEngine();

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex flex-col gap-5 border-b border-neutral-800 pb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0 px-6 ">
        <StatsBar accuracyActive={accuracyChanged} timeActive={timeChanged} />
        <div className="flex w-full h-full items-center gap-3  sm:gap-4 ">
          {isDesktop ? (
            <>
              <SegmentedControl
                label="Difficulty"
                options={DIFFICULTY_OPTIONS}
                value={difficulty}
                onChange={(v) => setDifficulty(v as typeof difficulty)}
                disabled={status === "STARTED"}
              />
              <div className="h-6 w-px bg-neutral-800" />
              <SegmentedControl
                label="Mode"
                options={MODE_OPTIONS}
                value={mode}
                onChange={(v) => setMode(v as typeof mode)}
                disabled={status === "STARTED"}
              />
            </>
          ) : (
            <div className="flex w-full gap-3">
              <MobileDropdown
                options={DIFFICULTY_OPTIONS}
                value={difficulty}
                onChange={(v) => setDifficulty(v as typeof difficulty)}
                label="Difficulty"
                disabled={status === "STARTED"}
              />
              <MobileDropdown
                options={MODE_OPTIONS}
                value={mode}
                onChange={(v) => setMode(v as typeof mode)}
                label="Mode"
                disabled={status === "STARTED"}
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        {isError ? (
          <p className="py-8 text-center text-red-500">
            Failed to load passages. Please refresh.
          </p>
        ) : (
          <>
            <TextDisplay />
            <StartOverlay />
          </>
        )}
      </div>

      {status === "STARTED" && (
        <div className="flex flex-col items-center gap-6 border-t border-neutral-800 pt-6 px-6">
          <RestartButton />
        </div>
      )}
    </div>
  );
}
