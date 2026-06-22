import { motion } from "framer-motion";
import { useTestStore } from "../store/useTestStore";

export function StartOverlay() {
  const status = useTestStore((s) => s.status);
  const start = useTestStore((s) => s.start);
  const targetText = useTestStore((s) => s.targetText);

  if (status !== "NOT_STARTED") return null;

  const ready = !!targetText;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4  bg-neutral-900/70 backdrop-blur-[2px] ">
      <motion.button
        onClick={ready ? start : undefined}
        disabled={!ready}
        whileHover={{ scale: ready ? 1.05 : 1 }}
        whileTap={{ scale: ready ? 0.97 : 1 }}
        className={`rounded-xl px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
          ready
            ? "bg-blue-600 hover:bg-blue-400"
            : "bg-blue-600/40 cursor-not-allowed"
        }`}
      >
        Start Typing Test
      </motion.button>
      <p className="text-base font-bold text-neutral-0">
        Or click the text and start typing
      </p>
    </div>
  );
}
