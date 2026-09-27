"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product, Variant } from "@/lib/shopify";

export type Line = { product: Product; variant: Variant; qty: number };

type Cart = {
  lines: Line[];
  count: number;
  subtotal: number;
  add: (product: Product, variant: Variant) => void;
  setQty: (variantId: number, qty: number) => void;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
};

const CartContext = createContext<Cart | null>(null);

// The bag lives in memory only; checkout hands it to Shopify.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [bagOpen, setBagOpen] = useState(false);

  const value = useMemo<Cart>(() => {
    const add = (product: Product, variant: Variant) =>
      setLines((ls) => {
        const hit = ls.find((l) => l.variant.id === variant.id);
        if (hit) return ls.map((l) => (l === hit ? { ...l, qty: l.qty + 1 } : l));
        return [...ls, { product, variant, qty: 1 }];
      });
    const setQty = (variantId: number, qty: number) =>
      setLines((ls) =>
        qty <= 0 ? ls.filter((l) => l.variant.id !== variantId) : ls.map((l) => (l.variant.id === variantId ? { ...l, qty } : l)),
      );
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * Number(l.variant.price), 0),
      add,
      setQty,
      bagOpen,
      setBagOpen,
    };
  }, [lines, bagOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
