import { useTestStore } from "../store/useTestStore";
import { Character, type CharState } from "./Character";

export function TextDisplay() {
  const targetText = useTestStore((s) => s.targetText);
  const typedCharacters = useTestStore((s) => s.typedCharacters);

  if (!targetText) {
    return (
      <div className="flex min-h-32 items-center justify-center">
        <span className="text-neutral-500">Loading...</span>
      </div>
    );
  }

  const cursorIndex = typedCharacters.length;

  return (
    <div className="text-3xl leading-relaxed tracking-wide sm:text-4xl px-6 ">
      {targetText.split("").map((char, i) => {
        let state: CharState;
        if (i < typedCharacters.length) {
          state = typedCharacters[i] === char ? "correct" : "incorrect";
        } else if (i === cursorIndex) {
          state = "active";
        } else {
          state = "untyped";
        }
        return <Character key={i} char={char} state={state} />;
      })}
    </div>
  );
}
