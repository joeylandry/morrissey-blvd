"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { rippedHalves } from "@/lib/tear";

export type IntroHandle = { play: () => gsap.core.Timeline };

// Film leader countdown, a flash of light, then the black leader rips open.
const Intro = forwardRef<IntroHandle>(function Intro(_, ref) {
  const root = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    play() {
      const el = root.current!;
      const [l, r] = el.querySelectorAll<HTMLElement>(".intro-half");
      const nums = el.querySelectorAll<HTMLElement>(".leader-num");
      const leader = el.querySelector<HTMLElement>(".leader")!;
      const flash = el.querySelector<HTMLElement>(".intro-flash")!;
      const halves = rippedHalves(3);
      l.style.clipPath = halves.left;
      r.style.clipPath = halves.right;

      const tl = gsap.timeline();
      tl.set(nums, { autoAlpha: 0 });
      nums.forEach((n, i) => {
        tl.set(n, { autoAlpha: 1 }, i * 0.42).set(n, { autoAlpha: 0 }, i * 0.42 + 0.4);
      });
      tl.fromTo(
        el.querySelector(".leader-sweep"),
        { rotate: 0 },
        { rotate: 360 * nums.length, duration: 0.42 * nums.length, ease: "none" },
        0,
      )
        .to(flash, { opacity: 0.9, duration: 0.06 }, ">-0.05")
        .set(leader, { autoAlpha: 0 })
        .to(flash, { opacity: 0, duration: 0.3 })
        .to(l, { xPercent: -120, rotate: -12, yPercent: 5, duration: 0.8, ease: "power3.in" }, "<-0.1")
        .to(r, { xPercent: 120, rotate: 10, yPercent: -4, duration: 0.8, ease: "power3.in" }, "<")
        .set(el, { autoAlpha: 0 });
      return tl;
    },
  }));

  return (
    <div className="intro" ref={root} aria-hidden>
      <div className="intro-half" />
      <div className="intro-half" />
      <div className="leader">
        <div className="leader-ring" />
        <div className="leader-sweep" />
        <div className="leader-cross" />
        {["3", "2", "1"].map((n) => (
          <span key={n} className="leader-num">
            {n}
          </span>
        ))}
      </div>
      <div className="intro-flash" />
    </div>
  );
});

export default Intro;
