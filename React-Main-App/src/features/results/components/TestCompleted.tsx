import { motion } from "framer-motion";
import { useTestStore } from "../../typing-test/store/useTestStore";
import { ResultCard } from "./ResultCard";
import {
  patternStar1,
  patternStar2,
  iconCompleted,
  iconRestart,
} from "../../../assets";

export function TestCompleted() {
  const reset = useTestStore((s) => s.reset);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center gap-8 py-8 px-6 max-w-7xl mx-auto"
    >
      <img
        src={patternStar1}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-16 right-2 sm:right-0 h-8 w-8 opacity-80 sm:w-10 sm:h-10 md:w-15 md:h-15 "
      />
      <img
        src={patternStar2}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-2 sm:left-0 top-16  h-8 w-8 sm:w-10 sm:h-10 md:w-15 md:h-15 opacity-90"
      />

      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-23 w-23 items-center justify-center rounded-full bg-green-500/20">
          <div className="flex h-18 w-18 items-center justify-center rounded-full bg-green-500/50">
            <img src={iconCompleted} alt="" className="h-12 w-12" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-bold text-neutral-0 sm:text-4xl">
            Test Complete!
          </h1>
          <p className="max-w-md text-neutral-400">
            Solid run. Keep pushing to beat your high score.
          </p>
        </div>
      </div>

      <ResultCard />

      <motion.button
        onClick={reset}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 rounded-xl bg-neutral-0 px-8 py-3 font-bold text-neutral-900 transition-colors hover:bg-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-0 focus:ring-offset-2 focus:ring-offset-neutral-900"
      >
        Go Again
        <img src={iconRestart} alt="" className="h-4 w-4 invert" />
      </motion.button>
    </motion.div>
  );
}
