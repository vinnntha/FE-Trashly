"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { getImageUrl } from "@/lib/image";
import JenisSampahBadge from "@/components/nasabah/JenisSampahBadge";
import SkeletonCard from "@/components/nasabah/SkeletonCard";
import EmptyState from "@/components/nasabah/EmptyState";
import {
  Search,
  PlusCircle,
  Sparkles,
  Coins,
  Layers,
  Recycle,
} from "lucide-react";

interface KategoriSampahItem {
  id: string;
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  jenis: "PLASTIK" | "KERTAS" | "LOGAM" | "KACA";
  foto?: string | null;
}

const FILTER_TABS = ["SEMUA", "PLASTIK", "KERTAS", "LOGAM", "KACA"] as const;

export default function KategoriSampahPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("SEMUA");

  const {
    data: resData,
    isLoading,
    isError,
    refetch,
  } = useQuery<{ message: string; data: KategoriSampahItem[] }>({
    queryKey: ["kategori-sampah-list"],
    queryFn: () => apiClient<{ message: string; data: KategoriSampahItem[] }>("/kategori-sampah"),
  });

  const kategoriList = resData?.data || [];

  // Filter based on search input and active tab
  const filteredList = useMemo(() => {
    return kategoriList.filter((item) => {
      const matchSearch = item.namaKategori
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      const matchTab =
        activeTab === "SEMUA" || item.jenis.toUpperCase() === activeTab;
      return matchSearch && matchTab;
    });
  }, [kategoriList, searchQuery, activeTab]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>Katalog Sampah</span>
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B636B] tracking-tight">
            Daftar Jenis Sampah Diterima ♻️
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/75 mt-1 max-w-xl">
            Ketahui nilai poin per kilogram sampah terpilah Anda sebelum disetorkan ke bank sampah unit.
          </p>
        </div>

        <Link
          href="/setor"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-xs transition-all shadow-sm active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ajukan Setoran</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-[#0B636B]/10 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B636B]/50">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jenis sampah (contoh: Botol PET, Kardus, Kaleng)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/15 text-xs sm:text-sm text-[#0B636B] placeholder-[#0B636B]/45 focus:outline-none focus:ring-2 focus:ring-[#64B60A]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#0B636B] text-[#EFF0EB] shadow-sm"
                    : "bg-[#EFF0EB] text-[#0B636B]/75 hover:text-[#0B636B] hover:bg-[#CFE26C]/30"
                }`}
              >
                {tab === "SEMUA" ? "Semua Kategori" : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <SkeletonCard count={6} />
      ) : isError ? (
        <EmptyState
          title="Gagal Memuat Kategori Sampah"
          description="Terjadi gangguan saat mengambil data jenis sampah. Silakan coba lagi."
          actionLabel="Coba Lagi"
          onAction={() => refetch()}
        />
      ) : filteredList.length === 0 ? (
        <EmptyState
          title="Jenis Sampah Tidak Ditemukan"
          description={
            searchQuery
              ? `Tidak ada jenis sampah yang cocok dengan kata kunci "${searchQuery}".`
              : "Belum ada kategori sampah di kategori ini."
          }
          actionLabel="Hapus Pencarian"
          onAction={() => {
            setSearchQuery("");
            setActiveTab("SEMUA");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white border border-[#0B636B]/10 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-[#0B636B]/25 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Photo Mockup Frame */}
                <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#F6F8F5] border border-[#0B636B]/6 overflow-hidden flex items-center justify-center">
                  {item.foto ? (
                    <>
                      {/* Ambient blurred backdrop */}
                      <div
                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-20 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url(${getImageUrl(item.foto)})` }}
                      />
                      <Image
                        src={getImageUrl(item.foto)}
                        alt={item.namaKategori}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="rounded-xl object-contain p-3.5 drop-shadow-sm group-hover:scale-105 transition-transform duration-300 relative z-10"
                      />
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#0B636B]/30">
                      <Recycle className="w-12 h-12 text-[#0B636B]/40 stroke-1" />
                      <span className="text-[11px] font-medium text-[#0B636B]/50">
                        Foto Segera Tersedia
                      </span>
                    </div>
                  )}

                  {/* Badge Jenis Sampah Floating */}
                  <div className="absolute top-2.5 right-2.5 z-20">
                    <JenisSampahBadge
                      jenis={item.jenis}
                      className="backdrop-blur-md bg-white/90 shadow-xs text-[11px]"
                    />
                  </div>
                </div>

                {/* Card Info */}
                <div className="pt-3.5 pb-2 px-1">
                  <h3
                    className="font-display font-bold text-base sm:text-lg text-[#0B636B] tracking-tight line-clamp-1 group-hover:text-[#64B60A] transition-colors"
                    title={item.namaKategori}
                  >
                    {item.namaKategori}
                  </h3>

                  {/* Rates / Valuation Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2.5 border-t border-[#0B636B]/10">
                    <div className="p-2.5 rounded-2xl bg-[#EFF0EB]/70 border border-[#0B636B]/10">
                      <p className="text-[10px] uppercase font-bold text-[#0B636B]/60 tracking-wider">
                        Nilai Poin
                      </p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-display font-extrabold text-lg text-[#64B60A]">
                          {item.poinPerKg}
                        </span>
                        <span className="text-[11px] font-bold text-[#64B60A]">
                          Poin/kg
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#EFF0EB]/70 border border-[#0B636B]/10">
                      <p className="text-[10px] uppercase font-bold text-[#0B636B]/60 tracking-wider">
                        Estimasi Harga
                      </p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-display font-bold text-base text-[#0B636B]">
                          Rp {item.hargaPerKg.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] text-[#0B636B]/70">/kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-2">
                <Link
                  href={`/setor?kategoriId=${item.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-4 rounded-full bg-[#EFF0EB] hover:bg-[#B6F022] text-[#0B636B] font-bold text-xs transition-all duration-200 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#64B60A]" />
                  <span>Ajukan Setoran Kategori Ini</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
