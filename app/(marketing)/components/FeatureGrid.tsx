"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Scale,
  Gift,
  ReceiptText,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export default function FeatureGrid() {
  return (
    <section id="fitur" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE26C]/40 border border-[#64B60A]/25 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-4">
                <Zap className="w-3.5 h-3.5 text-[#64B60A]" />
                <span>Teknologi & Fitur Utama</span>
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0B636B] tracking-tight leading-tight">
                Ekosistem Terintegrasi untuk Nasabah & Unit Bank Sampah
              </h2>
            </div>

            <p className="md:text-right max-w-sm text-sm text-[#0B636B]/75 leading-relaxed">
              Dari penimbangan di tempat hingga pencairan hadiah ke e-wallet, semua
              tercatat transparan tanpa pembukuan manual yang rawan hilang.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid: Asymmetric & Meaningful Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Item 1: Real Action Photo with Live Verification Ticker (7 Cols) */}
          <div className="md:col-span-7">
            <ScrollReveal animation="fade-up" delay={100} duration={700} className="h-full">
              <div className="group relative overflow-hidden rounded-3xl min-h-[380px] sm:min-h-[420px] h-full flex flex-col justify-between p-7 sm:p-8 border border-[#0B636B]/15 shadow-sm">
                <Image
                  src="/images/deposit-feature.jpg"
                  alt="Penimbangan sampah botol plastik di bank sampah"
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle Gradient Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B636B]/95 via-[#0B636B]/45 to-black/20" />

                {/* Top Tag inside image */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#B6F022] text-[#0B636B] text-xs font-bold shadow-xs">
                    Aksi di Unit Mitra
                  </span>
                  <span className="text-xs text-white/80 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10 font-mono">
                    Presisi ±0.01 kg
                  </span>
                </div>

                {/* Bottom Content inside image */}
                <div className="relative z-10 text-[#EFF0EB] max-w-lg">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white leading-snug mb-2">
                    Timbang Transparan, Validasi Seketika
                  </h3>
                  <p className="text-xs sm:text-sm text-[#EFF0EB]/85 leading-relaxed">
                    Setiap kilogram sampah ditimbang menggunakan timbangan digital terverifikasi.
                    Hasil timbangan langsung terkirim ke ponsel nasabah tanpa perlu kwitansi kertas.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-[#CFE26C]">
                      <CheckCircle2 className="w-4 h-4 text-[#B6F022]" />
                      Anti Selisih Berat
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#CFE26C]">
                      <CheckCircle2 className="w-4 h-4 text-[#B6F022]" />
                      Riwayat Tersimpan Selamanya
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bento Item 2: Digital Scale & Live Counter Widget (5 Cols) */}
          <div className="md:col-span-5">
            <ScrollReveal animation="fade-up" delay={200} duration={700} className="h-full">
              <div className="h-full rounded-3xl p-7 bg-[#0B636B] text-[#EFF0EB] flex flex-col justify-between border border-white/10 shadow-sm relative overflow-hidden group">
                {/* Ambient subtle glow */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#64B60A]/30 blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#B6F022] flex items-center justify-center">
                      <Scale className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#B6F022]/15 text-[#B6F022] border border-[#B6F022]/30">
                      Auto-Sync IoT
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white mb-2">
                    Sinkronisasi Timbangan Presisi
                  </h3>
                  <p className="text-xs sm:text-sm text-[#EFF0EB]/80 leading-relaxed mb-6">
                    Sistem otomatis mengonversi berat sampah ke nominal poin sesuai tarif resmi
                    yang berlaku, mencegah manipulasi harga timbangan manual.
                  </p>

                  {/* Simulation Mock Interface */}
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#EFF0EB]/70">
                      <span>Input Timbangan:</span>
                      <span className="text-[#B6F022] font-semibold">Terkoneksi</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-display font-bold text-2xl text-white">
                        3,40 <span className="text-xs text-[#EFF0EB]/60">kg</span>
                      </span>
                      <span className="text-xs font-bold text-[#B6F022]">
                        +340 Poin Ditambahkan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between text-xs">
                  <span className="text-[#EFF0EB]/70">Dukungan Multi-Kategori</span>
                  <span className="text-[#B6F022] font-semibold">Plastik, Kertas, Logam</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bento Item 3: Digital Receipt & Nota Online (5 Cols) */}
          <div className="md:col-span-5">
            <ScrollReveal animation="fade-up" delay={150} duration={700} className="h-full">
              <div className="h-full rounded-3xl p-7 bg-white border border-[#0B636B]/15 text-[#0B636B] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-[#CFE26C]/40 text-[#0B636B] flex items-center justify-center mb-5">
                    <ReceiptText className="w-5 h-5" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#0B636B] mb-2">
                    Nota Digital & Bukti Setor Resmi
                  </h3>
                  <p className="text-xs sm:text-sm text-[#0B636B]/75 leading-relaxed mb-5">
                    Setiap transaksi memiliki nota digital ber-QR code yang bisa diunduh atau
                    dicek riwayatnya kapan saja sebagai arsip nasabah.
                  </p>

                  {/* Mini receipt preview pill */}
                  <div className="p-3.5 rounded-xl bg-[#EFF0EB] border border-[#0B636B]/10 text-xs space-y-1.5">
                    <div className="flex justify-between text-[11px] text-[#0B636B]/60">
                      <span>No. Nota: #TR-2026-09</span>
                      <span className="text-[#64B60A] font-bold">VERIFIED</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#0B636B]">
                      <span>Total Setor: 5.2 kg</span>
                      <span>Saldo Poin: +480 Pts</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#0B636B]/10 flex items-center justify-between text-xs font-semibold text-[#64B60A]">
                  <span>Tersedia Riwayat Lengkap</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bento Item 4: Instant Reward Redemption (7 Cols) */}
          <div className="md:col-span-7">
            <ScrollReveal animation="fade-up" delay={250} duration={700} className="h-full">
              <div className="h-full rounded-3xl p-7 bg-[#CFE26C]/30 border border-[#64B60A]/20 text-[#0B636B] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-[#64B60A] text-white flex items-center justify-center">
                      <Gift className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#B6F022] text-[#0B636B]">
                      Katalog Hadiah Fleksibel
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[#0B636B] mb-2">
                    Tukar Poin Jadi Hadiah Kebutuhan Pokok
                  </h3>
                  <p className="text-xs sm:text-sm text-[#0B636B]/80 leading-relaxed mb-5">
                    Poin yang terkumpul tidak hangus. Nasabah bebas menukarkan dengan saldo
                    dompet digital (DANA, GoPay, OVO), paket sembako, atau alat tulis sekolah.
                  </p>

                  {/* Sample Reward Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: "Saldo GoPay/DANA", points: "500 Poin", badge: "Populer" },
                      { name: "Minyak Goreng 1L", points: "1.200 Poin", badge: "Sembako" },
                      { name: "Beras Premium 2.5kg", points: "2.500 Poin", badge: "Sembako" },
                      { name: "Voucher PLN 20k", points: "800 Poin", badge: "Tagihan" },
                    ].map((reward, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-white border border-[#0B636B]/10 text-left shadow-2xs hover:border-[#64B60A]/40 transition-colors"
                      >
                        <span className="text-[10px] font-bold text-[#64B60A] block">
                          {reward.badge}
                        </span>
                        <p className="text-xs font-bold text-[#0B636B] mt-0.5 line-clamp-1">
                          {reward.name}
                        </p>
                        <p className="text-[11px] font-semibold text-[#0B636B]/70 mt-1">
                          {reward.points}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#0B636B]/10 flex items-center justify-between">
                  <span className="text-xs text-[#0B636B]/70">
                    Pencairan diverifikasi cepat oleh admin unit
                  </span>
                  <Link
                    href="/hadiah"
                    className="text-xs font-bold text-[#0B636B] hover:text-[#64B60A] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Lihat Katalog Hadiah</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
