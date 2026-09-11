"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import StatusBadge from "@/components/nasabah/StatusBadge";
import SkeletonCard from "@/components/nasabah/SkeletonCard";
import EmptyState from "@/components/nasabah/EmptyState";
import {
  History,
  Calendar,
  ArrowRight,
  PlusCircle,
  Scale,
  Sparkles,
  ChevronRight,
  Filter,
} from "lucide-react";

interface DetailSetorItem {
  id: string;
  kategoriSampahId: string;
  namaKategori: string;
  jenis: string;
  beratKg: number;
  beratKgReal?: number | null;
  subtotalPoin: number;
}

interface SetorSampahItem {
  id: string;
  kodeSetor: string;
  tanggal: string;
  status: string;
  totalBeratKg: number;
  totalPoin: number;
  catatan?: string | null;
  catatanAdmin?: string | null;
  detailSetors: DetailSetorItem[];
}

const STATUS_TABS = [
  { key: "SEMUA", label: "Semua" },
  { key: "menunggu_konfirmasi", label: "Menunggu Konfirmasi" },
  { key: "diverifikasi", label: "Diverifikasi" },
  { key: "selesai", label: "Selesai" },
  { key: "ditolak", label: "Ditolak" },
] as const;

export default function RiwayatSetorPage() {
  // Default to current year-month YYYY-MM
  const currentMonth = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [bulan, setBulan] = useState<string>(currentMonth);
  const [activeTab, setActiveTab] = useState<string>("SEMUA");

  const {
    data: resData,
    isLoading,
    isError,
    refetch,
  } = useQuery<{ message: string; data: SetorSampahItem[] }>({
    queryKey: ["setor-sampah-list", bulan],
    queryFn: () =>
      apiClient<{ message: string; data: SetorSampahItem[] }>(
        `/setor-sampah/my-setor?bulan=${bulan}`
      ),
  });

  const rawList = resData?.data || [];

  // Client-side filtering per status tab
  const filteredList = useMemo(() => {
    if (activeTab === "SEMUA") return rawList;
    return rawList.filter(
      (item) => item.status.toLowerCase() === activeTab.toLowerCase()
    );
  }, [rawList, activeTab]);

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>Riwayat Transaksi</span>
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B636B] tracking-tight">
            Status & Riwayat Penyetoran
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/75 mt-1">
            Pantau status verifikasi penimbangan sampah Anda secara transparan dan akurat.
          </p>
        </div>

        <Link
          href="/setor"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-xs transition-all shadow-sm active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Setor Baru</span>
        </Link>
      </div>

      {/* Filter Toolbar: Bulan & Status Tabs */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#0B636B]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Month Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#64B60A]" />
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Periode Bulan:
            </label>
            <input
              type="month"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#EFF0EB] border border-[#0B636B]/15 text-xs font-semibold text-[#0B636B] focus:outline-none focus:ring-2 focus:ring-[#64B60A]"
            />
          </div>

          <span className="text-xs text-[#0B636B]/60 font-medium">
            Menampilkan <strong>{filteredList.length}</strong> transaksi di periode ini
          </span>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-[#0B636B]/10 pt-3">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#0B636B] text-[#EFF0EB] shadow-sm"
                    : "bg-[#EFF0EB] text-[#0B636B]/70 hover:text-[#0B636B] hover:bg-[#CFE26C]/30"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transaction List */}
      {isLoading ? (
        <SkeletonCard variant="list" count={5} />
      ) : isError ? (
        <EmptyState
          title="Gagal Memuat Riwayat"
          description="Terjadi kendala saat mengambil riwayat penyetoran. Silakan coba lagi."
          actionLabel="Muat Ulang"
          onAction={() => refetch()}
        />
      ) : filteredList.length === 0 ? (
        <EmptyState
          title="Belum Ada Riwayat Penyetoran"
          description={
            activeTab === "SEMUA"
              ? `Tidak ada transaksi penyetoran sampah pada bulan ${bulan}. Mulai kumpulkan poin dengan menyetorkan sampah terpilah Anda!`
              : `Tidak ada transaksi dengan status "${activeTab}" pada bulan ${bulan}.`
          }
          actionLabel="Ajukan Setoran Sekarang"
          actionHref="/setor"
        />
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => (
            <Link
              key={item.id}
              href={`/nota/setor/${item.id}`}
              className="block p-5 sm:p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-sm hover:shadow-md hover:border-[#0B636B]/30 transition-all duration-200 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0B636B]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0B636B] flex items-center justify-center font-bold">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm sm:text-base text-[#0B636B] group-hover:text-[#64B60A] transition-colors">
                      {item.kodeSetor}
                    </h3>
                    <p className="text-xs text-[#0B636B]/60 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.tanggal)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <StatusBadge status={item.status} type="setor" />
                  <ChevronRight className="w-5 h-5 text-[#0B636B]/40 group-hover:text-[#0B636B] group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Items Summary & Points */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-[#0B636B]/70 font-semibold">
                    {item.detailSetors.length} Jenis Sampah Terdaftar:
                  </p>
                  <p className="text-xs text-[#0B636B] font-medium truncate max-w-md">
                    {item.detailSetors
                      .map((d) => `${d.namaKategori} (${d.beratKgReal ?? d.beratKg} kg)`)
                      .join(", ")}
                  </p>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#0B636B]/10">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#0B636B]/60">
                      Total Berat
                    </p>
                    <p className="font-display font-bold text-sm sm:text-base text-[#0B636B]">
                      {item.totalBeratKg} kg
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-[#0B636B]/60">
                      Total Poin
                    </p>
                    <p className="font-display font-bold text-sm sm:text-base text-[#64B60A]">
                      +{item.totalPoin} Poin
                    </p>
                  </div>
                </div>
              </div>

              {item.catatanAdmin && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs">
                  <span className="font-bold">Catatan Petugas:</span> {item.catatanAdmin}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
