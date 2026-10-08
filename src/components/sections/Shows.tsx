"use client";

import Image from "next/image";
import { useRef } from "react";
import { shows, tourPoster, type Show } from "@/data/site";
import { useEntrance } from "../useEntrance";
import { dateParts, useToday } from "../dates";
import { Heading, Stamp, Tape, type SectionProps } from "./shared";

function Stub({ show, past, i }: { show: Show; past: boolean; i: number }) {
  const d = dateParts(show.date);
  const tilt = ((i * 37) % 5) - 2; // -2..2deg, stable per row
  return (
    <li className="stub" data-past={past} style={{ "--tilt": `${tilt * 0.35}deg` } as React.CSSProperties}>
      <div className="stub-date">
        <span className="stub-month">{d.month}</span>
        <span className="stub-day">{d.day}</span>
        <span className="stub-weekday">{d.weekday}</span>
      </div>
      <div className="stub-body">
        <p className="stub-city">{show.city}</p>
        {show.venue && <p className="stub-venue">{show.venue}</p>}
        {show.address && <p className="stub-addr">{show.address}</p>}
        {show.with && <p className="stub-with">w/ {show.with}</p>}
      </div>
      <div className="stub-action">
        {past ? (
          <Stamp>played</Stamp>
        ) : show.tickets ? (
          <a className="stub-tix" href={show.tickets} target="_blank" rel="noreferrer">
            tickets
          </a>
        ) : (
          <span className="stub-soon">info soon</span>
        )}
      </div>
    </li>
  );
}

export default function Shows({ active, delay }: SectionProps) {
  const root = useRef<HTMLElement>(null);
  const today = useToday();
  const upcoming = today ? shows.filter((s) => s.date >= today) : shows;

  useEntrance(active, delay, root, (tl) => {
    tl.from(".pt-char", { yPercent: 110, rotate: () => gsapRand(-12, 12), duration: 0.6, stagger: 0.04, ease: "back.out(2)" }, 0)
      .from(".scrawl-note", { clipPath: "inset(0% 100% 0% 0%)", duration: 0.5, ease: "steps(10)" }, 0.35)
      .from(".pinned", { y: -140, rotate: -18, autoAlpha: 0, duration: 0.9, ease: "back.out(1.4)" }, 0.1)
      .from(".pinned .tape", { scaleX: 0, duration: 0.3, stagger: 0.1 }, 0.75)
      .from(".stub:not([data-past=true])", { x: 160, rotate: 6, autoAlpha: 0, duration: 0.7, stagger: 0.09, ease: "power4.out" }, 0.2)
      .from(".stub:not([data-past=true]) .stub-tix", { scale: 0, rotate: -30, duration: 0.4, stagger: 0.09, ease: "back.out(2.5)" }, 0.55);
  });

  return (
    <section ref={root} className="section shows paper" data-active={active} aria-hidden={!active}>
      <div className="inner shows-grid">
        <div className="shows-side">
          <Heading title="Shows" note="fall '26 tour" />
          <figure className="pinned">
            <Tape seed={1} className="tape-tl" />
            <Tape seed={2} className="tape-tr" />
            <Image src={tourPoster} alt="Hand-drawn Fall 2026 tour poster" width={552} height={688} sizes="(max-width: 900px) 70vw, 28vw" />
          </figure>
        </div>

        <div className="shows-list">
          {upcoming.length ? (
            <ol>
              {upcoming.map((s, i) => (
                <Stub key={s.date} show={s} past={false} i={i} />
              ))}
            </ol>
          ) : (
            <p className="empty">new dates soon</p>
          )}
        </div>
      </div>
    </section>
  );
}

const gsapRand = (a: number, b: number) => a + Math.random() * (b - a);
