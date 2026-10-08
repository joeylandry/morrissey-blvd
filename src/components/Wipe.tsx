"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { tornSheet } from "@/lib/tear";

export type WipeHandle = {
  // Covers the screen, calls onCovered while hidden, then tears away.
  play: (dir: 1 | -1, title: string, onCovered: () => void) => gsap.core.Timeline;
};

// One torn orange sheet sweeps over the page and off again, with the section
// name scrawled on it. Quick: about 0.7s end to end.
const Wipe = forwardRef<WipeHandle>(function Wipe(_, ref) {
  const orange = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    play(dir, title, onCovered) {
      const o = orange.current!;
      o.querySelector<HTMLElement>(".sheet")!.style.clipPath = tornSheet(3.5);
      const t = o.querySelector<HTMLElement>(".wipe-title")!;
      t.textContent = title;

      return gsap
        .timeline()
        .set(o, { yPercent: 105 * dir, visibility: "visible" })
        .set(t, { opacity: 0 })
        .to(o, { yPercent: 0, duration: 0.28, ease: "power2.out" }, 0)
        .to(t, { opacity: 1, duration: 0.1 }, 0.18)
        .add(onCovered, 0.3)
        .to(t, { opacity: 0, duration: 0.1 }, 0.42)
        .to(o, { yPercent: -105 * dir, duration: 0.3, ease: "power2.in" }, 0.42)
        .set(o, { visibility: "hidden" });
    },
  }));

  return (
    <div className="wipe" aria-hidden>
      <div className="wipe-layer" ref={orange}>
        <div className="sheet sheet-orange">
          <span className="wipe-title" />
        </div>
      </div>
    </div>
  );
});

export default Wipe;
