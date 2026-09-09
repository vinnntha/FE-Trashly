"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  History,
  Gift,
  Plus,
  CheckCircle2,
  Recycle,
} from "lucide-react";

export default function CtaSteps() {
  const steps = [
    {
      number: "1",
      title: "Daftar & Pilih Kategori Sampah",
      desc: "Buat akun nasabah gratis dalam 1 menit. Pilah sampah anorganik di rumah (botol plastik, kertas, kardus, atau kaleng) sesuai panduan.",
    },
    {
      number: "2",
      title: "Ajukan Penyetoran & Timbang di Unit Mitra",
      desc: "Kunjungi unit bank sampah terdekat (sekolah, kantor kelurahan, atau RT binaan). Admin akan menimbang sampahmu secara transparan.",
    },
    {
      number: "3",
      title: "Kumpulkan Poin & Tukar Hadiah",
      desc: "Poin langsung masuk ke akun aplikasi Trashly seketika. Tukarkan poinmu dengan saldo e-wallet, pulsa, sembako, atau reward lainnya!",
    },
  ];

  return (
    <section
      id="cara-kerja"
      className="py-20 md:py-28 bg-[#0B636B] text-[#EFF0EB] relative overflow-hidden"
    >
      {/* Subtle circular background watermark */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute right-1/4 -top-24 w-72 h-72 rounded-full border border-white/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Sisi Kiri: Kartu Gelap Besar Saldo Poin (Col 5) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-[#0B636B] to-[#08484e] border border-white/15 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Background Watermark Daun/Sirkular */}
              <div className="absolute -right-8 -top-8 text-white/[0.04] pointer-events-none">
                <Recycle className="w-48 h-48" />
              </div>

              {/* Header Kartu */}
              <div className="flex items-center justify-between relative z-10 mb-8">
                <div>
                  <span className="text-xs font-semibold text-[#CFE26C] uppercase tracking-wider">
                    Dompet Digital Lingkungan
                  </span>
                  <h3 className="font-display font-bold text-lg text-white mt-0.5">
                    Saldo Poin Kamu
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#B6F022]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Nominal Poin Besar */}
              <div className="relative z-10 mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-extrabold text-5xl sm:text-6xl text-[#B6F022] tracking-tight">
                    1.250
                  </span>
                  <span className="text-sm font-bold text-[#CFE26C] tracking-wide">POIN</span>
                </div>
                <p className="text-xs text-[#EFF0EB]/70 mt-2">
                  Terakhir diperbarui: 15 menit lalu dari Bank Sampah Melati
                </p>
              </div>

              {/* 3 Tombol Aksi Nyata */}
              <div className="relative z-10 grid grid-cols-3 gap-3 pt-6 border-t border-white/15">
                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-xs transition-all shadow-[0_4px_12px_rgba(182,240,34,0.3)]"
                >
                  <Gift className="w-4 h-4" />
                  <span>Tukar</span>
                </button>

                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-white/10 hover:bg-white/20 text-[#EFF0EB] font-semibold text-xs transition-colors"
                >
                  <History className="w-4 h-4 text-[#CFE26C]" />
                  <span>Riwayat</span>
                </button>

                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-white/10 hover:bg-white/20 text-[#EFF0EB] font-semibold text-xs transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#CFE26C]" />
                  <span>Setor Baru</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: 3 Langkah Terstruktur (Col 7) */}
          <div className="lg:col-span-7">
            {/* Header Steps */}
            <div className="mb-10">
              <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#64B60A] text-[#EFF0EB] mb-3">
                Alur Praktis
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                Mulai Menabung Sampah dalam{" "}
                <span className="text-[#B6F022]">3 Langkah Mudah</span>
              </h2>
              <p className="text-sm sm:text-base text-[#EFF0EB]/80 mt-3 max-w-xl">
                Tidak perlu prosedur rumit. Siapa pun bisa langsung berpartisipasi
                dan merasakan manfaat ekonomi dari sampah terpilah.
              </p>
            </div>

            {/* List 3 Langkah */}
            <div className="space-y-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-[#B6F022]/40 transition-all duration-300"
                >
                  {/* Lingkaran Angka Moss */}
                  <div className="shrink-0 w-11 h-11 rounded-2xl bg-[#64B60A] text-[#EFF0EB] font-display font-extrabold text-lg flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-[#B6F022] group-hover:text-[#0B636B] transition-all">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[#B6F022] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#EFF0EB]/75 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Join Button */}
            <div className="mt-10">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-base transition-all duration-200 shadow-[0_6px_24px_-4px_rgba(182,240,34,0.6)]"
              >
                <span>Buka Akun Nasabah Sekarang</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
