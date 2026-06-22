import { useEffect, useRef, useState } from "react";
import { iconDownArrow } from "../../assets";

interface Option {
  value: string;
  label: string;
}

interface MobileDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

export function MobileDropdown({
  options,
  value,
  onChange,
  label,
  disabled,
}: MobileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex-1 ">
      <button
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-label={label}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border border-neutral-800 px-4 py-2.5 text-sm font-semibold text-neutral-0 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-neutral-700"
        }`}
      >
        <span>{current?.label}</span>
        <img
          src={iconDownArrow}
          alt=""
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && !disabled && (
        <div className="absolute left-0 top-full z-10 mt-2 w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-neutral-800 focus:outline-none ${
                opt.value === value
                  ? "font-semibold text-blue-400"
                  : "text-neutral-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
