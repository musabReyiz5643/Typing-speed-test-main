import { motion } from "framer-motion";
import { useTestStore } from "../store/useTestStore";
import { iconRestart } from "../../../assets/index";

export function RestartButton() {
  const reset = useTestStore((s) => s.reset);

  return (
    <motion.button
      onClick={reset}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-3 font-medium text-neutral-0 transition-colors hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900 mb-10"
    >
      Restart Test
      <img src={iconRestart} alt="" className="h-4 w-4 " />
    </motion.button>
  );
}
