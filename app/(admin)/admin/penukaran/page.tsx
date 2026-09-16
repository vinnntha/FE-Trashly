"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  X,
} from "lucide-react";

interface PenukaranItem {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  status: "diproses" | "menunggu" | "selesai" | "dibatalkan";
  jumlah?: number;
  poinTerpakai: number;
  nasabah: {
    id: string;
    namaNasabah: string;
    telp: string;
  };
  hadiah: {
    id: string;
    namaHadiah: string;
    kategori?: string;
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Confirmation dialog state for completing redemption
  const [selectedPenukaran, setSelectedPenukaran] = useState<PenukaranItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  // Fetch list penukaran
  const {
    data: rawPenukaranList = [],
    isLoading,
    refetch,
    isFetching,
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
      queryClient.invalidateQueries({ queryKey: ["admin-recent-penukaran"] });
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

  const handleCopy = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = rawPenukaranList.length;
    const pending = rawPenukaranList.filter(
      (i) => i.status === "diproses" || i.status === "menunggu"
    ).length;
    const selesai = rawPenukaranList.filter((i) => i.status === "selesai").length;
    const poin = rawPenukaranList.reduce(
      (acc, i) => acc + Number(i.poinTerpakai || 0),
      0
    );
    return { total, pending, selesai, poin };
  }, [rawPenukaranList]);

  // Filter query
  const filteredList = useMemo(() => {
    return rawPenukaranList.filter((item) => {
      // Filter status
      if (statusFilter === "pending") {
        if (item.status !== "diproses" && item.status !== "menunggu") return false;
      } else if (statusFilter === "selesai") {
        if (item.status !== "selesai") return false;
      }

      // Filter search text
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchKode = item.kodePenukaran?.toLowerCase().includes(q);
      const matchNasabah = item.nasabah?.namaNasabah?.toLowerCase().includes(q);
      const matchTelp = item.nasabah?.telp?.includes(q);
      const matchHadiah = item.hadiah?.namaHadiah?.toLowerCase().includes(q);
      return matchKode || matchNasabah || matchTelp || matchHadiah;
    });
  }, [rawPenukaranList, statusFilter, searchQuery]);

  const renderStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "diproses" || s === "menunggu") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>Diproses / Menunggu</span>
        </span>
      );
    }
    if (s === "selesai") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#B6F022]/20 text-[#0B636B] border border-[#64B60A]/40">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#64B60A]" />
          <span>Diserahkan / Selesai</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
        {status}
      </span>
    );
  };

  const columns: Column<PenukaranItem>[] = [
    {
      header: "Kode & Tanggal",
      cell: (item: PenukaranItem) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs text-[#0B636B]">
              {item.kodePenukaran}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(item.kodePenukaran)}
              className="p-1 rounded-md text-[#0B636B]/60 hover:text-[#0B636B] hover:bg-[#EFF0EB] transition-colors"
              title="Salin kode penukaran"
            >
              {copiedCode === item.kodePenukaran ? (
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
      cell: (item: PenukaranItem) => (
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
      header: "Hadiah / Voucher",
      cell: (item: PenukaranItem) => (
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-[#EFF0EB] overflow-hidden shrink-0 border border-[#0B636B]/10">
            {item.hadiah?.foto ? (
              <Image
                src={getImageUrl(item.hadiah.foto)}
                alt={item.hadiah.namaHadiah}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#0B636B]/40">
                <Gift className="w-4 h-4" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-xs text-[#0B636B] leading-tight">
              {item.hadiah?.namaHadiah}
            </p>
            <span className="text-[10px] text-[#0B636B]/60">
              Biaya: {item.hadiah?.poinDibutuhkan?.toLocaleString("id-ID")} Poin
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Poin Terpakai",
      cell: (item: PenukaranItem) => (
        <div className="flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-extrabold text-xs text-[#0B636B]">
            -{Number(item.poinTerpakai || 0).toLocaleString("id-ID")} Poin
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
        const isPending = item.status === "diproses" || item.status === "menunggu";

        return (
          <div className="flex items-center gap-2">
            {isPending ? (
              <button
                type="button"
                onClick={() => handleOpenConfirm(item)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0B636B] hover:bg-[#084b51] text-[#B6F022] shadow-sm shadow-[#0B636B]/20 transition-all active:scale-95 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Serahkan</span>
              </button>
            ) : (
              <span className="text-xs text-[#64B60A] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tuntas</span>
              </span>
            )}
            <Link
              href={`/nota/tukar/${item.id}`}
              className="p-1.5 rounded-xl bg-white hover:bg-[#EFF0EB] border border-[#0B636B]/15 text-[#0B636B] transition-colors"
              title="Buka Struk Penukaran"
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
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Klaim & Penyerahan Reward</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0B636B] tracking-tight">
            Data Penukaran Hadiah
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-1">
            Pantau permohonan klaim reward nasabah dan validasi penyerahan barang fisik atau voucher hadiah.
          </p>
        </div>

        {/* Month Picker & Refresh */}
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

      {/* Metric Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Total Penukaran</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#0B636B]">
            {metrics.total} <span className="text-xs font-normal opacity-70">Klaim</span>
          </div>
          <div className="text-[10px] text-[#0B636B]/60">Periode terpilih</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-amber-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-800">Menunggu Serah</span>
            {metrics.pending > 0 && (
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-amber-800">
            {metrics.pending} <span className="text-xs font-normal opacity-70">Antrean</span>
          </div>
          <div className="text-[10px] text-amber-700 font-medium">Perlu validasi fisik</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#64B60A]/20 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Selesai Diserahkan</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#64B60A]">
            {metrics.selesai} <span className="text-xs font-normal opacity-70">Tuntas</span>
          </div>
          <div className="text-[10px] text-[#0B636B]/60">Penyerahan sukses</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B6F022]/40 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Poin Ditukarkan</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#0B636B]">
            {metrics.poin.toLocaleString("id-ID")} <span className="text-xs font-normal opacity-70">Poin</span>
          </div>
          <div className="text-[10px] text-[#64B60A] font-semibold">Telah ditebus nasabah</div>
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
            placeholder="Cari kode, nasabah, hadiah..."
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
            { key: "all", label: "Semua", count: rawPenukaranList.length },
            { key: "pending", label: "Menunggu Serah", count: metrics.pending },
            { key: "selesai", label: "Selesai", count: metrics.selesai },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
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
          data={filteredList}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyTitle="Tidak Ada Penukaran"
          emptyDescription="Belum ada catatan klaim penukaran hadiah pada periode dan status ini."
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSelesai}
        title="Konfirmasi Penyerahan Hadiah"
        message={`Pastikan hadiah "${selectedPenukaran?.hadiah?.namaHadiah}" telah diserahkan secara langsung kepada nasabah "${selectedPenukaran?.nasabah?.namaNasabah}". Tindakan ini akan menyelesaikan klaim transaksi.`}
        confirmLabel={completeMutation.isPending ? "Menyimpan..." : "Ya, Tandai Selesai"}
        cancelLabel="Batal"
        variant="warning"
        isLoading={completeMutation.isPending}
      />
    </div>
  );
}
