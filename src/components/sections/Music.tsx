"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { releases, socials } from "@/data/site";
import { useEntrance } from "../useEntrance";
import { Heading, Tape, type SectionProps } from "./shared";

export default function Music({ active, visited, delay }: SectionProps) {
  const root = useRef<HTMLElement>(null);
  const [pick, setPick] = useState(0);

  useEntrance(active, delay, root, (tl) => {
    tl.from(".pt-char", { yPercent: 110, duration: 0.6, stagger: 0.04, ease: "back.out(2)" }, 0)
      .from(".scrawl-note", { clipPath: "inset(0% 100% 0% 0%)", duration: 0.5, ease: "steps(10)" }, 0.35)
      .from(".record", {
        y: () => window.innerHeight * 0.8,
        x: (i) => (i - 1) * 120,
        rotate: (i) => [-35, 20, 40][i % 3],
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
      }, 0.1)
      .from(".disc", { xPercent: -45, rotate: -240, duration: 1.1, stagger: 0.12, ease: "power3.out" }, 0.6)
      .from(".player-strip", { y: 60, rotate: -3, autoAlpha: 0, duration: 0.7 }, 0.7);
  });

  return (
    <section ref={root} className="section music orange-paper" data-active={active} aria-hidden={!active}>
      <div className="inner" data-scroll>
        <div className="row-head">
          <Heading title="Music" note="put it on repeat" />
          <a className="scribble-link" href={socials[1].href} target="_blank" rel="noreferrer">
            all of it on spotify ↗
          </a>
        </div>

        <ul className="records">
          {releases.map((r, i) => (
            <li key={r.title}>
              <button className="record" data-on={pick === i} aria-pressed={pick === i} onClick={() => setPick(i)}>
                <span className="record-art">
                  <span className="disc" aria-hidden>
                    <span className="disc-label" style={{ backgroundImage: `url(${r.cover})` }} />
                  </span>
                  <span className="sleeve">
                    <Image src={r.cover} alt={`${r.title} cover`} fill sizes="(max-width: 900px) 60vw, 22vw" />
                  </span>
                </span>
                <span className="record-title">{r.title}</span>
                <span className="record-hint">{pick === i ? "spinning ♪" : "play me"}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="player-strip">
          <Tape seed={5} className="tape-tl" />
          <Tape seed={6} className="tape-tr" />
          {visited && (
            <iframe
              key={releases[pick].embed}
              title={`${releases[pick].title} on Spotify`}
              src={`${releases[pick].embed}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          )}
        </div>
      </div>
    </section>
  );
}
