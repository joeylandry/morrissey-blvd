"use client";

import Image from "next/image";
import { useRef } from "react";
import { artwork, bio, socials } from "@/data/site";
import { useEntrance } from "../useEntrance";
import { Heading, Tape, type SectionProps } from "./shared";

export default function About({ active, delay, goTo }: SectionProps) {
  const root = useRef<HTMLElement>(null);

  useEntrance(active, delay, root, (tl) => {
    tl.from(".pt-char", { yPercent: 110, duration: 0.6, stagger: 0.04, ease: "back.out(2)" }, 0)
      .from(".scrawl-note", { clipPath: "inset(0% 100% 0% 0%)", duration: 0.5, ease: "steps(10)" }, 0.35)
      .from(".letter", { y: 80, rotate: -6, autoAlpha: 0, duration: 0.8 }, 0.15)
      .from(".letter p", { clipPath: "inset(0% 100% 0% 0%)", duration: 0.9, stagger: 0.25, ease: "steps(24)" }, 0.5)
      .from(".art", { scale: 0.6, rotate: 20, autoAlpha: 0, duration: 0.9, ease: "back.out(1.5)" }, 0.3)
      .from(".social-scrawl li", { x: -40, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 0.9);
  });

  return (
    <section ref={root} className="section about orange-paper" data-active={active} aria-hidden={!active}>
      <div className="inner about-grid" data-scroll>
        <div>
          <Heading title="About" note="three brothers, one van" />
          <article className="letter">
            <Tape seed={70} className="tape-tl" />
            {bio.map((para) => (
              <p key={para}>{para}</p>
            ))}
            <p className="letter-sign">for booking, slide into our DMs on Instagram.</p>
          </article>
        </div>

        <div className="about-side">
          <figure className="art">
            <Tape seed={71} className="tape-top" />
            <Image src={artwork} alt="Watercolor of a red sun setting behind trees over water" width={631} height={631} sizes="(max-width: 900px) 70vw, 28vw" />
          </figure>
          <ul className="social-scrawl">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer" className="boil">
                  {s.name} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="foot">
          <span>© {new Date().getFullYear()} Morrissey Blvd · New Bedford, MA</span>
          <button onClick={() => goTo(0)}>back to the top ↑</button>
        </footer>
      </div>
    </section>
  );
}
