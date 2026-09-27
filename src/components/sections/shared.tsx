import { tapeClip } from "@/lib/tear";

export type SectionProps = {
  active: boolean;
  visited: boolean;
  delay: number;
  goTo: (i: number) => void;
};

export function Tape({ seed, className = "" }: { seed: number; className?: string }) {
  return <span className={`tape ${className}`} style={{ clipPath: tapeClip(seed) }} aria-hidden />;
}

// Big poster headline with a hand-scrawled note tucked under it.
export function Heading({ title, note }: { title: string; note?: string }) {
  return (
    <header className="heading">
      <h2 className="poster-title">
        {title.split("").map((c, i) => (
          <span key={i} className="pt-char">
            {c}
          </span>
        ))}
      </h2>
      {note && <p className="scrawl-note boil">{note}</p>}
    </header>
  );
}

// Sticker-style stamp. `tone` picks the ink.
export function Stamp({ children, tone = "red" }: { children: React.ReactNode; tone?: "red" | "blue" | "ink" }) {
  return <span className={`stamp stamp-${tone}`}>{children}</span>;
}
