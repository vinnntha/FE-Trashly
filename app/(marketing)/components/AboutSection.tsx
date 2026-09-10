"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, HeartHandshake, ArrowRight, Recycle, Users, TrendingUp } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="tentang" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#EFF0EB] via-white/60 to-[#EFF0EB]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Kolom Kiri: Visual Community & Interactive Badges (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#0B636B]/15 shadow-[0_20px_50px_-12px_rgba(11,99,107,0.2)] group">
              <Image
                src="/images/about-community.jpg"
                alt="Komunitas warga memilah dan mengumpulkan sampah bersama Trashly"
                width={700}
                height={550}
                className="w-full h-[420px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay Gradient Halus */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B636B]/80 via-transparent to-transparent" />

              {/* Bottom Caption inside image */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F022] text-[#0B636B] text-xs font-bold mb-2">
                  <Recycle className="w-3.5 h-3.5" />
                  Gerakan Lingkungan
                </span>
                <p className="text-sm font-semibold text-[#EFF0EB]">
                  Pemberdayaan 45+ Bank Sampah Unit di Sekolah & Pemukiman
                </p>
              </div>
            </div>

            {/* Floating Stat Card 1 (Top Right Orbit) */}
            <div className="absolute -top-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md border border-[#0B636B]/15 p-4 rounded-2xl shadow-[0_12px_30px_-8px_rgba(11,99,107,0.18)] max-w-[200px] hidden sm:block animate-bounce-subtle">
              <div className="flex items-center gap-2 text-[#64B60A] text-xs font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>Pertumbuhan</span>
              </div>
              <p className="font-display font-extrabold text-xl text-[#0B636B] mt-1">12.500+</p>
              <p className="text-[11px] text-[#0B636B]/70 leading-tight">Nasabah Aktif Memilah</p>
            </div>

            {/* Floating Stat Card 2 (Bottom Left Orbit) */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-[#0B636B] text-[#EFF0EB] p-4 rounded-2xl shadow-[0_16px_36px_-8px_rgba(11,99,107,0.35)] border border-white/10 max-w-[210px]">
              <div className="flex items-center gap-2 text-[#B6F022] text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Transparan</span>
              </div>
              <p className="text-xs text-[#EFF0EB]/85 mt-1 leading-snug">
                Timbangan Digital Tersambung Aplikasi Real-time
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Narasi & Pilar Utama (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CFE26C]/40 border border-[#64B60A]/30 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#64B60A]" />
              <span>Tentang Trashly</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0B636B] tracking-tight leading-[1.15] mb-6">
              Solusi Bank Sampah Digital Yang{" "}
              <span className="text-[#64B60A] bg-[#B6F022]/40 px-2 py-0.5 rounded-xl">
                Mengubah Kebiasaan
              </span>{" "}
              Menjadi Nilai Nyata.
            </h2>

            {/* Intro Paragraph */}
            <p className="text-base sm:text-lg text-[#0B636B]/80 leading-relaxed mb-8">
              Trashly lahir dari visi untuk mentransformasi pengelolaan sampah rumah tangga dari sekadar pembuangan menjadi siklus ekonomi sirkular yang menguntungkan. Melalui integrasi timbangan digital dan platform pintar, kami memudahkan warga dan unit bank sampah untuk mengelola daur ulang secara efisien, akurat, dan transparan.
            </p>

            {/* 3 Core Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
              <div className="p-4 rounded-2xl bg-white border border-[#0B636B]/10 hover:border-[#64B60A]/40 transition-all shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#CFE26C]/40 flex items-center justify-center text-[#0B636B] mb-3">
                  <Recycle className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-sm text-[#0B636B] mb-1">Daur Ulang Sirkular</h4>
                <p className="text-xs text-[#0B636B]/75 leading-relaxed">
                  Memastikan setiap kilogram sampah terpilah kembali ke rantai daur ulang industri.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#0B636B]/10 hover:border-[#64B60A]/40 transition-all shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#B6F022]/40 flex items-center justify-center text-[#0B636B] mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#64B60A]" />
                </div>
                <h4 className="font-display font-bold text-sm text-[#0B636B] mb-1">Akreditasi Poin</h4>
                <p className="text-xs text-[#0B636B]/75 leading-relaxed">
                  Timbangan presisi tersertifikasi yang langsung dikonversi menjadi poin reward.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#0B636B]/10 hover:border-[#64B60A]/40 transition-all shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#0B636B]/10 flex items-center justify-center text-[#0B636B] mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-sm text-[#0B636B] mb-1">Dampak Sosial</h4>
                <p className="text-xs text-[#0B636B]/75 leading-relaxed">
                  Meningkatkan kesejahteraan warga dan mengedukasi generasi muda peduli lingkungan.
                </p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0B636B] hover:bg-[#084e55] text-white font-semibold text-sm transition-all shadow-[0_4px_16px_-4px_rgba(11,99,107,0.4)] active:scale-95"
              >
                <span>Pelajari Selengkapnya</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-sm transition-all shadow-sm active:scale-95"
              >
                <span>Daftar Nasabah</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
