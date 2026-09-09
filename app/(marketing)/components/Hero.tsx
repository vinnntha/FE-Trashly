"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Award,
  Recycle,
  CheckCircle2,
} from "lucide-react";

export default function Hero() {
  // Micro-interactive preview for quick calculator
  const [selectedWaste, setSelectedWaste] = useState<"plastik" | "kertas" | "logam">("plastik");

  const wasteData = {
    plastik: { name: "Botol Plastik PET", points: "+250", kg: "2.5 kg" },
    kertas: { name: "Kardus & Kertas Bekas", points: "+180", kg: "3.0 kg" },
    logam: { name: "Kaleng Minuman Aluminium", points: "+420", kg: "1.2 kg" },
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-20 md:pt-12 md:pb-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Kolom Kiri: Teks & CTA (55% / 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CFE26C]/30 border border-[#64B60A]/20 text-[#0B636B] text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#64B60A] animate-pulse" />
              <span>Bank Sampah Digital Generasi Baru</span>
            </div>

            {/* Headline 3 Baris */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B636B] tracking-tight leading-[1.12] mb-6">
              Ubah Pilahan Sampah Jadi{" "}
              <span className="text-[#64B60A] underline decoration-[#B6F022] decoration-wavy decoration-2 underline-offset-4">
                Poin Bernilai
              </span>{" "}
              & Dampak Nyata.
            </h1>

            {/* Sub-copy */}
            <p className="text-base sm:text-lg text-[#0B636B]/80 font-normal leading-relaxed mb-8 max-w-xl">
              Sampah rumah tanggamu bukan lagi buangan akhir. Bersama Trashly,
              setor sampah daur ulang ke unit terdekat, kumpulkan poin secara transparan,
              lalu tukarkan menjadi saldo dompet digital atau sembako.
            </p>

            {/* Dual CTA */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-base transition-all duration-200 shadow-[0_6px_24px_-6px_rgba(182,240,34,0.7)] hover:shadow-[0_10px_28px_-4px_rgba(182,240,34,0.9)] active:scale-95"
              >
                <span>Mulai Setor Sekarang</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#cara-kerja"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[#0B636B]/25 hover:border-[#0B636B] text-[#0B636B] font-semibold text-sm transition-all duration-200 hover:bg-[#EFF0EB]/50"
              >
                <div className="w-6 h-6 rounded-full bg-[#0B636B]/10 flex items-center justify-center text-[#0B636B]">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Lihat Cara Kerja</span>
              </a>
            </div>

            {/* Divider Tipis */}
            <div className="w-full h-px bg-[#0B636B]/15 mb-6" />

            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold text-[#0B636B]/60 mr-1">
                Alur sirkular:
              </span>
              {[
                "Pilah & Setor Sampah",
                "Timbang Akurat",
                "Akumulasi Poin",
                "Tukar Hadiah Bermanfaat",
              ].map((pill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium text-[#0B636B] bg-white/70 border border-[#0B636B]/15 backdrop-blur-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Visual Melayang & Siklus Sirkular (45% / 5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Lingkaran Dekoratif Siklus Ekonomi Sirkular */}
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-[#0B636B]/15 flex items-center justify-center">
              {/* Ring konsentris tipis */}
              <div className="absolute inset-5 rounded-full border border-dashed border-[#64B60A]/25 animate-spin-slow" />
              <div className="absolute inset-14 rounded-full bg-gradient-to-tr from-[#CFE26C]/20 to-transparent pointer-events-none" />

              {/* Orbiting tiny leaf marker */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#64B60A] text-[#EFF0EB] rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                <Recycle className="w-3 h-3" />
                <span>Closed Loop</span>
              </div>

              {/* KARTU UTAMA: Saldo Poin Nasabah (Dark Card) */}
              <div className="relative z-20 w-[90%] sm:w-[340px] bg-[#0B636B] text-[#EFF0EB] rounded-3xl p-6 shadow-[0_24px_50px_-12px_rgba(11,99,107,0.45)] border border-white/10 -rotate-2 hover:rotate-0 transition-transform duration-300">
                {/* Header Kartu */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#B6F022]/20 flex items-center justify-center text-[#B6F022]">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#EFF0EB]/70 leading-none">Status Nasabah</p>
                      <p className="text-xs font-semibold text-[#EFF0EB] mt-0.5">Eco Champion</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/10 text-[#CFE26C]">
                    ID: #TR-8821
                  </span>
                </div>

                {/* Angka Saldo Poin */}
                <div className="my-5">
                  <p className="text-xs font-medium text-[#EFF0EB]/70">Poin Aktif Kamu</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display font-extrabold text-4xl sm:text-5xl text-[#B6F022] tracking-tight">
                      1.250
                    </span>
                    <span className="text-xs font-semibold text-[#CFE26C]">POIN</span>
                  </div>
                  <p className="text-[11px] text-[#EFF0EB]/60 mt-1">
                    Setara Rp125.000 saldo e-wallet / voucher belanja
                  </p>
                </div>

                {/* Quick actions card */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#CFE26C] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B6F022]" />
                    Terverifikasi
                  </span>
                  <Link
                    href="/dashboard"
                    className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[#EFF0EB] font-medium text-[11px] transition-colors"
                  >
                    Tukar Poin →
                  </Link>
                </div>
              </div>

              {/* KARTU KECIL MELAYANG: Kategori Sampah Terpilih */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 z-30 bg-[#EFF0EB] border border-[#0B636B]/15 rounded-2xl p-4 shadow-[0_12px_32px_-8px_rgba(11,99,107,0.18)] max-w-[210px] sm:max-w-[230px] transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#0B636B]/70">
                    Setoran Terakhir
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#CFE26C] text-[#0B636B] font-bold">
                    {wasteData[selectedWaste].points} Pts
                  </span>
                </div>
                <p className="text-xs font-bold text-[#0B636B] line-clamp-1">
                  {wasteData[selectedWaste].name}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#0B636B]/10 text-[11px]">
                  <span className="text-[#0B636B]/60">Berat: {wasteData[selectedWaste].kg}</span>
                  <div className="flex gap-1">
                    {(["plastik", "kertas", "logam"] as const).map((key) => (
                      <button
                        key={key}
                        onClick={() => setSelectedWaste(key)}
                        className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center transition-colors ${
                          selectedWaste === key
                            ? "bg-[#64B60A] text-white"
                            : "bg-[#0B636B]/15 text-[#0B636B]"
                        }`}
                        title={key}
                      >
                        {key[0].toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* WIDGET MINI MELAYANG: Tonase Terkumpul */}
              <div className="absolute -top-4 -right-2 sm:-right-6 z-30 bg-white/95 backdrop-blur-md border border-[#0B636B]/15 rounded-2xl p-3.5 shadow-[0_12px_28px_-8px_rgba(11,99,107,0.15)] max-w-[170px] sm:max-w-[190px]">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64B60A]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Dampak Bulan Ini</span>
                </div>
                <div className="mt-1">
                  <p className="text-xl font-extrabold text-[#0B636B] font-display">
                    342,8 <span className="text-xs font-semibold text-[#0B636B]/70">kg</span>
                  </p>
                  <p className="text-[10px] text-[#0B636B]/60 mt-0.5">
                    Sampah terhindar dari TPA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
