import { transcriptDemo } from "@/content/syntheticData";

const BARS = 36;
/** Fixed bar heights so the waveform is identical on server and client. */
const heights = Array.from(
  { length: BARS },
  (_, i) =>
    20 + Math.round(Math.abs(Math.sin(i * 1.3) * Math.cos(i * 0.45)) * 80),
);

/** Decorative: a waveform that "becomes" timestamped transcript lines. */
export function WhisperDemo() {
  return (
    <div aria-hidden="true" className="bg-bg flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="label text-muted">session.wav → transcript</span>
        <span className="label text-muted">simulated</span>
      </div>
      <div className="flex h-14 items-center gap-[3px]">
        {heights.map((height, i) => (
          <span
            key={i}
            className="wave-bar bg-signal w-full rounded-full"
            style={{ height: `${height}%`, "--i": i } as React.CSSProperties}
          />
        ))}
      </div>
      <ul className="font-mono text-xs leading-6">
        {transcriptDemo.map((line, i) => (
          <li
            key={line.time}
            className="transcript-line flex gap-3 truncate"
            style={{ "--i": i } as React.CSSProperties}
          >
            <span className="text-muted tabular-nums">{line.time}</span>
            <span className={line.text.startsWith("<") ? "text-warn" : ""}>
              {line.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
