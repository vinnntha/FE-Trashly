"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/image";
import StatusBadge from "@/components/nasabah/StatusBadge";
import SkeletonCard from "@/components/nasabah/SkeletonCard";
import EmptyState from "@/components/nasabah/EmptyState";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  ArrowRight,
  Search,
  Scale,
  Gift,
  PlusCircle,
  History,
  Recycle,
  Layers,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  ChevronRight,
  TrendingUp,
  TreePine,
  Zap,
  Leaf,
  Coins,
  ArrowUpRight,
} from "lucide-react";

// Types
interface DetailSetorItem {
  id: string;
  kategoriSampahId: string;
  namaKategori: string;
  jenis: string;
  beratKg: number;
  beratKgReal?: number | null;
  subtotalPoin: number;
}

interface SetorItem {
  id: string;
  kodeSetor: string;
  tanggal: string;
  status: string;
  totalBeratKg: number;
  totalPoin: number;
  catatan?: string | null;
  catatanAdmin?: string | null;
  detailSetors?: DetailSetorItem[];
}

interface PenukaranItem {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  poinTerpakai: number;
  status: string;
  hadiah?: {
    id: string;
    namaHadiah: string;
    poinDibutuhkan: number;
    stok?: number;
    foto?: string | null;
  };
}

interface HadiahItem {
  id: string;
  namaHadiah: string;
  poinDibutuhkan: number;
  stok: number;
  deskripsi?: string;
  foto?: string | null;
}

interface KategoriItem {
  id: string;
  namaKategori: string;
  jenis: string;
  hargaPerKg: number;
  poinPerKg: number;
  deskripsi?: string;
}

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

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function formatDateIndo(isoString?: string): string {
  if (!isoString) return "-";
  try {
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

// Tooltip declared outside component to comply with React Compiler
interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      label: string;
      date: string;
      kg: number;
      poin: number;
    };
  }>;
}

function NasabahChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#0B636B] text-white p-3.5 rounded-2xl shadow-xl border border-white/15 text-xs min-w-[170px]">
      <p className="font-bold text-[#B6F022] mb-1.5 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-[#CFE26C]" />
        <span>{d.label} ({d.date})</span>
      </p>
      <div className="space-y-1 pt-1 border-t border-white/15">
        <div className="flex items-center justify-between text-white/80">
          <span>Berat Sampah:</span>
          <span className="font-bold text-white">{d.kg} kg</span>
        </div>
        <div className="flex items-center justify-between text-white/80">
          <span>Poin Diperoleh:</span>
          <span className="font-bold text-[#B6F022]">+{d.poin} Poin</span>
        </div>
      </div>
    </div>
  );
}

