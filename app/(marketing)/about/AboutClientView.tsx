"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Recycle,
  Award,
  ShieldCheck,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Heart,
  Globe,
  Zap,
  Building2,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Check,
  Compass,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Definisi data statistik utama
const STATS = [
  { label: "Unit Mitra Terverifikasi", value: "45+", desc: "Sekolah & Kelurahan Binaan", tag: "MITRA LOKAL", dir: "left" },
  { label: "Nasabah Aktif", value: "12.500+", desc: "Warga & Pelajar Terdaftar", tag: "KOMUNITAS", dir: "up" },
  { label: "Sampah Terdaur Ulang", value: "50+ Ton", desc: "Telah Terhindar dari TPA", tag: "REDUKSI TPA", dir: "up" },
  { label: "Tingkat Akurasi Poin", value: "100%", desc: "Timbangan Digital Real-time", tag: "TERVERIFIKASI", dir: "right" },
];

// Garis waktu evolusi Trashly (Interaktif & Zig-Zag Scroll)
const TIMELINE = [
  {
    year: "2023",
    tag: "INISIASI AKAR RUMPUT",
    title: "Lahir dari Keresahan Warga",
    desc: "Dimulai dari program percontohan di 1 RW Surabaya dengan 50 nasabah awal. Menemukan formula pemilahan sampah anorganik yang langsung bernilai rupiah.",
    icon: Heart,
    align: "left",
  },
  {
    year: "2024",
    tag: "DIGITALISASI IOT",
    title: "Peluncuran Platform & Timbangan Presisi",
    desc: "Mendigitalkan seluruh alur pencatatan. Mengintegrasikan timbangan sensor digital dengan kalkulasi poin otomatis ke server cloud tanpa buku tabungan fisik.",
    icon: Zap,
    align: "right",
  },
  {
    year: "2025",
    tag: "EKSPANSI ADIWIYATA",
    title: "Kemitraan 45+ Sekolah & Kelurahan",
    desc: "Memperluas jaringan ke sekolah Adiwiyata dan komunitas kelurahan, mendaur ulang lebih dari 50 ton sampah dan memberdayakan ribuan siswa peduli lingkungan.",
    icon: Building2,
    align: "left",
  },
  {
    year: "2026",
    tag: "SIRKULAR NASIONAL",
    title: "Integrasi E-Wallet & Offtaker Industri",
    desc: "Menghubungkan poin setoran langsung ke pencairan e-wallet nasional (DANA, GoPay, OVO) serta penyaluran bahan baku sampah langsung ke pabrik daur ulang resmi.",
    icon: Globe,
    align: "right",
  },
];

// Empat pilar keunggulan
const PILLARS = [
  {
    index: "01",
    code: "AKURASI",
    icon: ShieldCheck,
    title: "Transparansi Penimbangan",
    desc: "Pencatatan berat dan kategori sampah dilakukan langsung oleh petugas unit dengan timbangan digital tersertifikasi, langsung sinkron ke aplikasi nasabah tanpa manipulasi.",
    color: "bg-[#CFE26C]/30 text-[#0B636B] border-[#64B60A]/20",
    dir: "left",
  },
  {
    index: "02",
    code: "INSENTIF",
    icon: Zap,
    title: "Nilai Ekonomi Sirkular",
    desc: "Sampah anorganik yang terpilah dikonversi menjadi poin berharga yang bisa ditukar saldo e-wallet (GoPay, OVO, DANA), sembako dapur, atau perlengkapan sekolah.",
    color: "bg-[#B6F022]/30 text-[#0B636B] border-[#64B60A]/20",
    dir: "up",
  },
  {
    index: "03",
    code: "MITRA",
    icon: Building2,
    title: "Pemberdayaan Unit Lokal",
    desc: "Kami memperkuat operasional bank sampah unit di sekolah dan RT/RW melalui sistem manajemen digital tanpa kerumitan administrasi manual atau pembukuan kertas.",
    color: "bg-[#0B636B]/10 text-[#0B636B] border-[#0B636B]/15",
    dir: "up",
  },
  {
    index: "04",
    code: "EKOLOGI",
    icon: Globe,
    title: "Dampak Lingkungan Nyata",
    desc: "Setiap gram sampah yang disetor berkontribusi langsung pada penurunan emisi karbon terhitung dan pengurangan beban tempat pemrosesan akhir (TPA).",
    color: "bg-[#64B60A]/20 text-[#0B636B] border-[#64B60A]/30",
    dir: "right",
  },
];

