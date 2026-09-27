import { useEffect, useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Plays a section's entrance each time it becomes active. Everything runs in
// a gsap.context scoped to the section, so leaving reverts all inline styles.
export function useEntrance(
  active: boolean,
  delay: number,
  scope: RefObject<HTMLElement | null>,
  build: (tl: gsap.core.Timeline) => void,
) {
  useIsoLayoutEffect(() => {
    if (!active || !scope.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      build(gsap.timeline({ delay, defaults: { ease: "power3.out" } }));
    }, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
