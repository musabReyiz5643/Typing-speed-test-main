import { AnimatePresence, motion } from "framer-motion";
import { useTestStore } from "./features/typing-test/store/useTestStore";
import { Header } from "./shared/components/Header";
import { TypingTestScreen } from "./features/typing-test/components/TypingTestScreen";
import { ResultsRouter } from "./features/results/components/ResultsRouter";

export default function App() {
  const status = useTestStore((s) => s.status);

  return (
    <div className="min-h-screen bg-neutral-900 font-sans text-neutral-0 ">
      <div className="mx-auto min-h-screen">
        <Header />
        <AnimatePresence mode="wait">
          {status === "COMPLETED" ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full "
            >
              <ResultsRouter />
            </motion.div>
          ) : (
            <motion.div
              key="test"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl w-full mx-auto"
            >
              <TypingTestScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
