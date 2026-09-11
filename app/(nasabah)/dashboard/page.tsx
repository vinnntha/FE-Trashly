"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import SummaryCard from "@/components/nasabah/SummaryCard";
import StatusBadge from "@/components/nasabah/StatusBadge";
import SkeletonCard from "@/components/nasabah/SkeletonCard";
import EmptyState from "@/components/nasabah/EmptyState";
import {
  Scale,
  Sparkles,
  Gift,
  ArrowRight,
  History,
  Recycle,
  Calendar,
  Layers,
} from "lucide-react";

interface DashboardSummaryData {
  saldoPoinSaatIni: number;
  totalSampahDisetorKg: number;
  totalPoinDidapat: number;
  totalPoinDitukar: number;
  transaksiTerakhirSetor: {
    kodeSetor: string;
    tanggal: string;
    beratKg: number;
    poin: number;
    status: string;
  } | null;
  transaksiTerakhirTukar: {
    kodePenukaran: string;
    tanggal: string;
    namaHadiah: string;
    poinTerpakai: number;
    status: string;
  } | null;
}

export default function NasabahDashboardPage() {
  const { user } = useAuth();

  const {
    data: summaryRes,
    isLoading,
    isError,
    refetch,
  } = useQuery<{ message: string; data: DashboardSummaryData }>({
    queryKey: ["dashboard-summary"],
    queryFn: () => apiClient<{ message: string; data: DashboardSummaryData }>("/dashboard/summary"),
  });

  const summary = summaryRes?.data;
  const nasabahName = user?.nasabah?.namaNasabah || user?.username || "Nasabah";

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="space-y-2">
          <div className="w-48 h-8 bg-white/70 rounded-2xl animate-pulse" />
          <div className="w-72 h-4 bg-white/50 rounded-xl animate-pulse" />
        </div>
        <SkeletonCard variant="summary" />
        <SkeletonCard variant="stats" />
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="py-12">
        <EmptyState
          title="Gagal Memuat Data Dashboard"
          description="Terjadi kendala saat menghubungkan ke server Trashly. Silakan coba muat ulang halaman."
          actionLabel="Muat Ulang"
          onAction={() => refetch()}
        />
      </div>
    );
  }

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
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>Beranda Nasabah</span>
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B636B] tracking-tight">
            Halo, {nasabahName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/75 mt-1">
            Pantau perolehan poin sampah terpilah dan tukarkan reward nyata hari ini.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/kategori-sampah"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-white/80 border border-[#0B636B]/15 text-[#0B636B] text-xs font-semibold transition-colors shadow-sm"
          >
            <Layers className="w-4 h-4 text-[#64B60A]" />
            <span>Kategori Sampah</span>
          </Link>

          <Link
            href="/setor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            <span>Setor Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Saldo Poin Card */}
      <SummaryCard
        saldoPoin={summary.saldoPoinSaatIni}
        nasabahName={nasabahName}
        nasabahId={user?.nasabah?.id}
      />

      {/* 3 Mini Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Stat 1: Total Sampah */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#0B636B]/70 uppercase tracking-wider">
              Total Sampah Disetor
            </p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#0B636B]">
                {summary.totalSampahDisetorKg.toLocaleString("id-ID")}
              </span>
              <span className="text-xs font-semibold text-[#0B636B]/70">KG</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0B636B] flex items-center justify-center border border-teal-100 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2: Total Poin Didapat */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#0B636B]/70 uppercase tracking-wider">
              Total Poin Didapat
            </p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#64B60A]">
                +{summary.totalPoinDidapat.toLocaleString("id-ID")}
              </span>
              <span className="text-xs font-semibold text-[#64B60A]">POIN</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#CFE26C]/30 text-[#64B60A] flex items-center justify-center border border-[#64B60A]/20 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Total Poin Ditukar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#0B636B]/70 uppercase tracking-wider">
              Total Poin Ditukar
            </p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-display font-bold text-2xl sm:text-3xl text-amber-700">
                {summary.totalPoinDitukar.toLocaleString("id-ID")}
              </span>
              <span className="text-xs font-semibold text-amber-700/80">POIN</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
            <Gift className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Section: Transaksi Terakhir (Setor & Tukar) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg sm:text-xl text-[#0B636B] flex items-center gap-2">
            <History className="w-5 h-5 text-[#64B60A]" />
            <span>Aktivitas Transaksi Terakhir</span>
          </h2>
          <Link
            href="/riwayat"
            className="text-xs font-semibold text-[#0B636B] hover:text-[#64B60A] transition-colors flex items-center gap-1"
          >
            <span>Semua Riwayat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Setoran Terakhir */}
          <div className="p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-sm flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0B636B] flex items-center justify-center">
                    <Recycle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-[#0B636B]">Setoran Terakhir</span>
                </div>
                {summary.transaksiTerakhirSetor && (
                  <StatusBadge
                    status={summary.transaksiTerakhirSetor.status}
                    type="setor"
                  />
                )}
              </div>

              {summary.transaksiTerakhirSetor ? (
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs text-[#0B636B]/70">
                      {summary.transaksiTerakhirSetor.kodeSetor}
                    </span>
                    <span className="text-xs text-[#0B636B]/60 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(summary.transaksiTerakhirSetor.tanggal)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EFF0EB]/70 border border-[#0B636B]/10 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#0B636B]/70">Berat Sampah</p>
                      <p className="font-bold text-sm text-[#0B636B]">
                        {summary.transaksiTerakhirSetor.beratKg} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-[#0B636B]/70">Poin Diperoleh</p>
                      <p className="font-bold text-sm text-[#64B60A]">
                        +{summary.transaksiTerakhirSetor.poin} Poin
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-[#0B636B]/65">
                    Belum ada riwayat setoran sampah.
                  </p>
                  <Link
                    href="/setor"
                    className="inline-block mt-2 text-xs font-bold text-[#64B60A] hover:underline"
                  >
                    Ajukan Setoran Pertama →
                  </Link>
                </div>
              )}
            </div>

            {summary.transaksiTerakhirSetor && (
              <div className="pt-3 mt-3 border-t border-[#0B636B]/10 flex justify-end">
                <Link
                  href="/riwayat"
                  className="text-xs font-bold text-[#0B636B] hover:text-[#64B60A] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Lihat Detail Nota</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Card Penukaran Terakhir */}
          <div className="p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-sm flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-[#0B636B]">Penukaran Terakhir</span>
                </div>
                {summary.transaksiTerakhirTukar && (
                  <StatusBadge
                    status={summary.transaksiTerakhirTukar.status}
                    type="penukaran"
                  />
                )}
              </div>

              {summary.transaksiTerakhirTukar ? (
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs text-[#0B636B]/70">
                      {summary.transaksiTerakhirTukar.kodePenukaran}
                    </span>
                    <span className="text-xs text-[#0B636B]/60 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(summary.transaksiTerakhirTukar.tanggal)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EFF0EB]/70 border border-[#0B636B]/10 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#0B636B]/70">Hadiah Ditukar</p>
                      <p className="font-bold text-sm text-[#0B636B] truncate max-w-[150px] sm:max-w-xs">
                        {summary.transaksiTerakhirTukar.namaHadiah}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-[#0B636B]/70">Poin Digunakan</p>
                      <p className="font-bold text-sm text-amber-700">
                        -{summary.transaksiTerakhirTukar.poinTerpakai} Poin
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-[#0B636B]/65">
                    Belum ada riwayat penukaran hadiah.
                  </p>
                  <Link
                    href="/hadiah"
                    className="inline-block mt-2 text-xs font-bold text-[#64B60A] hover:underline"
                  >
                    Buka Katalog Hadiah →
                  </Link>
                </div>
              )}
            </div>

            {summary.transaksiTerakhirTukar && (
              <div className="pt-3 mt-3 border-t border-[#0B636B]/10 flex justify-end">
                <Link
                  href="/hadiah/riwayat"
                  className="text-xs font-bold text-[#0B636B] hover:text-[#64B60A] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Lihat Histori Penukaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