export default function NasabahDashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isMounted = useIsMounted();

  // Interactive UI state
  const [chartMetric, setChartMetric] = useState<"kg" | "poin">("kg");
  const [impactTab, setImpactTab] = useState<"co2" | "pohon" | "energi">("co2");
  const [activityTab, setActivityTab] = useState<"setor" | "tukar">("setor");
  const [activityFilter, setActivityFilter] = useState<"all" | "selesai" | "menunggu" | "ditolak">("all");
  const [activitySearch, setActivitySearch] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [dismissPendingAlert, setDismissPendingAlert] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Queries
  const {
    data: summaryRes,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useQuery<{ message: string; data: DashboardSummaryData }>({
    queryKey: ["dashboard-summary"],
    queryFn: () => apiClient<{ message: string; data: DashboardSummaryData }>("/dashboard/summary"),
  });

  const {
    data: mySetoranRes,
    isLoading: setorLoading,
  } = useQuery<{ message: string; data: SetorItem[] }>({
    queryKey: ["my-setoran-all"],
    queryFn: () => apiClient<{ message: string; data: SetorItem[] }>("/setor-sampah/my-setor"),
  });

  const {
    data: myPenukaranRes,
    isLoading: tukarLoading,
  } = useQuery<{ message: string; data: PenukaranItem[] }>({
    queryKey: ["my-penukaran-all"],
    queryFn: () => apiClient<{ message: string; data: PenukaranItem[] }>("/penukaran-poin/my-penukaran"),
  });

  const { data: hadiahRes } = useQuery<{ message: string; data: HadiahItem[] }>({
    queryKey: ["hadiah-list"],
    queryFn: () => apiClient<{ message: string; data: HadiahItem[] }>("/hadiah"),
  });

  const { data: kategoriRes } = useQuery<{ message: string; data: KategoriItem[] }>({
    queryKey: ["kategori-sampah-list"],
    queryFn: () => apiClient<{ message: string; data: KategoriItem[] }>("/kategori-sampah"),
  });

  const summary = summaryRes?.data;
  const setoranList = useMemo(() => mySetoranRes?.data || [], [mySetoranRes?.data]);
  const penukaranList = useMemo(() => myPenukaranRes?.data || [], [myPenukaranRes?.data]);
  const hadiahList = useMemo(() => hadiahRes?.data || [], [hadiahRes?.data]);
  const kategoriList = useMemo(() => kategoriRes?.data || [], [kategoriRes?.data]);

  const nasabahName = user?.nasabah?.namaNasabah || user?.username || "Nasabah";
  const nasabahId = user?.nasabah?.id;

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 11) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  }, []);

  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  // Membership Tier based on total weight
  const totalWeightKg = summary?.totalSampahDisetorKg ?? 0;
  const tierInfo = useMemo(() => {
    if (totalWeightKg >= 150) {
      return { name: "Eco Hero", level: "Tier Diamond", color: "bg-[#B6F022] text-[#0B636B]" };
    }
    if (totalWeightKg >= 50) {
      return { name: "Pahlawan Bumi", level: "Tier Gold", color: "bg-[#CFE26C] text-[#0B636B]" };
    }
    if (totalWeightKg >= 10) {
      return { name: "Pejuang Daur Ulang", level: "Tier Silver", color: "bg-teal-100 text-[#0B636B]" };
    }
    return { name: "Sahabat Hijau", level: "Tier Perintis", color: "bg-[#EFF0EB] text-[#0B636B]" };
  }, [totalWeightKg]);

  // Pending deposits waiting for admin verification
  const pendingSetoran = useMemo(() => {
    return setoranList.filter(
      (item) => (item.status || "").toLowerCase() === "menunggu_konfirmasi"
    );
  }, [setoranList]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
      queryClient.invalidateQueries({ queryKey: ["my-setoran-all"] }),
      queryClient.invalidateQueries({ queryKey: ["my-penukaran-all"] }),
      queryClient.invalidateQueries({ queryKey: ["hadiah-list"] }),
      queryClient.invalidateQueries({ queryKey: ["kategori-sampah-list"] }),
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Copy code feedback
  const handleCopy = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyId = () => {
    if (!nasabahId) return;
    navigator.clipboard.writeText(nasabahId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Trend data for past 7 days derived from real setoran
  const trendData = useMemo(() => {
    const days: Record<string, { date: string; label: string; kg: number; poin: number }> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("id-ID", { weekday: "short" });
      days[dateStr] = { date: dateStr, label, kg: 0, poin: 0 };
    }

    setoranList.forEach((item) => {
      if (!item.tanggal) return;
      const itemDate = new Date(item.tanggal).toISOString().split("T")[0];
      if (days[itemDate]) {
        days[itemDate].kg += Number(item.totalBeratKg || 0);
        days[itemDate].poin += Number(item.totalPoin || 0);
      }
    });

    return Object.values(days);
  }, [setoranList]);

  // Personal Monthly Target (Default: 25 kg)
  const targetGoalKg = 25;
  const currentMonthKg = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return setoranList.reduce((acc, item) => {
      if (!item.tanggal) return acc;
      const d = new Date(item.tanggal);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        return acc + Number(item.totalBeratKg || 0);
      }
      return acc;
    }, 0);
  }, [setoranList]);

  const targetProgress = Math.min(100, Math.round((currentMonthKg / targetGoalKg) * 100));

  // Environmental Impact figures
  const ecoImpact = useMemo(() => {
    const kg = summary?.totalSampahDisetorKg ?? 0;
    return {
      co2: Number((kg * 2.5).toFixed(1)),
      pohon: Number((kg / 20).toFixed(1)),
      energi: Number((kg * 1.8).toFixed(1)),
    };
  }, [summary?.totalSampahDisetorKg]);

  // Filtered Setoran
  const filteredSetoran = useMemo(() => {
    return setoranList.filter((item) => {
      const matchSearch =
        item.kodeSetor.toLowerCase().includes(activitySearch.toLowerCase()) ||
        (item.catatan || "").toLowerCase().includes(activitySearch.toLowerCase());

      const st = (item.status || "").toLowerCase();
      let matchStatus = true;
      if (activityFilter === "selesai") {
        matchStatus = st === "selesai" || st === "diverifikasi";
      } else if (activityFilter === "menunggu") {
        matchStatus = st === "menunggu_konfirmasi";
      } else if (activityFilter === "ditolak") {
        matchStatus = st === "ditolak";
      }

      return matchSearch && matchStatus;
    });
  }, [setoranList, activitySearch, activityFilter]);

  // Filtered Penukaran
  const filteredPenukaran = useMemo(() => {
    return penukaranList.filter((item) => {
      const matchSearch =
        item.kodePenukaran.toLowerCase().includes(activitySearch.toLowerCase()) ||
        (item.hadiah?.namaHadiah || "").toLowerCase().includes(activitySearch.toLowerCase());

      const st = (item.status || "").toLowerCase();
      let matchStatus = true;
      if (activityFilter === "selesai") {
        matchStatus = st === "selesai";
      } else if (activityFilter === "menunggu") {
        matchStatus = st === "diproses";
      } else if (activityFilter === "ditolak") {
        matchStatus = false;
      }

      return matchSearch && matchStatus;
    });
  }, [penukaranList, activitySearch, activityFilter]);

  // Top waste categories sorted by points per kg
  const topKategoriSampah = useMemo(() => {
    return [...kategoriList].sort((a, b) => b.poinPerKg - a.poinPerKg).slice(0, 4);
  }, [kategoriList]);

  // Recommended rewards sorted by affordability or appeal
  const currentSaldo = summary?.saldoPoinSaatIni ?? 0;
  const recommendedRewards = useMemo(() => {
    return [...hadiahList]
      .sort((a, b) => {
        const canAffordA = currentSaldo >= a.poinDibutuhkan ? 1 : 0;
        const canAffordB = currentSaldo >= b.poinDibutuhkan ? 1 : 0;
        return canAffordB - canAffordA || a.poinDibutuhkan - b.poinDibutuhkan;
      })
      .slice(0, 3);
  }, [hadiahList, currentSaldo]);

  if (summaryLoading) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="space-y-2">
          <div className="w-56 h-8 bg-white/70 rounded-2xl animate-pulse" />
          <div className="w-80 h-4 bg-white/50 rounded-xl animate-pulse" />
        </div>
        <SkeletonCard variant="summary" />
        <SkeletonCard variant="stats" />
      </div>
    );
  }

  if (summaryError || !summary) {
    return (
      <div className="py-12">
        <EmptyState
          title="Gagal Memuat halaman Nasabah"
          description="Terjadi kendala saat menghubungkan ke server Trashly. Silakan coba muat ulang."
          actionLabel="Muat Ulang"
          onAction={() => refetchSummary()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B636B] text-[#B6F022] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Halaman Nasabah</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-[#0B636B]/15 ${tierInfo.color}`}>
              {tierInfo.name} ({tierInfo.level})
            </span>
            <span className="text-xs text-[#0B636B]/60 font-medium">
              • {formattedToday}
            </span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B636B] tracking-tight">
            {greeting}, {nasabahName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/75 mt-1">
            Pantau kontribusi pemilahan sampah, pertumbuhan saldo poin, dan reward hijau Anda.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-white/80 border border-[#0B636B]/15 text-[#0B636B] text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-60"
            title="Segarkan Data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#0B636B] ${
                isRefreshing ? "animate-spin text-[#64B60A]" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/hadiah"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-white/80 border border-[#0B636B]/15 text-[#0B636B] text-xs font-semibold transition-colors shadow-sm"
          >
            <Gift className="w-4 h-4 text-[#64B60A]" />
            <span>Katalog Hadiah</span>
          </Link>

          <Link
            href="/setor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#0B636B]" />
            <span>Ajukan Setoran</span>
          </Link>
        </div>
      </div>

      {/* Pending Setoran Alert Banner */}
      {pendingSetoran.length > 0 && !dismissPendingAlert && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#CFE26C]/25 border border-[#64B60A]/30 text-[#0B636B] flex items-start justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#B6F022] text-[#0B636B] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#0B636B] flex items-center gap-2">
                <span>{pendingSetoran.length} Setoran Sedang Menunggu Verifikasi Admin</span>
              </h2>
              <p className="text-xs text-[#0B636B]/80 mt-0.5">
                Setoran terakhir Anda (Kode: <span className="font-mono font-bold">{pendingSetoran[0]?.kodeSetor}</span>) telah terkirim. Admin unit sedang menjadwalkan penimbangan dan validasi fisik sampah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/riwayat"
              className="text-xs font-bold text-[#0B636B] hover:text-[#64B60A] underline underline-offset-4"
            >
              Cek Status
            </Link>
            <button
              type="button"
              onClick={() => setDismissPendingAlert(true)}
              className="p-1 rounded-lg text-[#0B636B]/60 hover:text-[#0B636B] transition-colors"
              aria-label="Tutup Peringatan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section: Asymmetric Dual Cards (Different Layout from Admin) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Trashly Digital Membership Card (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0B636B] text-[#EFF0EB] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(11,99,107,0.35)] border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[310px]">
          {/* Recycle Watermark Motif */}
          <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 pointer-events-none select-none">
            <Recycle className="w-56 h-56 sm:w-64 sm:h-64 text-white" />
          </div>

          <div className="relative z-10">
            {/* Membership Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B6F022]/20 flex items-center justify-center text-[#B6F022] border border-[#B6F022]/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#EFF0EB]/70 leading-none">Kartu Anggota Sampah Digital</p>
                  <p className="text-sm font-bold text-white mt-1">Trashly Green Member</p>
                </div>
              </div>

              {nasabahId && (
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="group inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#CFE26C] border border-white/15 transition-all"
                  title="Salin ID Nasabah"
                >
                  <span>#{nasabahId.slice(0, 8)}...</span>
                  {copiedId ? (
                    <Check className="w-3 h-3 text-[#B6F022]" />
                  ) : (
                    <Copy className="w-3 h-3 text-white/60 group-hover:text-white" />
                  )}
                </button>
              )}
            </div>

            {/* Saldo Poin Display */}
            <div className="my-3 sm:my-4">
              <p className="text-xs font-semibold text-[#EFF0EB]/70 uppercase tracking-wider">
                Saldo Poin Tersedia
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#B6F022] tracking-tight">
                  {Number(summary.saldoPoinSaatIni || 0).toLocaleString("id-ID")}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#CFE26C] tracking-wide">
                  POIN
                </span>
              </div>
              <p className="text-xs text-[#EFF0EB]/75 mt-2">
                Estimasi nilai manfaat setara{" "}
                <span className="font-bold text-white">
                  Rp {(Number(summary.saldoPoinSaatIni || 0) * 100).toLocaleString("id-ID")}
                </span>{" "}
                untuk voucher sembako & e-wallet.
              </p>
            </div>
          </div>

          {/* Card Footer Metrics & Quick Actions */}
          <div className="relative z-10 pt-5 mt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4 text-[#EFF0EB]/80">
              <div>
                <span className="text-[11px] text-[#EFF0EB]/60 block">Poin Didapat</span>
                <span className="font-bold text-[#B6F022]">+{summary.totalPoinDidapat.toLocaleString("id-ID")}</span>
              </div>
              <div className="w-px h-6 bg-white/15" />
              <div>
                <span className="text-[11px] text-[#EFF0EB]/60 block">Poin Ditukar</span>
                <span className="font-bold text-[#CFE26C]">-{summary.totalPoinDitukar.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/setor"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-xs transition-all shadow-sm active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Setor Sampah</span>
              </Link>

              <Link
                href="/hadiah"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-all border border-white/20"
              >
                <Gift className="w-3.5 h-3.5 text-[#CFE26C]" />
                <span>Tukar Reward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Personal Target & Eco-Impact Hub (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between min-h-[310px]">
          <div>
            {/* Target Goal Progress */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0B636B] flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-[#64B60A]" />
                </div>
                <span className="font-bold text-xs uppercase tracking-wider text-[#0B636B]/70">
                  Target Setor Bulan Ini
                </span>
              </div>
              <span className="font-bold text-xs text-[#0B636B]">{targetProgress}%</span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline justify-between">
                <span className="font-display font-extrabold text-2xl text-[#0B636B]">
                  {currentMonthKg.toFixed(1)}{" "}
                  <span className="text-xs font-semibold text-[#0B636B]/60">/ {targetGoalKg} kg</span>
                </span>
                <span className="text-xs font-semibold text-[#64B60A]">
                  {currentMonthKg >= targetGoalKg ? "Target Tercapai!" : `Sisa ${(targetGoalKg - currentMonthKg).toFixed(1)} kg lagi`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-[#EFF0EB] rounded-full mt-2.5 overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#64B60A] via-[#B6F022] to-[#0B636B] rounded-full transition-all duration-500"
                  style={{ width: `${targetProgress}%` }}
                />
              </div>
            </div>

            <div className="my-4 pt-4 border-t border-[#0B636B]/10">
              {/* Eco Impact Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                  Dampak Nyata Untuk Bumi
                </p>
                {/* Metric Selector Pills */}
                <div className="flex p-0.5 rounded-xl bg-[#EFF0EB] border border-[#0B636B]/10 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setImpactTab("co2")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      impactTab === "co2" ? "bg-white text-[#0B636B] shadow-sm font-bold" : "text-[#0B636B]/60"
                    }`}
                  >
                    CO₂
                  </button>
                  <button
                    type="button"
                    onClick={() => setImpactTab("pohon")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      impactTab === "pohon" ? "bg-white text-[#0B636B] shadow-sm font-bold" : "text-[#0B636B]/60"
                    }`}
                  >
                    Pohon
                  </button>
                  <button
                    type="button"
                    onClick={() => setImpactTab("energi")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      impactTab === "energi" ? "bg-white text-[#0B636B] shadow-sm font-bold" : "text-[#0B636B]/60"
                    }`}
                  >
                    Energi
                  </button>
                </div>
              </div>

              {/* Active Impact Metric View */}
              {impactTab === "co2" && (
                <div className="p-3.5 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#CFE26C]/30 text-[#0B636B] flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-[#64B60A]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#0B636B]/70">Emisi Karbon Dicegah</p>
                      <p className="font-display font-bold text-lg text-[#0B636B]">{ecoImpact.co2} kg CO₂e</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#64B60A] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    Eco Certified
                  </span>
                </div>
              )}

              {impactTab === "pohon" && (
                <div className="p-3.5 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <TreePine className="w-5 h-5 text-[#64B60A]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#0B636B]/70">Setara Pohon Ditanam</p>
                      <p className="font-display font-bold text-lg text-[#0B636B]">{ecoImpact.pohon} Pohon Dewasa</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#64B60A] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    Reforestasi
                  </span>
                </div>
              )}

              {impactTab === "energi" && (
                <div className="p-3.5 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[#0B636B]/70">Energi Bersih Dihemat</p>
                      <p className="font-display font-bold text-lg text-[#0B636B]">{ecoImpact.energi} kWh</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                    Hemat Daya
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-[#0B636B]/60 flex items-center gap-1.5 pt-2 border-t border-[#0B636B]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>Kalkulasi otomatis berdasarkan standar daur ulang sirkular Trashly.</span>
          </div>
        </div>
      </div>

      {/* 4 Mini Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Total Sampah */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between hover:border-[#0B636B]/30 transition-colors">
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
            <p className="text-[11px] text-[#0B636B]/60 mt-1">
              Dari {setoranList.length} kali penimbangan
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0B636B] flex items-center justify-center border border-teal-100 shrink-0">
            <Scale className="w-6 h-6 text-[#0B636B]" />
          </div>
        </div>

        {/* Stat 2: Total Poin Didapat */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between hover:border-[#0B636B]/30 transition-colors">
          <div>
            <p className="text-xs font-semibold text-[#0B636B]/70 uppercase tracking-wider">
              Total Poin Diperoleh
            </p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#64B60A]">
                +{summary.totalPoinDidapat.toLocaleString("id-ID")}
              </span>
              <span className="text-xs font-semibold text-[#64B60A]">POIN</span>
            </div>
            <p className="text-[11px] text-[#64B60A] font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Akumulasi seumur hidup</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#CFE26C]/30 text-[#64B60A] flex items-center justify-center border border-[#64B60A]/20 shrink-0">
            <Sparkles className="w-6 h-6 text-[#64B60A]" />
          </div>
        </div>

        {/* Stat 3: Total Poin Ditukar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between hover:border-[#0B636B]/30 transition-colors">
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
            <p className="text-[11px] text-[#0B636B]/60 mt-1">
              {penukaranList.length} klaim reward berhasil
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
            <Gift className="w-6 h-6 text-amber-700" />
          </div>
        </div>

        {/* Stat 4: Total Transaksi */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between hover:border-[#0B636B]/30 transition-colors">
          <div>
            <p className="text-xs font-semibold text-[#0B636B]/70 uppercase tracking-wider">
              Total Aktivitas
            </p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#0B636B]">
                {setoranList.length + penukaranList.length}
              </span>
              <span className="text-xs font-semibold text-[#0B636B]/70">KALI</span>
            </div>
            <p className="text-[11px] text-[#0B636B]/60 mt-1">
              Setoran & penukaran tercatat
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#B6F022]/20 text-[#0B636B] flex items-center justify-center border border-[#B6F022]/40 shrink-0">
            <Recycle className="w-6 h-6 text-[#0B636B]" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Section (Distinct Customer Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Trends & Activity Hub (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Interactive Trends Chart */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-[#0B636B] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#64B60A]" />
                  <span>Tren Kontribusi Hijau</span>
                </h2>
                <p className="text-xs text-[#0B636B]/70 mt-0.5">
                  Aktivitas penyetoran sampah 7 hari terakhir
                </p>
              </div>

              {/* Metric Switcher */}
              <div className="flex items-center p-1 rounded-2xl bg-[#EFF0EB] border border-[#0B636B]/10 self-start sm:self-auto text-xs">
                <button
                  type="button"
                  onClick={() => setChartMetric("kg")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    chartMetric === "kg"
                      ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                      : "text-[#0B636B]/70 hover:text-[#0B636B]"
                  }`}
                >
                  Tonase (kg)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric("poin")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    chartMetric === "poin"
                      ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                      : "text-[#0B636B]/70 hover:text-[#0B636B]"
                  }`}
                >
                  Poin Diperoleh
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="w-full h-64 sm:h-72">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="nasabahGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartMetric === "kg" ? "#0B636B" : "#64B60A"} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={chartMetric === "kg" ? "#B6F022" : "#CFE26C"} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0B636B" strokeOpacity={0.08} />
                    <XAxis
                      dataKey="label"
                      stroke="#0B636B"
                      strokeOpacity={0.5}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#0B636B"
                      strokeOpacity={0.5}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => (chartMetric === "kg" ? `${v}k` : `${v}`)}
                    />
                    <Tooltip content={<NasabahChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={chartMetric}
                      stroke={chartMetric === "kg" ? "#0B636B" : "#64B60A"}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#nasabahGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-[#EFF0EB]/50 rounded-2xl animate-pulse" />
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#0B636B]/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#0B636B]/70">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0B636B]" />
                <span>Rata-rata: {(setoranList.length > 0 ? summary.totalSampahDisetorKg / setoranList.length : 0).toFixed(1)} kg / setoran</span>
              </span>
              <Link
                href="/riwayat"
                className="font-bold text-[#0B636B] hover:text-[#64B60A] inline-flex items-center gap-1 transition-colors"
              >
                <span>Lihat Analisis Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Activity Feed (Setoran & Penukaran) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
            {/* Header with Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-teal-50 text-[#0B636B] flex items-center justify-center">
                  <History className="w-5 h-5 text-[#64B60A]" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-[#0B636B]">
                    Aktivitas Transaksi
                  </h2>
                  <p className="text-xs text-[#0B636B]/70">
                    Daftar setoran sampah dan penukaran reward
                  </p>
                </div>
              </div>

              {/* Activity Tab Switcher */}
              <div className="flex p-1 rounded-2xl bg-[#EFF0EB] border border-[#0B636B]/10 text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActivityTab("setor")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    activityTab === "setor"
                      ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                      : "text-[#0B636B]/70 hover:text-[#0B636B]"
                  }`}
                >
                  <span>Setoran Sampah</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                    {setoranList.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivityTab("tukar")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    activityTab === "tukar"
                      ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                      : "text-[#0B636B]/70 hover:text-[#0B636B]"
                  }`}
                >
                  <span>Penukaran Hadiah</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                    {penukaranList.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-[#0B636B]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={activityTab === "setor" ? "Cari kode setor..." : "Cari kode atau nama hadiah..."}
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#EFF0EB]/70 border border-[#0B636B]/12 text-xs text-[#0B636B] placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#0B636B]/20 transition-all"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                <button
                  type="button"
                  onClick={() => setActivityFilter("all")}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    activityFilter === "all"
                      ? "bg-[#0B636B] text-white"
                      : "bg-[#EFF0EB] text-[#0B636B]/70 hover:bg-[#EFF0EB]/80"
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setActivityFilter("selesai")}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    activityFilter === "selesai"
                      ? "bg-[#64B60A] text-white"
                      : "bg-[#EFF0EB] text-[#0B636B]/70 hover:bg-[#EFF0EB]/80"
                  }`}
                >
                  Selesai
                </button>
                <button
                  type="button"
                  onClick={() => setActivityFilter("menunggu")}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    activityFilter === "menunggu"
                      ? "bg-amber-600 text-white"
                      : "bg-[#EFF0EB] text-[#0B636B]/70 hover:bg-[#EFF0EB]/80"
                  }`}
                >
                  Menunggu
                </button>
                {activityTab === "setor" && (
                  <button
                    type="button"
                    onClick={() => setActivityFilter("ditolak")}
                    className={`px-3 py-1 rounded-full font-medium transition-all ${
                      activityFilter === "ditolak"
                        ? "bg-red-600 text-white"
                        : "bg-[#EFF0EB] text-[#0B636B]/70 hover:bg-[#EFF0EB]/80"
                    }`}
                  >
                    Ditolak
                  </button>
                )}
              </div>
            </div>

            {/* List Feed */}
            {activityTab === "setor" ? (
              <div className="space-y-3">
                {setorLoading ? (
                  <div className="space-y-3">
                    <div className="h-20 bg-[#EFF0EB]/60 rounded-2xl animate-pulse" />
                    <div className="h-20 bg-[#EFF0EB]/60 rounded-2xl animate-pulse" />
                  </div>
                ) : filteredSetoran.length > 0 ? (
                  filteredSetoran.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#EFF0EB]/40 hover:bg-[#EFF0EB]/80 border border-[#0B636B]/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#0B636B]/15 text-[#0B636B] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#64B60A]/40 transition-colors">
                          <Scale className="w-5 h-5 text-[#64B60A]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-[#0B636B]">
                              {item.kodeSetor}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.kodeSetor)}
                              className="text-[#0B636B]/50 hover:text-[#0B636B] transition-colors"
                              title="Salin Kode Setor"
                            >
                              {copiedCode === item.kodeSetor ? (
                                <span className="text-[10px] font-bold text-[#64B60A]">Tersalin!</span>
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <StatusBadge status={item.status} type="setor" />
                          </div>

                          <p className="text-xs text-[#0B636B]/70 mt-1 flex items-center gap-2">
                            <span>{formatDateIndo(item.tanggal)}</span>
                            {item.catatan && (
                              <>
                                <span>•</span>
                                <span className="italic truncate max-w-[200px]">{item.catatan}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#0B636B]/10">
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-xs text-[#0B636B]">{item.totalBeratKg} kg</p>
                          <p className="font-bold text-xs text-[#64B60A]">+{item.totalPoin} Poin</p>
                        </div>

                        <Link
                          href={`/nota/setor/${item.id}`}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#B6F022]/30 border border-[#0B636B]/15 text-[#0B636B] font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>Nota</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-[#EFF0EB]/30 rounded-2xl border border-dashed border-[#0B636B]/15">
                    <p className="text-xs font-semibold text-[#0B636B]/70">
                      Tidak ada transaksi setoran yang cocok.
                    </p>
                    <Link
                      href="/setor"
                      className="inline-block mt-2 text-xs font-bold text-[#64B60A] hover:underline"
                    >
                      Ajukan Setoran Sekarang →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {tukarLoading ? (
                  <div className="space-y-3">
                    <div className="h-20 bg-[#EFF0EB]/60 rounded-2xl animate-pulse" />
                    <div className="h-20 bg-[#EFF0EB]/60 rounded-2xl animate-pulse" />
                  </div>
                ) : filteredPenukaran.length > 0 ? (
                  filteredPenukaran.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#EFF0EB]/40 hover:bg-[#EFF0EB]/80 border border-[#0B636B]/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#0B636B]/15 text-[#0B636B] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-amber-400 transition-colors">
                          <Gift className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-[#0B636B]">
                              {item.kodePenukaran}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.kodePenukaran)}
                              className="text-[#0B636B]/50 hover:text-[#0B636B] transition-colors"
                              title="Salin Kode Penukaran"
                            >
                              {copiedCode === item.kodePenukaran ? (
                                <span className="text-[10px] font-bold text-[#64B60A]">Tersalin!</span>
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <StatusBadge status={item.status} type="penukaran" />
                          </div>

                          <p className="text-xs font-semibold text-[#0B636B] mt-1">
                            {item.hadiah?.namaHadiah || "Hadiah / Voucher"}
                          </p>
                          <p className="text-[11px] text-[#0B636B]/60 mt-0.5">
                            {formatDateIndo(item.tanggal)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#0B636B]/10">
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-xs text-amber-700">-{item.poinTerpakai} Poin</p>
                        </div>

                        <Link
                          href={`/nota/tukar/${item.id}`}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#B6F022]/30 border border-[#0B636B]/15 text-[#0B636B] font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>Klaim</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-[#EFF0EB]/30 rounded-2xl border border-dashed border-[#0B636B]/15">
                    <p className="text-xs font-semibold text-[#0B636B]/70">
                      Belum ada histori penukaran reward.
                    </p>
                    <Link
                      href="/hadiah"
                      className="inline-block mt-2 text-xs font-bold text-[#64B60A] hover:underline"
                    >
                      Buka Katalog Hadiah Sekarang →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* View Full History Footer */}
            <div className="pt-4 border-t border-[#0B636B]/10 flex items-center justify-between">
              <span className="text-xs text-[#0B636B]/60">
                Menampilkan aktivitas terbaru.
              </span>
              <Link
                href={activityTab === "setor" ? "/riwayat" : "/hadiah/riwayat"}
                className="text-xs font-bold text-[#0B636B] hover:text-[#64B60A] flex items-center gap-1.5 transition-colors"
              >
                <span>Semua Histori {activityTab === "setor" ? "Setoran" : "Penukaran"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Widgets & Recommendations (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget 1: Rekomendasi Hadiah Untukmu */}
          <div className="p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0B636B]">
                    Rekomendasi Hadiah
                  </h3>
                  <p className="text-[11px] text-[#0B636B]/60">Tukarkan dengan saldo poin Anda</p>
                </div>
              </div>

              <Link
                href="/hadiah"
                className="text-xs font-bold text-[#64B60A] hover:underline flex items-center"
              >
                Semua
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5 pt-1">
              {recommendedRewards.length > 0 ? (
                recommendedRewards.map((reward) => {
                  const canRedeem = currentSaldo >= reward.poinDibutuhkan;
                  return (
                    <div
                      key={reward.id}
                      className="p-3 rounded-2xl bg-[#EFF0EB]/50 border border-[#0B636B]/10 flex items-center justify-between gap-3 hover:border-[#0B636B]/25 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {reward.foto ? (
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#0B636B]/10">
                            <Image
                              src={getImageUrl(reward.foto)}
                              alt={reward.namaHadiah}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-[#0B636B]/10 text-[#0B636B] flex items-center justify-center shrink-0">
                            <Gift className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-[#0B636B] truncate">
                            {reward.namaHadiah}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                            <span className="font-semibold text-amber-700">
                              {reward.poinDibutuhkan.toLocaleString("id-ID")} Poin
                            </span>
                            <span className="text-[#0B636B]/40">•</span>
                            <span className="text-[#0B636B]/60 text-[10px]">
                              Stok: {reward.stok}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/hadiah"
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                          canRedeem
                            ? "bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] shadow-sm"
                            : "bg-[#0B636B]/10 text-[#0B636B]/60 hover:bg-[#0B636B]/20"
                        }`}
                      >
                        {canRedeem ? "Tukar" : "Lihat"}
                      </Link>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-[#0B636B]/60 text-center py-4">
                  Belum ada katalog hadiah aktif.
                </p>
              )}
            </div>
          </div>

          {/* Widget 2: Nilai Sampah Tertinggi */}
          <div className="p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0B636B] flex items-center justify-center">
                  <Coins className="w-4 h-4 text-[#64B60A]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0B636B]">
                    Nilai Sampah Tertinggi
                  </h3>
                  <p className="text-[11px] text-[#0B636B]/60">Sampah bernilai poin maksimal</p>
                </div>
              </div>

              <Link
                href="/kategori-sampah"
                className="text-xs font-bold text-[#64B60A] hover:underline flex items-center"
              >
                Katalog
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2 pt-1">
              {topKategoriSampah.map((kat) => (
                <div
                  key={kat.id}
                  className="p-3 rounded-2xl bg-[#EFF0EB]/50 border border-[#0B636B]/10 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-[#0B636B] block">
                      {kat.namaKategori}
                    </span>
                    <span className="text-[11px] text-[#0B636B]/60">
                      Jenis: {kat.jenis}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-[#64B60A] block">
                      +{kat.poinPerKg} Poin/kg
                    </span>
                    <span className="text-[10px] text-[#0B636B]/60">
                      Rp {kat.hargaPerKg?.toLocaleString("id-ID") || 0}/kg
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/setor"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0B636B] hover:bg-[#094d53] text-[#B6F022] text-xs font-bold transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pilah & Setor Sekarang</span>
              </Link>
            </div>
          </div>

          {/* Widget 3: Panduan Cerdas Pemilahan */}
          <div className="p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            <h3 className="font-display font-bold text-sm text-[#0B636B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#64B60A]" />
              <span>Tips Cepat Lolos Verifikasi</span>
            </h3>

            <div className="space-y-2.5 text-xs text-[#0B636B]/80 pt-1">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#EFF0EB]/50">
                <span className="w-5 h-5 rounded-full bg-[#B6F022] text-[#0B636B] font-bold text-[11px] flex items-center justify-center shrink-0">
                  1
                </span>
                <p>
                  <strong className="text-[#0B636B]">Bersih & Kering:</strong> Bilas sisa cairan pada botol atau wadah plastik sebelum disetor.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#EFF0EB]/50">
                <span className="w-5 h-5 rounded-full bg-[#B6F022] text-[#0B636B] font-bold text-[11px] flex items-center justify-center shrink-0">
                  2
                </span>
                <p>
                  <strong className="text-[#0B636B]">Lipat Rapi:</strong> Pipihkan kardus dan ikat erat agar proses penimbangan timbangan akurat.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#EFF0EB]/50">
                <span className="w-5 h-5 rounded-full bg-[#B6F022] text-[#0B636B] font-bold text-[11px] flex items-center justify-center shrink-0">
                  3
                </span>
                <p>
                  <strong className="text-[#0B636B]">Pisahkan Kategori:</strong> Pisahkan plastik, kertas, dan logam untuk menghindari selisih poin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
