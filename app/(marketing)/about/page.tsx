import type { Metadata } from "next";
import AboutClientView from "./AboutClientView";

export const metadata: Metadata = {
  title: "Tentang Kami — Trashly Indonesia",
  description:
    "Pelajari lebih lanjut tentang Trashly, platform Bank Sampah Digital yang mendorong ekonomi sirkular, pemilahan sampah transparan, dan pemberdayaan masyarakat.",
};

export default function AboutPage() {
  return <AboutClientView />;
}
