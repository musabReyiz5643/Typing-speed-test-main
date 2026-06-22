import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTestStore } from "../../typing-test/store/useTestStore";
import { ResultCard } from "./ResultCard";
import { patternConfetti, iconNewPb, iconRestart } from "../../../assets";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";

export function HighScore() {
  const reset = useTestStore((s) => s.reset);
  const commitBestWPM = useTestStore((s) => s.commitBestWPM);

  useEffect(() => {
    commitBestWPM();
  }, [commitBestWPM]);

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex w-full min-h-[calc(100vh-6rem)] flex-col items-center gap-8 pb-15 sm:pb-0 sm:pt-20 px-6  mx-auto overflow-hidden"
    >
      <img
        src={patternConfetti}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 md:-bottom-30 left-1/2 w-[200%] md:w-[150%] lg:w-full max-w-none -translate-x-1/2  opacity-90 "
      />

      <div className="flex flex-col items-center gap-6 ">
        <img src={iconNewPb} alt="" className="h-16 w-16" />

        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-bold text-neutral-0 sm:text-4xl">
            High Score Smashed!
          </h1>
          <p className="max-w-md text-sm sm:text-base text-neutral-400">
            You're getting faster. That was incredible typing.
          </p>
        </div>
      </div>

      <ResultCard />

      <motion.button
        onClick={reset}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 z-10 rounded-xl bg-neutral-0 px-8 py-3 font-bold text-neutral-900 transition-colors hover:bg-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-0 focus:ring-offset-2 focus:ring-offset-neutral-900"
      >
        {isMobile ? "Go Again" : "Beat This Score"}
        <img src={iconRestart} alt="" className="h-4 w-4 invert" />
      </motion.button>
    </motion.div>
  );
}
