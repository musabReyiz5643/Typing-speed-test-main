import { motion } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  label,
  disabled,
}: SegmentedControlProps) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-sm text-neutral-400">{label}:</span>}
      <div className="flex gap-3 ">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => !disabled && onChange(opt.value)}
              disabled={disabled}
              whileHover={{ scale: active || disabled ? 1 : 1.04 }}
              whileTap={{ scale: disabled ? 1 : 0.97 }}
              className={`rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                disabled
                  ? "opacity-50 cursor-not-allowed border-neutral-800 text-neutral-400"
                  : active
                  ? "border-blue-600 text-blue-400"
                  : "border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-0"
              }`}
            >
              {opt.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
