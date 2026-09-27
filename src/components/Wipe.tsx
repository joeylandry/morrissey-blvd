"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { rippedHalves, tornSheet } from "@/lib/tear";

export type WipeHandle = {
  // Covers the screen, calls onCovered while hidden, then tears away.
  play: (dir: 1 | -1, title: string, onCovered: () => void) => gsap.core.Timeline;
};

// Two sheets chase each other across the screen: an orange poster sheet,
// then a cream sheet with the section name scrawled on it. The cream sheet
// rips down the middle and the orange one slides off, revealing the page.
const Wipe = forwardRef<WipeHandle>(function Wipe(_, ref) {
  const orange = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    play(dir, title, onCovered) {
      const o = orange.current!;
      const l = left.current!;
      const r = right.current!;
      const halves = rippedHalves(3.5);
      o.querySelector<HTMLElement>(".sheet")!.style.clipPath = tornSheet(3.5);
      l.querySelector<HTMLElement>(".sheet")!.style.clipPath = halves.left;
      r.querySelector<HTMLElement>(".sheet")!.style.clipPath = halves.right;
      const titles = [l, r].map((h) => h.querySelector<HTMLElement>(".wipe-title")!);
      titles.forEach((t) => (t.textContent = title));

      return gsap
        .timeline()
        .set([o, l, r], { yPercent: 105 * dir, xPercent: 0, rotate: 0, visibility: "visible" })
        .set(titles, { clipPath: "inset(0% 100% 0% 0%)" })
        .to(o, { yPercent: 0, duration: 0.5, ease: "power3.inOut" }, 0)
        .to([l, r], { yPercent: 0, duration: 0.5, ease: "power3.inOut" }, 0.1)
        .to(titles, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.32, ease: "steps(9)" }, 0.42)
        .add(onCovered, 0.6)
        // A little tug before it rips.
        .to(l, { xPercent: -0.8, rotate: -0.4, duration: 0.08, ease: "power1.inOut" }, 0.82)
        .to(r, { xPercent: 0.8, rotate: 0.4, duration: 0.08, ease: "power1.inOut" }, 0.82)
        .to(l, { xPercent: -120, yPercent: 6, rotate: -14, duration: 0.7, ease: "power3.in" }, 0.9)
        .to(r, { xPercent: 120, yPercent: -4, rotate: 11, duration: 0.7, ease: "power3.in" }, 0.9)
        .to(o, { yPercent: -105 * dir, duration: 0.55, ease: "power3.inOut" }, 1.12)
        .set([o, l, r], { visibility: "hidden" });
    },
  }));

  return (
    <div className="wipe" aria-hidden>
      <div className="wipe-layer" ref={orange}>
        <div className="sheet sheet-orange" />
      </div>
      <div className="wipe-layer" ref={left}>
        <div className="sheet sheet-cream">
          <span className="wipe-title" />
        </div>
      </div>
      <div className="wipe-layer" ref={right}>
        <div className="sheet sheet-cream">
          <span className="wipe-title" />
        </div>
      </div>
    </div>
  );
});

export default Wipe;
