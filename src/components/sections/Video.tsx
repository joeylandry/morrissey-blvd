"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { socials, videos } from "@/data/site";
import { useEntrance } from "../useEntrance";
import { Heading, Tape, type SectionProps } from "./shared";

const thumb = (id: string, size: string) => `https://i.ytimg.com/vi/${id}/${size}.jpg`;

export default function Video({ active, delay }: SectionProps) {
  const root = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const [pick, setPick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const v = videos[pick];

  if (!active && playing) setPlaying(false);

  useEntrance(active, delay, root, (tl) => {
    tl.from(".pt-char", { yPercent: 110, duration: 0.6, stagger: 0.04, ease: "back.out(2)" }, 0)
      .from(".scrawl-note", { clipPath: "inset(0% 100% 0% 0%)", duration: 0.5, ease: "steps(10)" }, 0.35)
      .from(".screen", { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "power4.inOut" }, 0.1)
      .from(".screen-img", { scale: 1.4, filter: "brightness(3)", duration: 1.2 }, 0.1)
      .from(".filmstrip", { xPercent: 60, autoAlpha: 0, duration: 1, ease: "power4.out" }, 0.3)
      .from(".frame", { y: 30, autoAlpha: 0, duration: 0.5, stagger: 0.07 }, 0.5);
  });

  // Swap the picture like a projector changing reels: flicker out, flicker in.
  const choose = (i: number) => {
    if (i === pick) return;
    const el = screen.current;
    const swap = () => {
      setPick(i);
      setPlaying(false);
    };
    if (!el) return swap();
    gsap
      .timeline()
      .to(el, { opacity: 0.2, duration: 0.05, repeat: 3, yoyo: true })
      .to(el, { opacity: 0, duration: 0.1, onComplete: swap })
      .to(el, { opacity: 1, duration: 0.3, ease: "steps(4)" });
  };

  return (
    <section ref={root} className="section video ink" data-active={active} aria-hidden={!active}>
      <div className="inner">
        <div className="row-head">
          <Heading title="Video" note="roll the tape" />
          <a className="scribble-link" href={socials[2].href} target="_blank" rel="noreferrer">
            youtube channel ↗
          </a>
        </div>

        <div className="screen-wrap">
          <Tape seed={9} className="tape-tl" />
          <Tape seed={10} className="tape-br" />
          <div className="screen" ref={screen}>
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
                title={v.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button className="screen-poster" onClick={() => setPlaying(true)} aria-label={`Play ${v.title}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="screen-img" src={thumb(v.id, "maxresdefault")} alt="" onError={(e) => (e.currentTarget.src = thumb(v.id, "hqdefault"))} />
                <span className="play-btn">
                  <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden>
                    <path d="M7 4.5c.2 5 .1 10 0 15 4.5-2.3 8.8-5 12.5-7.6C15.7 9.4 11.4 7 7 4.5Z" fill="currentColor" />
                  </svg>
                </span>
              </button>
            )}
          </div>
          <p className="screen-caption">
            <span className="screen-title">{v.title}</span>
            {v.sub && <span className="screen-sub">{v.sub}</span>}
          </p>
        </div>

        <ol className="filmstrip">
          {videos.map((item, i) => (
            <li key={item.id} className="frame">
              <button data-on={i === pick} aria-pressed={i === pick} onClick={() => choose(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(item.id, "mqdefault")} alt="" loading="lazy" />
                <span className="frame-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="frame-title">{item.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
