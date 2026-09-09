"use client";

import Image from "next/image";
import { Send, Clock, Gift, ArrowUpRight } from "lucide-react";

export default function FeatureGrid() {
  return (
    <section id="fitur" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE26C] text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-4">
              <span>Fitur Unggulan</span>
            </div>

            {/* Headline with meaningful color highlighting */}
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0B636B] tracking-tight leading-tight">
              Ekosistem Sirkular yang Mengubah{" "}
              <span className="text-[#64B60A]">Setoran Sampah</span> Menjadi{" "}
              <span className="text-[#0B636B] bg-[#B6F022]/40 px-2 py-0.5 rounded-lg">
                Poin Bermanfaat
              </span>
              .
            </h2>
          </div>

          <div className="md:text-right max-w-sm">
            <p className="text-sm sm:text-base text-[#0B636B]/80 leading-relaxed">
              Semua yang kamu butuhkan, tanpa ribet. Dirancang khusus untuk nasabah
              yang ingin bergerak nyata bagi lingkungan sekaligus mendapat reward.
            </p>
          </div>
        </div>

        {/* 4-Column Grid: 1 Foto Dokumentasi + 3 Kartu Bergradasi Warna */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Kolom 1: Foto Dokumentasi Nyata */}
          <div className="group relative overflow-hidden rounded-3xl min-h-[380px] flex flex-col justify-end p-6 border border-[#0B636B]/15 shadow-[0_10px_30px_-10px_rgba(11,99,107,0.12)]">
            <Image
              src="/images/deposit-feature.jpg"
              alt="Nasabah sedang menyetorkan botol plastik ke unit timbangan bank sampah digital"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay Gradient halus */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B636B]/90 via-[#0B636B]/40 to-transparent" />

            <div className="relative z-10 text-[#EFF0EB]">
              <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#B6F022] text-[#0B636B] mb-2">
                Aksi Nyata
              </span>
              <h3 className="font-display font-bold text-xl leading-snug">
                Mudah Disetor di Unit Mitra
              </h3>
              <p className="text-xs text-[#EFF0EB]/80 mt-1">
                Datang ke bank sampah sekolah atau RW binaan, timbang di tempat, poin otomatis masuk.
              </p>
            </div>
          </div>

          {/* Kolom 2: Kartu Moss (#64B60A) */}
          <div className="group relative rounded-3xl p-7 bg-[#64B60A] text-[#EFF0EB] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-8px_rgba(100,182,10,0.4)]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6 text-[#EFF0EB] group-hover:rotate-6 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl leading-tight mb-3">
                Ajukan Setoran Sekali Klik
              </h3>
              <p className="text-sm text-[#EFF0EB]/90 leading-relaxed">
                Pilih jenis sampah dari aplikasi, masukkan estimasi berat, lalu bawa langsung
                atau tunggu jadwal penjemputan unit terdekat.
              </p>
            </div>

            <div className="pt-6 border-t border-white/20 flex items-center justify-between text-xs font-semibold">
              <span>Proses Cepat & Praktis</span>
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>

          {/* Kolom 3: Kartu Sprout (#CFE26C) */}
          <div className="group relative rounded-3xl p-7 bg-[#CFE26C] text-[#0B636B] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-8px_rgba(207,226,108,0.5)]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#0B636B]/10 flex items-center justify-center mb-6 text-[#0B636B] group-hover:rotate-6 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl leading-tight mb-3 text-[#0B636B]">
                Pantau Status Real-time
              </h3>
              <p className="text-sm text-[#0B636B]/85 leading-relaxed">
                Setiap kilogram sampah diverifikasi admin menggunakan timbangan digital.
                Notifikasi dan riwayat penimbangan tercatat transparan.
              </p>
            </div>

            <div className="pt-6 border-t border-[#0B636B]/15 flex items-center justify-between text-xs font-semibold text-[#0B636B]">
              <span>Timbangan Digital Akurat</span>
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>

          {/* Kolom 4: Kartu Lime Terang (#B6F022) */}
          <div className="group relative rounded-3xl p-7 bg-[#B6F022] text-[#0B636B] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-6px_rgba(182,240,34,0.6)]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#0B636B] flex items-center justify-center mb-6 text-[#B6F022] group-hover:rotate-6 transition-transform">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl leading-tight mb-3 text-[#0B636B]">
                Tukar Poin Jadi Hadiah
              </h3>
              <p className="text-sm text-[#0B636B]/90 leading-relaxed">
                Tukarkan poin akumulasi jadi saldo e-wallet (GoPay, OVO, DANA), voucher sembako,
                alat tulis sekolah, atau donasi program bibit pohon.
              </p>
            </div>

            <div className="pt-6 border-t border-[#0B636B]/20 flex items-center justify-between text-xs font-bold text-[#0B636B]">
              <span>Reward Langsung Cair</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
