"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { money, type Product, type Variant } from "@/lib/shopify";
import { tornSheet } from "@/lib/tear";
import { useCart } from "../cart";
import { useOverlay } from "../useOverlay";

// A torn sheet of paper that slides up with the product on it.
export default function ProductSheet({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add, setBagOpen } = useCart();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState<Variant | null>(null);
  const [added, setAdded] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  useOverlay(!!product);

  useEffect(() => {
    setImg(0);
    setSize(product?.variants.find((v) => v.available) ?? null);
    setAdded(false);
  }, [product]);

  useLayoutEffect(() => {
    if (!product || !sheet.current) return;
    sheet.current.style.clipPath = tornSheet(1.2);
    gsap.fromTo(sheet.current, { yPercent: 100, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 0.55, ease: "power4.out" });
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  if (!product) return null;
  const single = product.variants.length === 1;

  return createPortal(
    <div className="modal" role="dialog" aria-modal aria-label={product.title} onClick={onClose}>
      <div className="product-sheet" ref={sheet} data-scroll onClick={(e) => e.stopPropagation()}>
        <button className="x-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="ps-gallery">
          <span className="ps-main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${product.images[img]}&width=1000`} alt={product.title} />
          </span>
          {product.images.length > 1 && (
            <div className="ps-thumbs">
              {product.images.map((src, i) => (
                <button key={src} data-on={i === img} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${src}&width=160`} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ps-info">
          <h3 className="ps-title">{product.title}</h3>
          <p className="ps-price">{money(Number(size?.price ?? product.variants[0].price))}</p>

          {!single && (
            <fieldset className="sizes">
              <legend>size</legend>
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  disabled={!v.available}
                  data-on={size?.id === v.id}
                  aria-pressed={size?.id === v.id}
                  onClick={() => setSize(v)}
                >
                  {v.title}
                </button>
              ))}
            </fieldset>
          )}

          <button
            className="add-btn"
            disabled={!size}
            onClick={() => {
              if (!size) return;
              add(product, size);
              setAdded(true);
            }}
          >
            {!size ? "sold out" : added ? "added ✓ add another" : "add to bag"}
          </button>
          {added && (
            <button
              className="scribble-link"
              onClick={() => {
                onClose();
                setBagOpen(true);
              }}
            >
              view bag →
            </button>
          )}

          {product.description && <p className="ps-desc">{product.description}</p>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
