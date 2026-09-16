"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { DataTable, Column } from "@/components/admin/DataTable";
import { MonthPicker } from "@/components/admin/MonthPicker";
import { VerifySetorModal } from "@/components/admin/VerifySetorModal";
import {
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Search,
  Scale,
  Calendar,
  Coins,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  X,
} from "lucide-react";

interface SetoranItem {
  id: string;
  kodeSetor: string;
  tanggal: string;
  status: "menunggu_konfirmasi" | "diverifikasi" | "ditolak" | "selesai";
  totalBeratKg: number;
  totalPoin: number;
  catatan?: string;
  catatanAdmin?: string;
  nasabah: {
    id: string;
    namaNasabah: string;
    telp: string;
    alamat?: string;
  };
  items?: any[];
}

export default function DataSetoranPage() {
  const queryClient = useQueryClient();

  // Filters state
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal state
  const [selectedSetorId, setSelectedSetorId] = useState<string | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);

  // Fetch setoran list
  const {
    data: rawSetoranList = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-setoran-list", selectedMonth, statusFilter],
    queryFn: async () => {
      let url = `/setor-sampah/admin/list?bulan=${selectedMonth}`;
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }
      const res = await apiClient<{ data: SetoranItem[] }>(url);
      return res.data || [];
    },
  });

  // Client-side search filtering by kodeSetor, namaNasabah, or telp
  const filteredSetoran = useMemo(() => {
    return rawSetoranList.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchKode = item.kodeSetor?.toLowerCase().includes(q);
      const matchNama = item.nasabah?.namaNasabah?.toLowerCase().includes(q);
      const matchTelp = item.nasabah?.telp?.includes(q);
      return matchKode || matchNama || matchTelp;
    });
  }, [rawSetoranList, searchQuery]);

  // Derived metrics for summary cards
  const metrics = useMemo(() => {
    const total = rawSetoranList.length;
    const pending = rawSetoranList.filter((s) => s.status === "menunggu_konfirmasi").length;
    const verified = rawSetoranList.filter((s) => s.status === "diverifikasi" || s.status === "selesai").length;
    const kg = rawSetoranList.reduce((acc, s) => acc + Number(s.totalBeratKg || 0), 0);
    const poin = rawSetoranList.reduce((acc, s) => acc + Number(s.totalPoin || 0), 0);
    return { total, pending, verified, kg, poin };
  }, [rawSetoranList]);

  const handleCopy = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenVerify = (id: string) => {
    setSelectedSetorId(id);
    setIsVerifyModalOpen(true);
  };

  const handleCloseVerify = () => {
    setSelectedSetorId(null);
    setIsVerifyModalOpen(false);
  };

  const handleSuccessVerify = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-setoran-list"] });
    queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-deposits"] });
    queryClient.invalidateQueries({ queryKey: ["admin-recent-setoran"] });
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "menunggu_konfirmasi":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Menunggu</span>
          </span>
        );
      case "diverifikasi":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Diverifikasi</span>
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#B6F022]/20 text-[#0B636B] border border-[#64B60A]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>Selesai</span>
          </span>
        );
      case "ditolak":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const columns: Column<SetoranItem>[] = [
    {
      header: "Kode & Tanggal",
      cell: (item: SetoranItem) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs text-[#0B636B]">
              {item.kodeSetor}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(item.kodeSetor)}
              className="p-1 rounded-md text-[#0B636B]/60 hover:text-[#0B636B] hover:bg-[#EFF0EB] transition-colors"
              title="Salin kode setor"
            >
              {copiedCode === item.kodeSetor ? (
                <Check className="w-3 h-3 text-[#64B60A]" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
          <div className="text-[11px] text-[#0B636B]/60 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(item.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Nasabah",
      cell: (item: SetoranItem) => (
        <div>
          <p className="font-bold text-xs text-[#0B636B]">
            {item.nasabah?.namaNasabah || "-"}
          </p>
          <p className="text-[11px] text-[#0B636B]/60 font-mono">
            {item.nasabah?.telp || "-"}
          </p>
        </div>
      ),
    },
    {
      header: "Berat Timbangan",
      cell: (item: SetoranItem) => (
        <div className="flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-[#64B60A]" />
          <span className="font-extrabold text-xs text-[#0B636B]">
            {Number(item.totalBeratKg || 0).toLocaleString("id-ID")} kg
          </span>
        </div>
      ),
    },
    {
      header: "Poin Diterbitkan",
      cell: (item: SetoranItem) => (
        <div className="flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 text-[#64B60A]" />
          <span className="font-bold text-xs text-[#0B636B]">
            +{Number(item.totalPoin || 0).toLocaleString("id-ID")} Poin
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (item: SetoranItem) => renderStatusBadge(item.status),
    },
    {
      header: "Tindakan",
      cell: (item: SetoranItem) => {
        const isActionable = item.status === "menunggu_konfirmasi" || item.status === "diverifikasi";

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenVerify(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActionable
                  ? "bg-[#0B636B] hover:bg-[#084b51] text-[#B6F022] shadow-sm shadow-[#0B636B]/20 active:scale-95"
                  : "bg-[#EFF0EB] hover:bg-[#e4e6de] text-[#0B636B]/80"
              }`}
            >
              {isActionable ? "Verifikasi" : "Detail"}
            </button>
            <Link
              href={`/nota/setor/${item.id}`}
              className="p-1.5 rounded-xl bg-white hover:bg-[#EFF0EB] border border-[#0B636B]/15 text-[#0B636B] transition-colors"
              title="Buka Struk / Nota"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-[#0B636B]/10 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F022]/20 text-[#0B636B] text-xs font-bold mb-2">
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Pemeriksaan & Validasi Sampah</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0B636B] tracking-tight">
            Data Setoran Sampah
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-1">
            Validasi timbangan riil sampah nasabah, sesuaikan berat kategori, dan terbitkan poin sirkular Trashly.
          </p>
        </div>

        {/* Month Selector Filter & Refresh */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <MonthPicker
            value={selectedMonth}
            onChange={(m) => setSelectedMonth(m)}
          />
          <button
            type="button"
            onClick={() => refetch()}
            title="Segarkan data"
            className="p-2.5 rounded-2xl bg-white border border-[#0B636B]/15 text-[#0B636B] hover:bg-[#EFF0EB] hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-[#64B60A]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Interactive Metric Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Total Pengajuan</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#0B636B]">
            {metrics.total} <span className="text-xs font-normal opacity-70">Setoran</span>
          </div>
          <div className="text-[10px] text-[#0B636B]/60">Periode terpilih</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-amber-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-800">Menunggu Timbang</span>
            {metrics.pending > 0 && (
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-amber-800">
            {metrics.pending} <span className="text-xs font-normal opacity-70">Antrean</span>
          </div>
          <div className="text-[10px] text-amber-700 font-medium">Perlu penimbangan riil</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#64B60A]/20 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Tonase Terkumpul</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#64B60A]">
            {metrics.kg.toLocaleString("id-ID")} <span className="text-xs font-normal opacity-70">kg</span>
          </div>
          <div className="text-[10px] text-[#0B636B]/60">Sampah sirkular tervalidasi</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B6F022]/40 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Poin Diterbitkan</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#0B636B]">
            +{metrics.poin.toLocaleString("id-ID")} <span className="text-xs font-normal opacity-70">Poin</span>
          </div>
          <div className="text-[10px] text-[#64B60A] font-semibold">Reward nasabah aktif</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B636B]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode setor, nama nasabah, telp..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/12 text-[#0B636B] placeholder:text-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#0B636B]/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B636B]/40 hover:text-[#0B636B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { key: "all", label: "Semua", count: rawSetoranList.length },
            { key: "menunggu_konfirmasi", label: "Menunggu", count: metrics.pending },
            { key: "diverifikasi", label: "Diverifikasi", count: rawSetoranList.filter(s => s.status === "diverifikasi").length },
            { key: "selesai", label: "Selesai", count: rawSetoranList.filter(s => s.status === "selesai").length },
            { key: "ditolak", label: "Ditolak", count: rawSetoranList.filter(s => s.status === "ditolak").length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                statusFilter === tab.key
                  ? "bg-[#0B636B] text-[#B6F022] shadow-sm shadow-[#0B636B]/20"
                  : "bg-[#EFF0EB]/70 text-[#0B636B]/70 hover:bg-[#EFF0EB] hover:text-[#0B636B]"
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-[#0B636B]/12 shadow-sm p-4 sm:p-6">
        <DataTable
          columns={columns}
          data={filteredSetoran}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyTitle="Tidak Ada Setoran"
          emptyDescription="Tidak ada data transaksi setoran untuk periode dan status ini."
        />
      </div>

      {/* Verify Setoran Modal */}
      {selectedSetorId && (
        <VerifySetorModal
          isOpen={isVerifyModalOpen}
          onClose={handleCloseVerify}
          setorId={selectedSetorId}
          onSuccess={handleSuccessVerify}
        />
      )}
    </div>
  );
}