// FAQ
const FAQS = [
  {
    q: "Apa itu Trashly Indonesia?",
    a: "Trashly adalah platform Bank Sampah Digital berbasis ekonomi sirkular yang memudahkan masyarakat memilah sampah, menyetorkannya ke unit terdekat, dan mendapatkan insentif poin yang bernilai ekonomi riil.",
  },
  {
    q: "Bagaimana alur menyetor sampah di Trashly?",
    a: "Cukup pilah sampah rumah tangga (plastik, kertas, logam, atau kaca), bawa ke Unit Mitra Trashly terdekat. Petugas akan menimbang dengan timbangan presisi, dan poin otomatis terakumulasi di akun Anda seketika.",
  },
  {
    q: "Siapa saja yang bisa bergabung menjadi Nasabah?",
    a: "Seluruh lapisan masyarakat! Baik perorangan, keluarga, siswa sekolah, hingga komunitas warga dapat mendaftar gratis sebagai nasabah Trashly.",
  },
  {
    q: "Bagaimana cara sekolah atau instansi bergabung jadi Unit Mitra?",
    a: "Instansi atau sekolah dapat mendaftarkan lokasi bank sampahnya melalui form kemitraan di portal Trashly. Tim kami akan melakukan verifikasi dan pendampingan implementasi sistem penimbangan digital.",
  },
];

const CHAPTERS = [
  { id: "section-stats", index: "01", label: "Metrik" },
  { id: "section-story", index: "02", label: "Cerita" },
  { id: "section-timeline", index: "03", label: "Garis Waktu" },
  { id: "section-vision", index: "04", label: "Visi & Misi" },
  { id: "section-pillars", index: "05", label: "Pilar" },
  { id: "section-faq", index: "06", label: "FAQ" },
];

