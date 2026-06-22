import { useTestStore } from "../store/useTestStore";
import { formatTime } from "../../../shared/lib/format";

interface StatItemProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function StatItem({ label, value, valueClassName }: StatItemProps) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 sm:flex-none sm:flex-row sm:items-baseline sm:gap-2">
      <span className="text-xm lg:text-lg text-neutral-400">{label}:</span>
      <span className={`text-2xl font-bold sm:text-lg ${valueClassName ?? "text-neutral-0"}`}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-9 w-px shrink-0 bg-neutral-800 sm:h-6" />;
}

interface StatsBarProps {
  accuracyActive?: boolean;
  timeActive?: boolean;
}

export function StatsBar({ accuracyActive, timeActive }: StatsBarProps) {
  const wpm = useTestStore((s) => s.wpm);
  const accuracy = useTestStore((s) => s.accuracy);
  const time = useTestStore((s) => s.time);

  return (
    <div className="flex w-full items-center justify-between sm:justify-start sm:gap-6 ">
      <StatItem label="WPM" value={String(wpm)} />
      <Divider />
      <StatItem
        label="Accuracy"
        value={`${accuracy}%`}
        valueClassName={accuracyActive ? "text-red-500" : "text-neutral-0"}
      />
      <Divider />
      <StatItem
        label="Time"
        value={formatTime(time)}
        valueClassName={timeActive ? "text-yellow-400" : "text-neutral-0"}
      />
    </div>
  );
}
