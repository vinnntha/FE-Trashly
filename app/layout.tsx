import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trashly — Tabung Sampah, Raih Poin & Hadiah Nyata",
  description:
    "Platform Bank Sampah Digital cerdas berbasis ekonomi sirkular. Setor sampah terpilah, pantau penimbangan real-time, kumpulkan poin, dan tukarkan ke berbagai reward bermanfaat.",
  keywords: [
    "Bank Sampah Digital",
    "Ekonomi Sirkular",
    "Trashly",
    "Daur Ulang Sampah",
    "Tukar Poin Sampah",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${outfit.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-mist text-teal-deep antialiased selection:bg-sprout selection:text-teal-deep">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
