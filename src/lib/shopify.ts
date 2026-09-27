import { shopDomain } from "@/data/site";

export type Variant = { id: number; title: string; price: string; available: boolean };
export type Product = {
  id: number;
  title: string;
  handle: string;
  description: string;
  images: string[];
  variants: Variant[];
};

type RawProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  images: { src: string }[];
  variants: { id: number; title: string; price: string; available: boolean }[];
};

const stripHtml = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|div)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

// Reads the public catalog of the band's Shopify store. Refreshed hourly.
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`https://${shopDomain}/products.json?limit=50`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { products: RawProduct[] };
    return data.products.map((p) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      description: stripHtml(p.body_html ?? ""),
      images: p.images.map((i) => i.src),
      variants: p.variants.map((v) => ({
        id: v.id,
        title: v.title,
        price: v.price,
        available: v.available,
      })),
    }));
  } catch {
    return [];
  }
}

// Shopify cart permalink: sends the whole bag straight to checkout.
export const checkoutUrl = (lines: { variantId: number; qty: number }[]) =>
  `https://${shopDomain}/cart/${lines.map((l) => `${l.variantId}:${l.qty}`).join(",")}`;

export const money = (n: number) => `$${n.toFixed(2).replace(/\.00$/, "")}`;