export default function AboutClientView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // IntersectionObserver untuk trigger animasi muncul dari kiri, kanan, dan bawah
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const allEls = document.querySelectorAll("[data-reveal-id]");
      const ids = new Set<string>();
      allEls.forEach((el) => {
        const id = el.getAttribute("data-reveal-id");
        if (id) ids.add(id);
      });
      setRevealedIds(ids);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-reveal-id");
            if (id) {
              setRevealedIds((prev) => {
                if (prev.has(id)) return prev;
                const next = new Set(prev);
                next.add(id);
                return next;
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const elements = document.querySelectorAll("[data-reveal-id]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Parallax Engine untuk gambar dan elemen mengambang saat scrolling
  useEffect(() => {
    let rafId: number;
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const vh = window.innerHeight;
      const centerY = vh / 2;

      // Parallax updates pada data-parallax-card
      const cards = containerRef.current.querySelectorAll<HTMLElement>("[data-parallax-card]");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (!isReduced && rect.bottom > -150 && rect.top < vh + 150) {
          const cardCenter = rect.top + rect.height / 2;
          const progress = Math.max(-1, Math.min(1, (centerY - cardCenter) / (vh / 2 + rect.height / 2)));
          const pyImg = (progress * 46).toFixed(1);
          const pyBadge = (-progress * 24).toFixed(1);

          card.style.setProperty("--py-img", `${pyImg}px`);
          card.style.setProperty("--py-badge", `${pyBadge}px`);
        }
      });

      // Track active chapter
      const chapterSections = CHAPTERS.map((ch) => document.getElementById(ch.id));
      let currentIdx = 0;
      let minDistance = Infinity;

      chapterSections.forEach((sec, idx) => {
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        const dist = Math.abs(rect.top - 140);
        if (dist < minDistance && rect.top <= centerY) {
          minDistance = dist;
          currentIdx = idx;
        }
      });

      setActiveChapter(currentIdx);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 130;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  // Helper kelas animasi muncul dari kiri, kanan, bawah, atau scale
  const getRevealClass = (
    id: string,
    direction: "left" | "right" | "up" | "scale" = "up",
    delayClass = ""
  ) => {
    const isShown = revealedIds.has(id);
    const base = `transition-all duration-800 cubic-bezier(0.16, 1, 0.3, 1) ${delayClass}`;
    if (isShown) {
      return `${base} opacity-100 translate-x-0 translate-y-0 scale-100`;
    }
    switch (direction) {
      case "left":
        return `${base} opacity-0 -translate-x-12 sm:-translate-x-16`;
      case "right":
        return `${base} opacity-0 translate-x-12 sm:translate-x-16`;
      case "up":
        return `${base} opacity-0 translate-y-12 sm:translate-y-16`;
      case "scale":
        return `${base} opacity-0 scale-90`;
      default:
        return `${base} opacity-0 translate-y-12`;
    }
  };

  return (
    <main ref={containerRef} className="min-h-screen flex flex-col bg-[#EFF0EB] text-[#0B636B] relative">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-[#EFF0EB] via-white/80 to-[#EFF0EB]">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#0B636B 1px, transparent 1px), linear-gradient(90deg, #0B636B 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          {/* Eyebrow Pill */}
          <div
            data-reveal-id="hero-badge"
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CFE26C]/40 border border-[#64B60A]/30 text-[#0B636B] text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-2xs ${getRevealClass(
              "hero-badge",
              "up"
            )}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>// PROFIL RESMI & EKOSISTEM · TRASHLY INDONESIA</span>
          </div>

          {/* Main Title */}
          <h1
            data-reveal-id="hero-title"
            className={`font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B636B] tracking-tight leading-[1.12] max-w-4xl mx-auto mb-6 ${getRevealClass(
              "hero-title",
              "up",
              "delay-100"
            )}`}
          >
            Mewujudkan Indonesia Bersih Melalui{" "}
            <span className="text-[#0B636B] bg-[#B6F022] px-3 py-1 rounded-2xl shadow-xs inline-block">
              Bank Sampah Digital
            </span>
          </h1>

          {/* Subtitle */}
          <p
            data-reveal-id="hero-subtitle"
            className={`text-base sm:text-lg text-[#0B636B]/80 max-w-2xl mx-auto leading-relaxed mb-10 ${getRevealClass(
              "hero-subtitle",
              "up",
              "delay-200"
            )}`}
          >
            Kami mengubah pandangan tentang sampah: bukan lagi beban buangan yang mencemari lingkungan,
            tetapi komoditas bernilai yang dicatat secara presisi, terkalibrasi sistem digital, dan
            mengalirkan insentif langsung kepada masyarakat.
          </p>

          {/* 4 Stat Cards: Muncul Bergantian dari Kiri, Bawah, dan Kanan */}
          <div
            id="section-stats"
            data-parallax-card
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto pt-4"
          >
            {STATS.map((item, idx) => {
              const delays = ["delay-100", "delay-150", "delay-200", "delay-250"];
              return (
                <div
                  key={idx}
                  data-reveal-id={`stat-card-${idx}`}
                  className={`p-6 rounded-3xl bg-white border border-[#0B636B]/15 shadow-sm text-left hover:-translate-y-2 hover:shadow-md transition-all duration-300 relative overflow-hidden group ${getRevealClass(
                    `stat-card-${idx}`,
                    item.dir as "left" | "right" | "up",
                    delays[idx]
                  )}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#EFF0EB] text-[#64B60A] font-bold">
                      {item.tag}
                    </span>
                    <span className="font-mono text-[10px] text-[#0B636B]/50">0{idx + 1}</span>
                  </div>
                  <p className="font-display font-extrabold text-3xl sm:text-4xl text-[#64B60A] mb-1">
                    {item.value}
                  </p>
                  <p className="font-bold text-sm text-[#0B636B]">{item.label}</p>
                  <p className="text-xs text-[#0B636B]/65 mt-1 leading-snug">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky Chapter Sub-Navigation (Hermes Style) */}
      <div className="sticky top-20 z-30 py-2.5 px-4 bg-[#EFF0EB]/90 backdrop-blur-md border-y border-[#0B636B]/15 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-[#0B636B]/60 uppercase tracking-wider pl-2 hidden md:inline">
              Arsip:
            </span>
            {CHAPTERS.map((ch, idx) => {
              const isActive = activeChapter === idx;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => scrollToSection(ch.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-tight transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-[#0B636B] text-[#B6F022] font-bold shadow-xs scale-102"
                      : "bg-white/60 text-[#0B636B]/70 hover:bg-white hover:text-[#0B636B]"
                  }`}
                >
                  <span className={isActive ? "text-[#B6F022]" : "text-[#64B60A] font-semibold"}>
                    {ch.index}
                  </span>
                  <span>{ch.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0 text-xs font-mono text-[#0B636B]/70 pr-2">
            <span>Fokus Bab:</span>
            <span className="px-2 py-0.5 rounded-md bg-[#B6F022]/40 text-[#0B636B] font-bold">
              {CHAPTERS[activeChapter]?.label || "Tentang"}
            </span>
          </div>
        </div>
      </div>

      {/* Section 02: Cerita Kami & Misi (Slide Kiri & Kanan) */}
      <section id="section-story" className="py-20 md:py-28 bg-white/70 border-b border-[#0B636B]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            data-parallax-card
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Visual Box: Slide In Dari KIRI dengan Parallax Image */}
            <div
              data-reveal-id="story-image-box"
              className={`lg:col-span-5 relative ${getRevealClass("story-image-box", "left")}`}
            >
              <div className="relative rounded-3xl overflow-hidden border border-[#0B636B]/20 bg-[#0B636B] h-[400px] sm:h-[490px] shadow-xl group">
                {/* Parallax Image Layer */}
                <div
                  className="absolute -inset-8 transition-transform ease-out duration-75"
                  style={{
                    transform: "translate3d(0, var(--py-img, 0px), 0) scale(1.14)",
                    willChange: "transform",
                  }}
                >
                  <Image
                    src="/images/about-community.jpg"
                    alt="Aktivitas warga memilah sampah di bank sampah mitra Trashly"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B636B]/95 via-[#0B636B]/30 to-black/20 pointer-events-none" />

                {/* Floating Parallax Badge (Top Left) Counter-Drifting */}
                <div
                  className="absolute top-5 left-5 z-20 transition-transform ease-out duration-75"
                  style={{
                    transform: "translate3d(0, var(--py-badge, 0px), 0)",
                    willChange: "transform",
                  }}
                >
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#B6F022] text-[#0B636B] text-xs font-mono font-bold shadow-md">
                    <Heart className="w-3.5 h-3.5 fill-current text-[#0B636B]" />
                    <span>GERAKAN 100% NYATA</span>
                  </div>
                </div>

                {/* Floating Micro Ticker (Top Right) */}
                <div
                  className="absolute top-5 right-5 z-20 transition-transform ease-out duration-75 hidden sm:block"
                  style={{
                    transform: "translate3d(0, var(--py-badge, 0px), 0)",
                    willChange: "transform",
                  }}
                >
                  <div className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-[#EFF0EB] font-mono text-[10px]">
                    45+ UNIT MITRA
                  </div>
                </div>

                {/* Bottom Documentary Caption */}
                <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#64B60A] text-white font-mono text-[10px] uppercase font-bold mb-2">
                    Dokumentasi Lapangan
                  </div>
                  <h4 className="font-display font-bold text-lg text-white leading-snug">
                    Aksi Berkelanjutan di Unit RW & Sekolah
                  </h4>
                  <p className="text-xs text-[#EFF0EB]/80 mt-1 leading-relaxed">
                    Gotong royong warga memilah sampah demi lingkungan yang bersih dan bernilai tambah ekonomi.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Text: Slide In Dari KANAN */}
            <div
              data-reveal-id="story-content-box"
              className={`lg:col-span-7 space-y-6 ${getRevealClass("story-content-box", "right")}`}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#CFE26C]/40 border border-[#64B60A]/30 text-[#0B636B] font-mono text-xs font-bold uppercase tracking-wider">
                <span className="text-[#64B60A] font-black">// 02</span>
                <span>CERITA & LATAR BELAKANG</span>
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B] leading-tight">
                Mengubah Tantangan Sampah Menjadi Peluang Ekonomi Baru.
              </h2>

              <p className="text-base text-[#0B636B]/80 leading-relaxed">
                Pengelolaan sampah seringkali menjadi beban karena kurangnya sistem pencatatan yang jelas
                dan manfaat langsung yang dirasakan oleh warga. Trashly hadir untuk menjembatani celah tersebut.
              </p>

              <p className="text-base text-[#0B636B]/80 leading-relaxed">
                Melalui platform digital kami, nasabah dapat melihat bobot timbangan secara transparan,
                melacak akumulasi poin reward, serta langsung menukarkannya dengan berbagai kebutuhan harian.
                Di saat yang sama, pengurus bank sampah unit dibekali alat manajemen terpadu yang mempermudah
                laporan operasional.
              </p>

              {/* List Highlight */}
              <div className="pt-2 space-y-3">
                {[
                  "Pencatatan setoran digital tanpa nota kertas manual yang rawan sobek",
                  "Integrasi harga per-kilogram yang adil dan terus terbarui sesuai pasar",
                  "Mendukung target pengurangan sampah nasional secara terukur dan transparan",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#64B60A] flex items-center justify-center text-white shrink-0 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm font-medium text-[#0B636B]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Garis Waktu & Roadmap (Zig-Zag Interaktif Kiri-Kanan) */}
      <section id="section-timeline" className="py-20 md:py-28 bg-[#EFF0EB] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <div
            data-reveal-id="timeline-header"
            className={`text-center max-w-2xl mx-auto mb-16 ${getRevealClass("timeline-header", "up")}`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#0B636B]/15 text-[#0B636B] font-mono text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#64B60A]" />
              <span>// 03 · PERJALANAN KAMI</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B] tracking-tight">
              Evolusi Inovasi Trashly Indonesia
            </h2>
            <p className="text-sm sm:text-base text-[#0B636B]/75 mt-3">
              Langkah demi langkah dalam membangun ekosistem sirkular modern yang dipercaya ribuan warga.
            </p>
          </div>

          {/* Timeline Wrapper dengan Garis Tengah Interaktif */}
          <div className="relative">
            {/* Center Glowing Guide Line */}
            <div
              className="absolute top-4 bottom-4 left-4 sm:left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-[#64B60A] via-[#B6F022] to-[#0B636B] opacity-30 rounded-full"
              aria-hidden="true"
            />

            <div className="space-y-12 sm:space-y-16">
              {TIMELINE.map((item, idx) => {
                const IconComp = item.icon;
                const isLeft = item.align === "left";

                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                      isLeft ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Center Node Badge */}
                    <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-[#0B636B] text-[#B6F022] border-4 border-[#EFF0EB] shadow-md">
                      <IconComp className="w-4 h-4" />
                    </div>

                    {/* Content Card: Muncul Bergantian Kiri & Kanan */}
                    <div
                      data-reveal-id={`timeline-card-${idx}`}
                      className={`pl-12 sm:pl-0 sm:w-1/2 ${
                        isLeft ? "sm:pr-12 sm:text-right" : "sm:pl-12 sm:text-left"
                      } ${getRevealClass(
                        `timeline-card-${idx}`,
                        isLeft ? "left" : "right",
                        "delay-100"
                      )}`}
                    >
                      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#0B636B]/15 shadow-sm hover:border-[#64B60A]/50 hover:shadow-md transition-all duration-300">
                        <div
                          className={`flex items-center gap-2 mb-2 ${
                            isLeft ? "sm:justify-end" : "sm:justify-start"
                          }`}
                        >
                          <span className="font-display font-black text-2xl text-[#64B60A]">
                            {item.year}
                          </span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[#B6F022]/40 text-[#0B636B] font-bold">
                            {item.tag}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-[#0B636B] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#0B636B]/75 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: Visi & Misi Showdown (Visi Slide Kiri, Misi Slide Kanan) */}
      <section id="section-vision" className="py-20 md:py-28 bg-white/80 border-y border-[#0B636B]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            data-reveal-id="vision-header"
            className={`text-center max-w-2xl mx-auto mb-14 ${getRevealClass("vision-header", "up")}`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF0EB] border border-[#0B636B]/15 text-[#0B636B] font-mono text-xs font-bold uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5 text-[#64B60A]" />
              <span>// 04 · ARAH & KOMITMEN</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B] tracking-tight">
              Visi & Misi Utama Kami
            </h2>
            <p className="text-sm sm:text-base text-[#0B636B]/75 mt-3">
              Komitmen Trashly dalam membangun budaya pilah sampah yang adil, transparan, dan berdampak jangka panjang.
            </p>
          </div>

          <div
            data-parallax-card
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Card Visi (Dark Teal) - Slide Dari KIRI */}
            <div
              data-reveal-id="card-visi"
              className={`p-8 sm:p-10 rounded-3xl bg-[#0B636B] text-[#EFF0EB] shadow-lg flex flex-col justify-between relative overflow-hidden group border border-white/10 ${getRevealClass(
                "card-visi",
                "left"
              )}`}
            >
              {/* Parallax Icon Watermark */}
              <div
                className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all duration-300 pointer-events-none"
                style={{
                  transform: "translate3d(0, var(--py-img, 0px), 0)",
                  willChange: "transform",
                }}
              >
                <Recycle className="w-44 h-44 text-white" />
              </div>

              <div className="relative z-10">
                <div className="inline-block px-3 py-1 rounded-xl bg-[#B6F022] text-[#0B636B] font-mono font-bold text-xs mb-6 shadow-xs">
                  VISI RESMI
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl leading-snug mb-4 text-white">
                  Menjadi Penggerak Utama Ekonomi Sirkular Berbasis Digital di Indonesia.
                </h3>
                <p className="text-sm sm:text-base text-[#EFF0EB]/85 leading-relaxed">
                  Menciptakan ekosistem terpadu di mana setiap rumah tangga dan instansi dapat berpartisipasi
                  aktif menjaga kelestarian lingkungan dengan insentif ekonomi yang transparan dan bermanfaat.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-2 text-xs font-mono font-semibold text-[#CFE26C] relative z-10">
                <Sparkles className="w-4 h-4 text-[#B6F022]" />
                <span>MASA DEPAN BEBAS SAMPAH TPA</span>
              </div>
            </div>

            {/* Card Misi (Moss Green) - Slide Dari KANAN */}
            <div
              data-reveal-id="card-misi"
              className={`p-8 sm:p-10 rounded-3xl bg-[#64B60A] text-[#EFF0EB] shadow-lg flex flex-col justify-between relative overflow-hidden group border border-white/15 ${getRevealClass(
                "card-misi",
                "right"
              )}`}
            >
              <div
                className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all duration-300 pointer-events-none"
                style={{
                  transform: "translate3d(0, var(--py-img, 0px), 0)",
                  willChange: "transform",
                }}
              >
                <Award className="w-44 h-44 text-white" />
              </div>

              <div className="relative z-10">
                <div className="inline-block px-3 py-1 rounded-xl bg-white text-[#0B636B] font-mono font-bold text-xs mb-6 shadow-xs">
                  EMPAT MISI UTAMA
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl leading-snug mb-4 text-white">
                  Misi Strategis Trashly Indonesia
                </h3>
                <ul className="space-y-3 text-sm text-[#EFF0EB]/95">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B6F022] mt-1.5 shrink-0" />
                    <span>Mengembangkan sistem penimbangan digital yang akurat dan tersinkronisasi real-time.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B6F022] mt-1.5 shrink-0" />
                    <span>Memperluas jaringan Unit Bank Sampah di sekolah, kelurahan, dan perkantoran.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B6F022] mt-1.5 shrink-0" />
                    <span>Memberikan reward bernilai nyata yang dapat ditukarkan secara fleksibel.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B6F022] mt-1.5 shrink-0" />
                    <span>Mengedukasi pentingnya pemilahan sampah organik & anorganik sejak dari rumah.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20 flex items-center gap-2 text-xs font-mono font-semibold text-white relative z-10">
                <CheckCircle2 className="w-4 h-4 text-[#B6F022]" />
                <span>BERINOVASI DEMI MASYARAKAT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Pillars Section (Staggered Cards dari Kiri, Bawah, Kanan) */}
      <section id="section-pillars" className="py-20 md:py-28 bg-[#EFF0EB]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            data-reveal-id="pillars-header"
            className={`text-center max-w-2xl mx-auto mb-14 ${getRevealClass("pillars-header", "up")}`}
          >
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#CFE26C]/40 border border-[#64B60A]/30 text-[#0B636B] font-mono text-xs font-bold uppercase tracking-wider mb-3">
              // 05 · PILAR KEUNGGULAN
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B]">
              Mengapa Memilih Platform Trashly?
            </h2>
            <p className="text-sm text-[#0B636B]/75 mt-2">
              Empat fondasi utama yang membedakan Trashly dari bank sampah konvensional.
            </p>
          </div>

          <div
            data-parallax-card
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {PILLARS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  data-reveal-id={`pillar-card-${idx}`}
                  className={`p-7 rounded-3xl bg-white border border-[#0B636B]/15 hover:border-[#64B60A]/50 hover:-translate-y-2 transition-all duration-300 shadow-sm flex flex-col justify-between group ${getRevealClass(
                    `pillar-card-${idx}`,
                    item.dir as "left" | "right" | "up",
                    `delay-${(idx + 1) * 100}`
                  )}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-[10px] text-[#64B60A] font-bold px-2 py-0.5 rounded-md bg-[#EFF0EB] border border-[#0B636B]/10">
                        #{item.index} {item.code}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#0B636B] mb-3 group-hover:text-[#64B60A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0B636B]/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 06: FAQ Section (Slide Up dari Bawah) */}
      <section id="section-faq" className="py-20 md:py-28 bg-white/70 border-t border-[#0B636B]/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div
            data-reveal-id="faq-header"
            className={`text-center mb-14 ${getRevealClass("faq-header", "up")}`}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#CFE26C]/40 border border-[#64B60A]/30 text-[#0B636B] font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-4 h-4 text-[#64B60A]" />
              <span>// 06 · TANYA JAWAB UMUM</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B]">
              Hal yang Sering Ditanyakan
            </h2>
            <p className="text-sm text-[#0B636B]/75 mt-2">
              Jawaban cepat seputar pendaftaran, mekanisme penimbangan, dan penukaran poin.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  data-reveal-id={`faq-item-${idx}`}
                  className={`rounded-2xl bg-white border border-[#0B636B]/15 shadow-sm overflow-hidden transition-all duration-300 ${getRevealClass(
                    `faq-item-${idx}`,
                    "up",
                    `delay-${idx * 100}`
                  )}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#EFF0EB]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#64B60A] bg-[#CFE26C]/30 px-2 py-1 rounded-lg">
                        Q{idx + 1}
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#0B636B]">
                        {faq.q}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#0B636B]/60 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-[#64B60A]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-[#0B636B]/80 leading-relaxed border-t border-[#0B636B]/10 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 07: Bottom Call to Action (Slide Up dengan Parallax Glow) */}
      <section
        data-reveal-id="cta-section"
        className={`py-16 md:py-24 bg-[#0B636B] text-[#EFF0EB] border-t border-white/10 relative overflow-hidden ${getRevealClass(
          "cta-section",
          "up"
        )}`}
      >
        {/* Glow Accent Circles */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#B6F022]/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#CFE26C]/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#B6F022] font-mono text-xs font-bold uppercase tracking-wider mb-6">
            <span>// SIAP BERKOLABORASI</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-6">
            Siap Menjadi Bagian dari Gerakan Hijau Trashly?
          </h2>

          <p className="text-base sm:text-lg text-[#EFF0EB]/85 max-w-2xl mx-auto leading-relaxed mb-10">
            Daftarkan diri Anda sebagai nasabah atau daftarkan lokasi bank sampah Anda sebagai Unit Mitra
            resmi kami hari ini.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-base transition-all shadow-lg active:scale-95"
            >
              <span>Daftar Nasabah Sekarang</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base transition-all border border-white/20 active:scale-95"
            >
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
