"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

export type WipeHandle = {
  // Covers the screen, calls onCovered while hidden, then tears away.
  play: (dir: 1 | -1, onCovered: () => void) => gsap.core.Timeline;
};

// Two flat sheets, blue then navy, chase each other up (or down) the screen
// like a page being pulled past.
const Wipe = forwardRef<WipeHandle>(function Wipe(_, ref) {
  const blue = useRef<HTMLDivElement>(null);
  const navy = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    play(dir, onCovered) {
      const b = blue.current!;
      const n = navy.current!;

      return gsap
        .timeline()
        .set([b, n], { yPercent: 100 * dir, visibility: "visible" })
        .to(b, { yPercent: 0, duration: 0.34, ease: "power3.inOut" }, 0)
        .to(n, { yPercent: 0, duration: 0.34, ease: "power3.inOut" }, 0.09)
        .add(onCovered, 0.45)
        .to(b, { yPercent: -100 * dir, duration: 0.34, ease: "power3.inOut" }, 0.5)
        .to(n, { yPercent: -100 * dir, duration: 0.34, ease: "power3.inOut" }, 0.59)
        .set([b, n], { visibility: "hidden" });
    },
  }));

  return (
    <div className="wipe" aria-hidden>
      <div className="wipe-layer" ref={navy}>
        <div className="sheet sheet-navy" />
      </div>
      <div className="wipe-layer" ref={blue}>
        <div className="sheet sheet-blue" />
      </div>
    </div>
  );
});

export default Wipe;
