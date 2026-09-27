"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { checkoutUrl, money } from "@/lib/shopify";
import { useCart } from "../cart";
import { useOverlay } from "../useOverlay";

export default function Bag() {
  const { lines, subtotal, setQty, bagOpen, setBagOpen } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  useOverlay(bagOpen);

  useLayoutEffect(() => {
    if (!bagOpen || !panel.current) return;
    gsap.fromTo(panel.current, { xPercent: 105, rotate: 3 }, { xPercent: 0, rotate: 0, duration: 0.5, ease: "power4.out" });
  }, [bagOpen]);

  useEffect(() => {
    if (!bagOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBagOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bagOpen, setBagOpen]);

  if (!bagOpen) return null;

  return (
    <div className="modal modal-right" role="dialog" aria-modal aria-label="Your bag" onClick={() => setBagOpen(false)}>
      <div className="bag" ref={panel} data-scroll onClick={(e) => e.stopPropagation()}>
        <div className="bag-head">
          <h3>your bag</h3>
          <button className="x-btn" onClick={() => setBagOpen(false)} aria-label="Close">
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="bag-empty">nothing in here yet.</p>
        ) : (
          <>
            <ul className="bag-lines">
              {lines.map((l) => (
                <li key={l.variant.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${l.product.images[0]}&width=200`} alt="" />
                  <div>
                    <p className="bl-title">{l.product.title}</p>
                    {l.variant.title !== "Default Title" && <p className="bl-size">size {l.variant.title}</p>}
                    <div className="qty">
                      <button onClick={() => setQty(l.variant.id, l.qty - 1)} aria-label="One fewer">
                        −
                      </button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.variant.id, l.qty + 1)} aria-label="One more">
                        +
                      </button>
                    </div>
                  </div>
                  <p className="bl-price">{money(l.qty * Number(l.variant.price))}</p>
                </li>
              ))}
            </ul>
            <div className="bag-foot">
              <p className="bag-total">
                <span>subtotal</span>
                <span>{money(subtotal)}</span>
              </p>
              <p className="bag-fine">shipping & tax at checkout</p>
              <a
                className="add-btn"
                href={checkoutUrl(lines.map((l) => ({ variantId: l.variant.id, qty: l.qty })))}
                target="_blank"
                rel="noreferrer"
              >
                checkout →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
