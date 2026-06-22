import { useTestStore } from "../../features/typing-test/store/useTestStore";
import { logoSmall, iconPersonalBest } from "../../assets";

export function Header() {
  const bestWPM = useTestStore((s) => s.bestWPM);

  return (
    <header className="flex items-center justify-between py-6  max-w-7xl px-6 mx-auto">
      <div className="flex items-center gap-3">
        <img
          src={logoSmall}
          alt="Typing Speed Test"
          className="h-8 w-8 shrink-0"
        />
        <div className="hidden flex-col sm:flex">
          <h1 className="text-lg md:text-xl font-bold leading-tight text-neutral-0 ">
            Typing Speed Test
          </h1>
          <p className="text-sm leading-tight text-neutral-400">
            Type as fast as you can in 60 seconds
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <img src={iconPersonalBest} alt="" className="h-5 w-5" />
        <span>
          <span className="hidden sm:inline text-lg">Personal best:</span>
          <span className="sm:hidden text-lg">Best: </span>{" "}
          <span className="font-normal text-neutral-0 text-base">
            {bestWPM} WPM
          </span>
        </span>
      </div>
    </header>
  );
}
