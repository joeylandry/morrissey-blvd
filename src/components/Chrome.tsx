"use client";

import { sections } from "@/data/site";
import { useCart } from "./cart";

export default function Chrome({ active, goTo }: { active: number; goTo: (i: number) => void }) {
  const { count, setBagOpen } = useCart();
  return (
    <>
      <header className="topbar" data-tone={sections[active].tone}>
        <a
          href="#"
          className="topbar-mark boil"
          data-hidden={active === 0}
          onClick={(e) => {
            e.preventDefault();
            goTo(0);
          }}
        >
          Morrissey Blvd
        </a>
        <button className="bag-btn" onClick={() => setBagOpen(true)}>
          Bag <span className="bag-count">{count}</span>
        </button>
      </header>

      <nav className="dots" aria-label="Sections">
        <ol>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === i ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(i);
                }}
              >
                <span className="dots-label">{s.label}</span>
                <span className="dots-dot" />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
