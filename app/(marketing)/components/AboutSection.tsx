"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Recycle,
  Users,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<"nasabah" | "mitra">("nasabah");

  return (
    <section
      id="tentang"
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#EFF0EB] via-white/50 to-[#EFF0EB]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Kolom Kiri: Visual Community & Grounded Documentary Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#0B636B]/15 shadow-md group">
              <Image
                src="/images/about-community.jpg"
                alt="Komunitas warga memilah dan mengumpulkan sampah bersama Trashly"
                width={700}
                height={550}
                className="w-full h-[400px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B636B]/90 via-[#0B636B]/30 to-transparent" />

              {/* Grounded Caption Bar (clean, not floating randomly) */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F022] text-[#0B636B] text-xs font-bold mb-2">
                  <Recycle className="w-3.5 h-3.5" />
                  <span>Gerakan Sirkular Berkelanjutan</span>
                </div>
                <h4 className="font-display font-bold text-lg text-white">
                  Diberdayakan di 45+ Titik Sekolah & RW Mitra
                </h4>
                <p className="text-xs text-[#EFF0EB]/80 mt-1">
                  Mendorong kesadaran memilah dari sumbernya demi mengurangi timbunan sampah di TPA.
                </p>
              </div>
            </div>

            {/* Grounded Real Stat Ribbon Below Card */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-[#0B636B]/10 shadow-2xs">
                <p className="text-xs text-[#0B636B]/70 font-medium">Nasabah Aktif:</p>
                <p className="font-display font-extrabold text-xl text-[#0B636B] mt-0.5">
                  12.500+
                </p>
                <span className="text-[11px] text-[#64B60A] font-semibold">Tergabung di aplikasi</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#0B636B]/10 shadow-2xs">
                <p className="text-xs text-[#0B636B]/70 font-medium">Akurasi Timbangan:</p>
                <p className="font-display font-extrabold text-xl text-[#64B60A] mt-0.5">
                  100%
                </p>
                <span className="text-[11px] text-[#0B636B]/70 font-medium">Digital calibrated</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Narasi, Tab Switcher & Nilai Nyata (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CFE26C]/40 border border-[#64B60A]/30 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#64B60A]" />
              <span>Misi Nyata Trashly</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0B636B] tracking-tight leading-[1.15] mb-5">
              Menjembatani Warga dan Pengelolaan Sampah Modern.
            </h2>

            <p className="text-base text-[#0B636B]/80 leading-relaxed mb-6">
              Trashly mengubah cara pandang masyarakat terhadap sampah rumah tangga.
              Bukan lagi beban buangan, melainkan komoditas bernilai yang dicatat secara
              digital, ditimbang adil, dan memberikan insentif nyata bagi yang peduli.
            </p>

            {/* Interactive Persona Tab Switcher */}
            <div className="w-full bg-[#EFF0EB] p-1.5 rounded-2xl border border-[#0B636B]/15 flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("nasabah")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "nasabah"
                    ? "bg-[#0B636B] text-white shadow-xs"
                    : "text-[#0B636B]/70 hover:text-[#0B636B]"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Untuk Nasabah & Warga</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("mitra")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === "mitra"
                    ? "bg-[#0B636B] text-white shadow-xs"
                    : "text-[#0B636B]/70 hover:text-[#0B636B]"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Untuk Pengelola Unit & Sekolah</span>
              </button>
            </div>

            {/* Dynamic Content based on Persona */}
            {activeTab === "nasabah" ? (
              <div className="w-full space-y-3 mb-8 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-white border border-[#0B636B]/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#B6F022]/40 text-[#0B636B] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#64B60A]" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#0B636B]">
                      Penyetoran Cepat & Saldo Instan
                    </h4>
                    <p className="text-xs text-[#0B636B]/75 mt-0.5 leading-relaxed">
                      Cukup bawa sampah terpilah ke unit terdekat. Poin langsung masuk ke akun tanpa buku tabungan manual yang mudah kotor atau hilang.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#0B636B]/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#CFE26C]/40 text-[#0B636B] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#64B60A]" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#0B636B]">
                      Tukar Jadi Saldo E-Wallet & Kebutuhan Dapur
                    </h4>
                    <p className="text-xs text-[#0B636B]/75 mt-0.5 leading-relaxed">
                      Poin fleksibel ditukar dengan saldo DANA, GoPay, pulsa, atau sembako (minyak goreng, beras, gula) untuk kebutuhan sehari-hari.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-3 mb-8 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-white border border-[#0B636B]/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0B636B]/10 text-[#0B636B] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#0B636B]" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#0B636B]">
                      Pencatatan Digital Bebas Selisih
                    </h4>
                    <p className="text-xs text-[#0B636B]/75 mt-0.5 leading-relaxed">
                      Petugas mencatat berat dengan timbangan presisi, nominal poin otomatis dikalkulasi sistem tanpa hitung manual di kalkulator.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#0B636B]/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#64B60A]/15 text-[#64B60A] flex items-center justify-center shrink-0">
                    <Recycle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#0B636B]">
                      Rekapitulasi & Laporan Lingkungan Otomatis
                    </h4>
                    <p className="text-xs text-[#0B636B]/75 mt-0.5 leading-relaxed">
                      Ekspor data setoran, tonase daur ulang, dan statistik nasabah untuk laporan sekolah Adiwiyata atau evaluasi lingkungan kelurahan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0B636B] hover:bg-[#084e55] text-white font-semibold text-sm transition-all shadow-sm active:scale-95"
              >
                <span>Baca Profil Lengkap Trashly</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-sm transition-all shadow-xs active:scale-95"
              >
                <span>Gabung Jadi Nasabah</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
