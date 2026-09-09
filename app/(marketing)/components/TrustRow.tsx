"use client";

import { Box, Layers, Disc3, Wine, ShieldCheck } from "lucide-react";

export default function TrustRow() {
  const categories = [
    {
      id: "plastik",
      name: "Plastik PET & HDPE",
      sub: "Botol minuman, galon, jerigen",
      rate: "100 Poin/kg",
      icon: Disc3,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "kertas",
      name: "Kertas & Kardus",
      sub: "Karton boks, koran, buku bekas",
      rate: "60 Poin/kg",
      icon: Layers,
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      id: "logam",
      name: "Logam & Kaleng",
      sub: "Kaleng minuman, seng, aluminium",
      rate: "250 Poin/kg",
      icon: Box,
      color: "text-cyan-700 bg-cyan-50 border-cyan-200",
    },
    {
      id: "kaca",
      name: "Kaca & Botol Beling",
      sub: "Botol sirup, kecap, toples utuh",
      rate: "40 Poin/kg",
      icon: Wine,
      color: "text-teal-700 bg-teal-50 border-teal-200",
    },
  ];

  return (
    <section id="kategori" className="py-12 border-y border-[#0B636B]/10 bg-white/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Label Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#64B60A]" />
            <span className="text-xs sm:text-sm font-semibold text-[#0B636B] tracking-wide uppercase">
              Kategori Terpilah yang Diterima di 45+ Unit Bank Sampah Mitra
            </span>
          </div>
          <span className="text-xs text-[#0B636B]/60 font-medium">
            Penimbangan terstandar dengan timbangan digital tersertifikasi
          </span>
        </div>

        {/* 4 Waste Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="group relative p-5 rounded-2xl bg-[#EFF0EB]/80 border border-[#0B636B]/10 hover:border-[#64B60A]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(11,99,107,0.12)] cursor-default"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#0B636B] group-hover:text-[#64B60A] group-hover:scale-110 transition-transform duration-200 shadow-sm border border-[#0B636B]/10">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] border border-[#64B60A]/20">
                    {item.rate}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display font-bold text-base text-[#0B636B]">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#0B636B]/70 mt-1 leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
