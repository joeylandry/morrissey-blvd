"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { photos } from "@/data/site";
import { useEntrance } from "../useEntrance";
import { useOverlay } from "../useOverlay";
import { Heading, Tape, type SectionProps } from "./shared";

if (typeof window !== "undefined") gsap.registerPlugin(Draggable, InertiaPlugin);

// Stable scatter: a loose grid with jitter so prints overlap but don't stack.
const rand = (n: number) => {
  const s = Math.sin(n * 91.7) * 43758.5;
  return s - Math.floor(s);
};
const cols = 4;
const layout = photos.map((_, i) => {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const rows = Math.ceil(photos.length / cols);
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return {
    left: r1(4 + (col / cols) * 78 + rand(i + 1) * 8),
    top: r1(4 + (row / rows) * 66 + rand(i + 50) * 10),
    rot: r1((rand(i + 99) - 0.5) * 22),
  };
});

export default function Photos({ active, delay }: SectionProps) {
  const root = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  useOverlay(open !== null);

  useEntrance(active, delay, root, (tl) => {
    tl.from(".pt-char", { yPercent: 110, duration: 0.6, stagger: 0.04, ease: "back.out(2)" }, 0)
      .from(".scrawl-note", { clipPath: "inset(0% 100% 0% 0%)", duration: 0.5, ease: "steps(10)" }, 0.35)
      .from(".print", {
        y: () => window.innerHeight * (0.9 + Math.random() * 0.4),
        x: () => (Math.random() - 0.5) * 400,
        rotate: () => (Math.random() - 0.5) * 120,
        duration: 0.9,
        stagger: { each: 0.07, from: "random" },
        ease: "power3.out",
      }, 0.1);
  });

  // Prints can be picked up and thrown around the table.
  useEffect(() => {
    if (!active || !board.current) return;
    let z = 10;
    const drags = Draggable.create(board.current.querySelectorAll(".print"), {
      bounds: board.current,
      inertia: true,
      edgeResistance: 0.8,
      zIndexBoost: false,
      onPress() {
        gsap.set(this.target, { zIndex: ++z });
        gsap.to(this.target, { scale: 1.06, duration: 0.2 });
      },
      onRelease() {
        gsap.to(this.target, { scale: 1, duration: 0.3 });
      },
      onClick() {
        setOpen(Number((this.target as HTMLElement).dataset.i));
      },
    });
    return () => drags.forEach((d) => d.kill());
  }, [active]);

  const step = (d: number) => setOpen((o) => (o === null ? o : (o + d + photos.length) % photos.length));

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section ref={root} className="section photos ink" data-active={active} aria-hidden={!active}>
      <div className="inner photos-inner">
        <Heading title="Photos" note="grab one, toss it around" />
        <div className="table" ref={board} data-noswipe>
          {photos.map((p, i) => (
            <figure
              key={p.src}
              className="print"
              data-i={i}
              style={{ left: `${layout[i].left}%`, top: `${layout[i].top}%`, rotate: `${layout[i].rot}deg` }}
            >
              <Tape seed={i + 20} className="tape-top" />
              <span className="print-img">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 900px) 40vw, 16vw" draggable={false} />
              </span>
              <figcaption>{p.caption ?? ""}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {open !== null &&
        createPortal(
        <div className="lightbox" role="dialog" aria-modal aria-label={photos[open].alt} onClick={() => setOpen(null)}>
          <figure className="lightbox-print" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-img">
              <Image src={photos[open].src} alt={photos[open].alt} fill sizes="90vw" />
            </span>
            <figcaption>{photos[open].caption ?? photos[open].alt}</figcaption>
          </figure>
          <button className="lb-btn lb-prev" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous photo">
            ←
          </button>
          <button className="lb-btn lb-next" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next photo">
            →
          </button>
          <button className="lb-btn lb-close" onClick={() => setOpen(null)} aria-label="Close">
            ✕
          </button>
        </div>,
        document.body,
      )}
    </section>
  );
}
