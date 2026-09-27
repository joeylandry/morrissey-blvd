"use client";

import { useRef, useState } from "react";
import { shopDomain } from "@/data/site";
import { money, type Product } from "@/lib/shopify";
import { useEntrance } from "../useEntrance";
import ProductSheet from "../store/ProductSheet";
import { Heading, Stamp, Tape, type SectionProps } from "./shared";

const fromPrice = (p: Product) => Math.min(...p.variants.map((v) => Number(v.price)));
const soldOut = (p: Product) => p.variants.every((v) => !v.available);

export default function Store({ active, delay, products }: SectionProps & { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Product | null>(null);

  useEntrance(active, delay, root, (tl) => {
    tl.from(".pt-char", { yPercent: 110, duration: 0.6, stagger: 0.04, ease: "back.out(2)" }, 0)
      .from(".scrawl-note", { clipPath: "inset(0% 100% 0% 0%)", duration: 0.5, ease: "steps(10)" }, 0.35)
      .from(".tag", { y: -window.innerHeight, rotate: (i) => (i % 2 ? 25 : -25), duration: 1, stagger: 0.12, ease: "bounce.out" }, 0.1)
      .from(".tag .stamp", { scale: 3, autoAlpha: 0, duration: 0.3, ease: "power4.in" }, 1);
  });

  return (
    <section ref={root} className="section store paper" data-active={active} aria-hidden={!active}>
      <div className="inner" data-scroll>
        <div className="row-head">
          <Heading title="Store" note="the merch table" />
          <p className="store-note">secure checkout through Shopify</p>
        </div>

        {products.length ? (
          <ul className="tags">
            {products.map((p, i) => (
              <li key={p.id}>
                <button className="tag" onClick={() => setOpen(p)} data-sold={soldOut(p)}>
                  <Tape seed={i + 40} className="tape-top" />
                  <span className="tag-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${p.images[0]}&width=700`} alt={p.title} loading="lazy" />
                  </span>
                  <span className="tag-title">{p.title}</span>
                  <span className="tag-price">{money(fromPrice(p))}</span>
                  {soldOut(p) && <Stamp>sold out</Stamp>}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">
            the store is taking a nap.{" "}
            <a href={`https://${shopDomain}`} target="_blank" rel="noreferrer">
              try the shop directly ↗
            </a>
          </p>
        )}
      </div>

      <ProductSheet product={open} onClose={() => setOpen(null)} />
    </section>
  );
}
