import { memo } from "react";

export type CharState = "correct" | "incorrect" | "active" | "untyped";

interface CharacterProps {
  char: string;
  state: CharState;
}

const stateClass: Record<CharState, string> = {
  correct: "text-green-500",
  incorrect: "text-red-500 underline decoration-red-500 ",
  active: "text-neutral-0 bg-white/20 rounded-sm ",
  untyped: "text-neutral-400 ",
};

export const Character = memo(function Character({
  char,
  state,
}: CharacterProps) {
  return (
    <span
      className={`${stateClass[state]} transition-colors duration-200 ease-in-out`}
    >
      {char}
    </span>
  );
});
