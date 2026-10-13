import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Fredoka } from "next/font/google";
import "./globals.css";

// Rounded, melty display face to sit next to the wavy logo, plus a soft
// rounded sans for body copy.
const display = Bagel_Fat_One({ variable: "--f-display", weight: "400", subsets: ["latin"] });
const body = Fredoka({ variable: "--f-rounded", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.morrisseyblvd.org"),
  title: "Morrissey Blvd",
  description: "Three brothers from New Bedford, MA. Tour dates, music, video, photos and merch.",
  openGraph: {
    title: "Morrissey Blvd",
    description: "Tour dates, music, video, photos and merch.",
    images: ["/photos/poster-fall-2026.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#e2471d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
