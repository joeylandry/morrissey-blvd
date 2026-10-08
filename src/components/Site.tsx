"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sections } from "@/data/site";
import type { Product } from "@/lib/shopify";
import { CartProvider } from "./cart";
import Chrome from "./Chrome";
import Intro, { type IntroHandle } from "./Intro";
import Wipe, { type WipeHandle } from "./Wipe";
import Bag from "./store/Bag";
import Home from "./sections/Home";
import Shows from "./sections/Shows";
import Music from "./sections/Music";
import Video from "./sections/Video";
import Photos from "./sections/Photos";
import Store from "./sections/Store";
import About from "./sections/About";

const WHEEL_THRESHOLD = 30;
const WHEEL_EDGE = 140; // extra push needed to leave a page that has its own scroll
const SWIPE_EDGE = 120;
const GESTURE_GAP = 200; // ms of wheel silence that starts a new gesture
const SWIPE_MIN = 50;
const ENTER_AFTER_WIPE = 0.12;
const ENTER_AFTER_INTRO = 1.45;

// Can an inner scroller under `target` still move in `dir`?
function canScroll(target: EventTarget | null, dir: number) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body) {
    if (el instanceof HTMLElement && el.hasAttribute("data-scroll")) {
      const max = el.scrollHeight - el.clientHeight;
      if (max > 2) return dir > 0 ? el.scrollTop < max - 2 : el.scrollTop > 2;
    }
    el = el.parentElement;
  }
  return false;
}

// Is there any inner scroller under `target` at all (at an edge or not)?
function hasScroller(target: EventTarget | null) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body) {
    if (el instanceof HTMLElement && el.hasAttribute("data-scroll") && el.scrollHeight - el.clientHeight > 2) return true;
    el = el.parentElement;
  }
  return false;
}

const overlayOpen = () => document.body.dataset.overlay === "1";

function indexFromHash() {
  const i = sections.findIndex((s) => s.id === window.location.hash.slice(1));
  return Math.max(0, i);
}

export default function Site({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [delay, setDelay] = useState(ENTER_AFTER_INTRO);
  const activeRef = useRef(0);
  const busy = useRef(true); // held until the intro finishes
  const wipe = useRef<WipeHandle>(null);
  const intro = useRef<IntroHandle>(null);

  const land = useCallback((i: number, enterDelay: number) => {
    activeRef.current = i;
    setDelay(enterDelay);
    setActive(i);
    setVisited((v) => (v.has(i) ? v : new Set(v).add(i)));
    window.history.replaceState(null, "", i === 0 ? window.location.pathname : `#${sections[i].id}`);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const from = activeRef.current;
      if (busy.current || next === from || next < 0 || next >= sections.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return land(next, 0);
      busy.current = true;
      wipe.current!
        .play(next > from ? 1 : -1, () => land(next, ENTER_AFTER_WIPE))
        .eventCallback("onComplete", () => {
          busy.current = false;
        });
    },
    [land],
  );

  // First paint: honour the hash, then roll the intro.
  useEffect(() => {
    const start = indexFromHash();
    if (start !== 0) land(start, ENTER_AFTER_INTRO);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelector<HTMLElement>(".intro")?.style.setProperty("display", "none");
      busy.current = false;
      setDelay(0);
      return;
    }
    const tl = intro.current!.play();
    tl.eventCallback("onComplete", () => {
      busy.current = false;
    });
    return () => void tl.kill();
  }, [land]);

  // Pages never scroll: shrink any page whose content is taller than the screen.
  useEffect(() => {
    const fit = () =>
      document.querySelectorAll<HTMLElement>(".section .inner").forEach((el) => {
        el.style.zoom = "1";
        const over = el.scrollHeight / el.clientHeight;
        if (over > 1.01) el.style.zoom = String(Math.max(0.5, 1 / over));
      });
    const t = window.setTimeout(fit, 100);
    window.addEventListener("resize", fit);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", fit);
    };
  }, [active, products]);

  // Wheel, touch, keyboard and hash navigation.
  useEffect(() => {
    let acc = 0;
    let last = 0;
    let settle = false;

    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const gap = now - last;
      last = now;
      if (overlayOpen() || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const dir = Math.sign(e.deltaY);
      if (!dir) return;
      if (canScroll(e.target, dir)) {
        acc = 0;
        settle = true;
        return;
      }
      e.preventDefault();
      if (busy.current) {
        acc = 0;
        settle = true;
        return;
      }
      // Swallow trackpad momentum left over from the last gesture.
      if (settle) {
        if (gap < GESTURE_GAP) return;
        settle = false;
      }
      if (gap > GESTURE_GAP) acc = 0;
      acc += e.deltaY;
      // Pages with their own scrolling need a deliberate extra push at the edge.
      if (Math.abs(acc) >= (hasScroller(e.target) ? WHEEL_EDGE : WHEEL_THRESHOLD)) {
        acc = 0;
        settle = true;
        goTo(activeRef.current + dir);
      }
    };

    let sx = 0;
    let sy = 0;
    let ignore = false;
    let room = { up: false, down: false };
    let edge = false;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.target instanceof Element ? e.target : document.body;
      ignore = overlayOpen() || !!t.closest("[data-noswipe]");
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      room = { down: canScroll(t, 1), up: canScroll(t, -1) };
      edge = hasScroller(t);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (ignore || overlayOpen()) return;
      const dir = Math.sign(sy - e.touches[0].clientY);
      if (!canScroll(e.target, dir) && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (ignore) return;
      const dy = sy - e.changedTouches[0].clientY;
      const dx = sx - e.changedTouches[0].clientX;
      if (Math.abs(dy) < (edge ? SWIPE_EDGE : SWIPE_MIN) || Math.abs(dx) > Math.abs(dy)) return;
      const dir = Math.sign(dy);
      if (dir > 0 ? room.down : room.up) return;
      goTo(activeRef.current + dir);
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target instanceof Element ? e.target : document.body;
      if (overlayOpen() || t.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "Home") return goTo(0);
      if (e.key === "End") return goTo(sections.length - 1);
      const dir =
        e.key === "ArrowDown" || e.key === "PageDown" ? 1 : e.key === "ArrowUp" || e.key === "PageUp" ? -1 : 0;
      if (!dir || canScroll(t, dir)) return;
      e.preventDefault();
      goTo(activeRef.current + dir);
    };

    const onHash = () => goTo(indexFromHash());

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [goTo]);

  const p = (i: number) => ({ active: active === i, visited: visited.has(i), delay, goTo });

  return (
    <CartProvider>
      <main className="stage">
        <Home {...p(0)} />
        <Shows {...p(1)} />
        <Music {...p(2)} />
        <Video {...p(3)} />
        <Photos {...p(4)} />
        <Store {...p(5)} products={products} />
        <About {...p(6)} />
      </main>

      <Chrome active={active} goTo={goTo} />
      <Bag />
      <Wipe ref={wipe} />
      <Intro ref={intro} />
      <div className="grain" aria-hidden />
      <Filters />
    </CartProvider>
  );
}

// "Line boil": three slightly different wobble filters cycled in CSS so hand
// lettering jitters like a hand-drawn animation.
function Filters() {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      {[1, 2, 3].map((n) => (
        <filter key={n} id={`boil-${n}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={n * 7} />
          <feDisplacementMap in="SourceGraphic" scale="3.2" />
        </filter>
      ))}
      <filter id="rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
      </filter>
    </svg>
  );
}
