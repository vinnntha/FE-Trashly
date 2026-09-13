"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";
import { getImageUrl } from "@/lib/image";
import { DataTable, Column } from "@/components/admin/DataTable";
import { MonthPicker } from "@/components/admin/MonthPicker";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  ArrowLeftRight,
  Gift,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Coins,
  Building2,
  Phone,
  User,
} from "lucide-react";

interface PenukaranItem {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  status: "menunggu" | "selesai" | "dibatalkan";
  jumlah: number;
  totalPoin: number;
  nasabah: {
    id: string;
    namaNasabah: string;
    telp: string;
  };
  hadiah: {
    id: string;
    namaHadiah: string;
    kategori: string;
    poinDibutuhkan: number;
    foto?: string;
  };
}

export default function DataPenukaranPage() {
  const queryClient = useQueryClient();

  // Filter state
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Confirmation dialog state for completing redemption
  const [selectedPenukaran, setSelectedPenukaran] = useState<PenukaranItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  // Fetch list penukaran
  const {
    data: rawPenukaranList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-penukaran-list", selectedMonth],
    queryFn: async () => {
      const res = await apiClient<{ data: PenukaranItem[] }>(
        `/penukaran-poin/admin/list?bulan=${selectedMonth}`
      );
      return res.data || [];
    },
  });

  // Complete mutation
  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient(`/penukaran-poin/admin/status/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "selesai" }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-penukaran-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      setIsConfirmOpen(false);
      setSelectedPenukaran(null);
    },
  });

  const handleOpenConfirm = (item: PenukaranItem) => {
    setSelectedPenukaran(item);
    setIsConfirmOpen(true);
  };

  const handleConfirmSelesai = async () => {
    if (!selectedPenukaran) return;
    await completeMutation.mutateAsync(selectedPenukaran.id);
  };

  // Filter query
  const filteredList = rawPenukaranList.filter((item) => {
    // Filter status if not 'all'
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }

    // Filter search text
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchKode = item.kodePenukaran?.toLowerCase().includes(q);
    const matchNasabah = item.nasabah?.namaNasabah?.toLowerCase().includes(q);
    const matchHadiah = item.hadiah?.namaHadiah?.toLowerCase().includes(q);
    return matchKode || matchNasabah || matchHadiah;
  });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "menunggu":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Menunggu Penyerahan</span>
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#B6F022]/20 text-[#0B636B] border border-[#64B60A]/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>Diserahkan / Selesai</span>
          </span>
        );
      case "dibatalkan":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            Dibatalkan
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

  const columns: Column<PenukaranItem>[] = [
    {
      header: "Kode & Tanggal",
      cell: (item: PenukaranItem) => (
        <div>
          <span className="font-mono font-bold text-xs text-[#0B636B]">
            {item.kodePenukaran}
          </span>
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
      cell: (item: PenukaranItem) => (
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
      header: "Hadiah / Voucher",
      cell: (item: PenukaranItem) => (
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-[#EFF0EB] overflow-hidden shrink-0 border border-[#0B636B]/10">
            {item.hadiah?.foto ? (
              <Image
                src={getImageUrl(item.hadiah.foto)}
                alt={item.hadiah.namaHadiah}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#0B636B]/40">
                <Gift className="w-4 h-4" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-xs text-[#0B636B] leading-tight">
              {item.hadiah?.namaHadiah}
            </p>
            <span className="text-[10px] text-[#0B636B]/60">
              Jumlah: {item.jumlah} unit
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Poin Ditukar",
      cell: (item: PenukaranItem) => (
        <div className="flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-bold text-xs text-[#0B636B]">
            {Number(item.totalPoin || 0).toLocaleString("id-ID")} Poin
          </span>
        </div>
      ),
    },
    {
      header: "Status Klaim",
      cell: (item: PenukaranItem) => renderStatusBadge(item.status),
    },
    {
      header: "Tindakan",
      cell: (item: PenukaranItem) => {
        if (item.status === "selesai") {
          return (
            <span className="text-xs text-[#64B60A] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tuntas
            </span>
          );
        }

        return (
          <button
            type="button"
            onClick={() => handleOpenConfirm(item)}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#64B60A] hover:bg-[#579e09] text-white shadow-sm shadow-[#64B60A]/20 transition-all active:scale-95 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tandai Selesai</span>
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
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Klaim & Penukaran Hadiah</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B] tracking-tight">
            Data Penukaran Hadiah
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-1">
            Pantau permohonan penukaran poin nasabah dan validasi penyerahan barang fisik atau voucher hadiah.
          </p>
        </div>

        {/* Month Picker */}
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
            placeholder="Cari kode, nama nasabah, hadiah..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/12 text-[#0B636B] placeholder:text-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#0B636B]/20"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { key: "all", label: "Semua" },
            { key: "menunggu", label: "Menunggu Penyerahan" },
            { key: "selesai", label: "Selesai" },
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
          data={filteredList}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyTitle="Tidak Ada Penukaran"
          emptyDescription="Tidak ada data permohonan penukaran hadiah untuk periode ini."
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Penyerahan Hadiah"
        message={`Apakah Anda yakin hadiah "${selectedPenukaran?.hadiah?.namaHadiah}" (${selectedPenukaran?.jumlah} unit) telah diserahkan langsung kepada nasabah "${selectedPenukaran?.nasabah?.namaNasabah}"? Tindakan ini akan menyelesaikan status penukaran.`}
        confirmLabel={completeMutation.isPending ? "Menyimpan..." : "Ya, Tandai Selesai"}
        cancelLabel="Batal"
        variant="warning"
        isLoading={completeMutation.isPending}
        onConfirm={handleConfirmSelesai}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedPenukaran(null);
        }}
      />
    </div>
  );
}
