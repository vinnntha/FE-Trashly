"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { DataTable, Column } from "@/components/admin/DataTable";
import { MonthPicker } from "@/components/admin/MonthPicker";
import { VerifySetorModal } from "@/components/admin/VerifySetorModal";
import {
  ArrowDownToLine,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Search,
  Scale,
  Calendar,
  AlertCircle,
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

  // Modal state
  const [selectedSetorId, setSelectedSetorId] = useState<string | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);

  // Fetch setoran list
  const {
    data: rawSetoranList = [],
    isLoading,
    isError,
    refetch,
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

  // Client-side search filtering by kodeSetor or namaNasabah
  const filteredSetoran = rawSetoranList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchKode = item.kodeSetor?.toLowerCase().includes(q);
    const matchNama = item.nasabah?.namaNasabah?.toLowerCase().includes(q);
    const matchTelp = item.nasabah?.telp?.includes(q);
    return matchKode || matchNama || matchTelp;
  });

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
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "menunggu_konfirmasi":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Menunggu</span>
          </span>
        );
      case "diverifikasi":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200/80">
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
          <div className="font-mono font-bold text-xs text-[#0B636B]">
            {item.kodeSetor}
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
          <p className="text-[11px] text-[#0B636B]/60">
            {item.nasabah?.telp || "-"}
          </p>
        </div>
      ),
    },
    {
      header: "Estimasi / Berat",
      cell: (item: SetoranItem) => (
        <div className="flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-[#64B60A]" />
          <span className="font-semibold text-xs text-[#0B636B]">
            {Number(item.totalBeratKg || 0).toLocaleString("id-ID")} kg
          </span>
        </div>
      ),
    },
    {
      header: "Perolehan Poin",
      cell: (item: SetoranItem) => (
        <span className="font-bold text-xs text-[#0B636B]">
          +{Number(item.totalPoin || 0).toLocaleString("id-ID")} Poin
        </span>
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
          <button
            type="button"
            onClick={() => handleOpenVerify(item.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              isActionable
                ? "bg-[#0B636B] hover:bg-[#084b51] text-white shadow-sm shadow-[#0B636B]/20 active:scale-95"
                : "bg-[#EFF0EB] hover:bg-[#e4e6de] text-[#0B636B]/80"
            }`}
          >
            {isActionable ? "Verifikasi" : "Lihat Detail"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F022]/20 text-[#0B636B] text-xs font-bold mb-2">
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Pemeriksaan Setoran Sampah</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B] tracking-tight">
            Data Setoran Sampah
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-1">
            Validasi timbangan riil sampah dari nasabah, sesuaikan berat per item, terbitkan poin reward.
          </p>
        </div>

        {/* Month Selector Filter */}
        <div>
          <MonthPicker
            value={selectedMonth}
            onChange={(m) => setSelectedMonth(m)}
          />
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
            placeholder="Cari kode setor, nama nasabah..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/12 text-[#0B636B] placeholder:text-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#0B636B]/20"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { key: "all", label: "Semua" },
            { key: "menunggu_konfirmasi", label: "Menunggu" },
            { key: "diverifikasi", label: "Diverifikasi" },
            { key: "selesai", label: "Selesai" },
            { key: "ditolak", label: "Ditolak" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                statusFilter === tab.key
                  ? "bg-[#0B636B] text-white shadow-sm shadow-[#0B636B]/20"
                  : "bg-[#EFF0EB]/70 text-[#0B636B]/70 hover:bg-[#EFF0EB] hover:text-[#0B636B]"
              }`}
            >
              {tab.label}
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
