"use client";

import { useEffect, useRef, useState } from "react";
import { sectionIndex, shows } from "@/data/site";
import { useEntrance } from "../useEntrance";
import { shortDate, useToday } from "../dates";
import type { SectionProps } from "./shared";

export default function Home({ active, delay, goTo }: SectionProps) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const today = useToday();
  const next = today ? shows.find((s) => s.date >= today) : undefined;

  // Start the clip over whenever you come back to the stage.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else v.pause();
  }, [active]);

  useEntrance(active, delay, root, (tl) => {
    tl.fromTo(".hero-video", { scale: 1.3, filter: "brightness(2.2) blur(6px)" }, { scale: 1.02, filter: "brightness(1) blur(0px)", duration: 1.8 }, 0)
      .from(".hero-word", { yPercent: 120, rotate: (i) => (i ? 6 : -6), duration: 0.9, stagger: 0.12, ease: "back.out(1.6)" }, 0.15)
      .from(".hero-tag", { autoAlpha: 0, x: -20, duration: 0.6 }, 0.6)
      .from(".sticker", { scale: 2.6, rotate: 40, autoAlpha: 0, duration: 0.45, ease: "back.out(2.2)" }, 0.85)
      .from(".hero-ui", { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.08 }, 1);
  });

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section ref={root} className="section home" data-active={active} aria-hidden={!active}>
      <div className="hero-media">
        <video
          ref={video}
          className="hero-video"
          src="/hero.mp4"
          poster="/img/hero-poster.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="hero-leak" />
        <div className="hero-shade" />
      </div>

      <div className="hero-copy">
        <p className="hero-tag">New Bedford, MA</p>
        <h1 className="hero-mark boil">
          <span className="hero-line">
            <span className="hero-word">Morrissey</span>
          </span>
          <span className="hero-line">
            <span className="hero-word">Blvd</span>
          </span>
        </h1>
      </div>

      {next && (
        <a
          className="sticker"
          href={next.tickets ?? `#shows`}
          target={next.tickets ? "_blank" : undefined}
          rel="noreferrer"
          onClick={(e) => {
            if (next.tickets) return;
            e.preventDefault();
            goTo(sectionIndex("shows"));
          }}
        >
          <span className="sticker-top">next show</span>
          <span className="sticker-date">{shortDate(next.date)}</span>
          <span className="sticker-city">{next.city}</span>
          <span className="sticker-cta">{next.tickets ? "get tix →" : "see dates →"}</span>
        </a>
      )}

      <button className="hero-ui sound" onClick={toggle} aria-pressed={!muted}>
        <span className="sound-bars" data-on={!muted}>
          <i />
          <i />
          <i />
        </span>
        {muted ? "sound off" : "sound on"}
      </button>

      <button className="hero-ui cue" onClick={() => goTo(1)} aria-label="Next section">
        <span>scroll</span>
        <svg viewBox="0 0 24 48" width="20" height="40" aria-hidden>
          <path d="M12 2c-1 10 1 22 0 40M4 32c3 4 6 7 8 12 2-5 5-8 8-12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
