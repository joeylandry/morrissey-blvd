import type { Metadata, Viewport } from "next";
import { Anton, Permanent_Marker, Special_Elite } from "next/font/google";
import "./globals.css";

const marker = Permanent_Marker({ variable: "--f-marker", weight: "400", subsets: ["latin"] });
const poster = Anton({ variable: "--f-poster", weight: "400", subsets: ["latin"] });
const type = Special_Elite({ variable: "--f-type", weight: "400", subsets: ["latin"] });

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
    <html lang="en" className={`${marker.variable} ${poster.variable} ${type.variable}`}>
      <body>{children}</body>
    </html>
  );
}
