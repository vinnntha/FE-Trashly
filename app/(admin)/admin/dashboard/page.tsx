"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/admin/StatCard";
import { VerifySetorModal } from "@/components/admin/VerifySetorModal";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Users,
  Scale,
  ArrowDownToLine,
  Coins,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
  TreePine,
  Zap,
  Leaf,
  FileText,
  Gift,
  ArrowLeftRight,
  Target,
  ChevronRight,
  X,
  Info,
  Calendar,
} from "lucide-react";

interface SetoranItem {
  id: string;
  kodeSetor: string;
  tanggal: string;
  status: "menunggu_konfirmasi" | "diverifikasi" | "ditolak" | "selesai";
  totalBeratKg: number;
  totalPoin: number;
  nasabah: {
    id: string;
    namaNasabah: string;
    telp: string;
  };
}

interface PenukaranItem {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  poinTerpakai: number;
  status: "diproses" | "selesai";
  nasabah: {
    id: string;
    namaNasabah: string;
    telp: string;
  };
  hadiah: {
    id: string;
    namaHadiah: string;
    poinDibutuhkan: number;
  };
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Interactive UI state
  const [timeframe, setTimeframe] = useState<"bulan_ini" | "minggu_ini" | "semua">("bulan_ini");
  const [chartMetric, setChartMetric] = useState<"tonase" | "poin" | "kategori">("tonase");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [targetGoal, setTargetGoal] = useState<number>(500);
  const [impactView, setImpactView] = useState<"co2" | "pohon" | "energi">("co2");
  const [activityTab, setActivityTab] = useState<"setoran" | "penukaran">("setoran");
  const [activityFilter, setActivityFilter] = useState<"all" | "pending" | "selesai">("all");
  const [activitySearch, setActivitySearch] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [dismissPendingBanner, setDismissPendingBanner] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Verification modal state
  const [selectedSetorId, setSelectedSetorId] = useState<string | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute current month format YYYY-MM for rekapitulasi endpoint
  const currentMonthStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }, []);

  // Queries
  const { data: dashboardStats } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient<{ data: any }>("/dashboard/stats");
      return res.data || {};
    },
  });

  const { data: pendingDeposits = [] } = useQuery({
    queryKey: ["admin-pending-deposits"],
    queryFn: async () => {
      const res = await apiClient<{ data: SetoranItem[] }>(
        "/setor-sampah/admin/list?status=menunggu_konfirmasi"
      );
      return res.data || [];
    },
  });

  const { data: recentSetoran = [] } = useQuery({
    queryKey: ["admin-recent-setoran"],
    queryFn: async () => {
      const res = await apiClient<{ data: SetoranItem[] }>("/setor-sampah/admin/list");
      return res.data || [];
    },
  });

  const { data: recentPenukaran = [] } = useQuery({
    queryKey: ["admin-recent-penukaran"],
    queryFn: async () => {
      const res = await apiClient<{ data: PenukaranItem[] }>("/penukaran-poin/admin/list");
      return res.data || [];
    },
  });

  const { data: rekapData } = useQuery({
    queryKey: ["admin-rekapitulasi-bulanan", currentMonthStr],
    queryFn: async () => {
      const res = await apiClient<{ data: any }>(
        `/rekapitulasi/bulanan?bulan=${currentMonthStr}`
      );
      return res.data || null;
    },
  });

  const { data: nasabahList = [] } = useQuery({
    queryKey: ["nasabah-list"],
    queryFn: async () => {
      const res = await apiClient<{ data: any[] }>("/admin/nasabah");
      return res.data || [];
    },
  });

  // Derived metrics
  const totalNasabah = dashboardStats?.totalNasabah ?? nasabahList.length;
  const totalSetoran = dashboardStats?.totalTransaksiSetor ?? recentSetoran.length;
  const totalBeratKg = Number(dashboardStats?.totalBeratSampahKg ?? 0);
  const totalPoinTersalurkan = Number(dashboardStats?.totalPoinTersalurkan ?? 0);

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

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-pending-deposits"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-recent-setoran"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-recent-penukaran"] }),
      queryClient.invalidateQueries({ queryKey: ["admin-rekapitulasi-bulanan"] }),
      queryClient.invalidateQueries({ queryKey: ["nasabah-list"] }),
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Copy code with feedback
  const handleCopy = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Open inline verify modal
  const handleOpenVerify = (id: string) => {
    setSelectedSetorId(id);
    setIsVerifyModalOpen(true);
  };

  // Weekly trend chart data derived from real setoran
  const trendData = useMemo(() => {
    const days: Record<string, { date: string; label: string; kg: number; poin: number; count: number }> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("id-ID", { weekday: "short" });
      days[dateStr] = { date: dateStr, label, kg: 0, poin: 0, count: 0 };
    }

    recentSetoran.forEach((item) => {
      if (!item.tanggal) return;
      const itemDate = new Date(item.tanggal).toISOString().split("T")[0];
      if (days[itemDate]) {
        days[itemDate].kg += Number(item.totalBeratKg || 0);
        days[itemDate].poin += Number(item.totalPoin || 0);
        days[itemDate].count += 1;
      }
    });

    return Object.values(days);
  }, [recentSetoran]);

  // Category composition data
  const categoryChartData = useMemo(() => {
    const breakdown = rekapData?.breakdownJenisSampah || {
      plastik: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kertas: { tonaseKg: 0, rupiah: 0, poin: 0 },
      logam: { tonaseKg: 0, rupiah: 0, poin: 0 },
      kaca: { tonaseKg: 0, rupiah: 0, poin: 0 },
    };

    return [
      {
        key: "plastik",
        name: "Plastik",
        color: "#0B636B",
        kg: Number(breakdown.plastik.tonaseKg || 0),
        poin: Number(breakdown.plastik.poin || 0),
        rupiah: Number(breakdown.plastik.rupiah || 0),
      },
      {
        key: "kertas",
        name: "Kertas",
        color: "#64B60A",
        kg: Number(breakdown.kertas.tonaseKg || 0),
        poin: Number(breakdown.kertas.poin || 0),
        rupiah: Number(breakdown.kertas.rupiah || 0),
      },
      {
        key: "logam",
        name: "Logam",
        color: "#CFE26C",
        kg: Number(breakdown.logam.tonaseKg || 0),
        poin: Number(breakdown.logam.poin || 0),
        rupiah: Number(breakdown.logam.rupiah || 0),
      },
      {
        key: "kaca",
        name: "Kaca",
        color: "#B6F022",
        kg: Number(breakdown.kaca.tonaseKg || 0),
        poin: Number(breakdown.kaca.poin || 0),
        rupiah: Number(breakdown.kaca.rupiah || 0),
      },
    ];
  }, [rekapData]);

  // Filtered activity stream
  const filteredSetoranList = useMemo(() => {
    return recentSetoran
      .filter((item) => {
        if (activityFilter === "pending") return item.status === "menunggu_konfirmasi";
        if (activityFilter === "selesai") return item.status === "diverifikasi" || item.status === "selesai";
        return true;
      })
      .filter((item) => {
        if (!activitySearch.trim()) return true;
        const q = activitySearch.toLowerCase();
        return (
          item.kodeSetor?.toLowerCase().includes(q) ||
          item.nasabah?.namaNasabah?.toLowerCase().includes(q) ||
          item.nasabah?.telp?.includes(q)
        );
      })
      .slice(0, 5);
  }, [recentSetoran, activityFilter, activitySearch]);

  const filteredPenukaranList = useMemo(() => {
    return recentPenukaran
      .filter((item) => {
        if (activityFilter === "pending") return item.status === "diproses";
        if (activityFilter === "selesai") return item.status === "selesai";
        return true;
      })
      .filter((item) => {
        if (!activitySearch.trim()) return true;
        const q = activitySearch.toLowerCase();
        return (
          item.kodePenukaran?.toLowerCase().includes(q) ||
          item.nasabah?.namaNasabah?.toLowerCase().includes(q) ||
          item.hadiah?.namaHadiah?.toLowerCase().includes(q) ||
          item.nasabah?.telp?.includes(q)
        );
      })
      .slice(0, 5);
  }, [recentPenukaran, activityFilter, activitySearch]);

  // Target calculations
  const targetPercent = Math.min(100, Math.round((totalBeratKg / targetGoal) * 100));
  const remainingKg = Math.max(0, targetGoal - totalBeratKg);

  // Eco impact metrics
  const ecoMetrics = {
    co2: (totalBeratKg * 1.8).toFixed(1),
    pohon: (totalBeratKg * 0.05).toFixed(1),
    energi: (totalBeratKg * 3.2).toFixed(1),
  };

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-2xl border border-[#0B636B]/15 shadow-xl text-xs space-y-1 z-50">
          <p className="font-bold text-[#0B636B]">{label || data.name}</p>
          <div className="flex items-center gap-2 text-[#0B636B]/80 font-medium">
            <span>{chartMetric === "tonase" ? "Berat:" : chartMetric === "poin" ? "Poin:" : "Tonase:"}</span>
            <span className="font-extrabold text-[#0B636B]">
              {chartMetric === "tonase"
                ? `${data.kg.toLocaleString("id-ID")} kg`
                : chartMetric === "poin"
                ? `${data.poin.toLocaleString("id-ID")} Poin`
                : `${data.kg.toLocaleString("id-ID")} kg`}
            </span>
          </div>
          {data.count !== undefined && (
            <p className="text-[10px] text-[#0B636B]/60">{data.count} transaksi tercatat</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Interactive Bar: Greeting & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-[#0B636B]/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B636B]/70 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#64B60A] animate-ping" />
            <span className="text-[#0B636B] font-bold">Trashly Unit Live</span>
            <span className="text-[#0B636B]/30">•</span>
            <span>{formattedToday}</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0B636B] tracking-tight">
            {greeting},{" "}
            <span className="text-[#64B60A]">
              {user?.adminBank?.namaPengelola || user?.adminBank?.namaUnit || "Admin Bank"}
            </span>
          </h1>
          <p className="text-xs text-[#0B636B]/70 mt-0.5">
            Unit:{" "}
            <strong className="text-[#0B636B]">
              {user?.adminBank?.namaUnit || "Bank Sampah Unit Utama"}
            </strong>{" "}
            — Operasional & analitik transaksi sirkular hari ini.
          </p>
        </div>

        {/* Interactive Period Toggle & Refresh Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
          <div className="p-1 rounded-2xl bg-[#EFF0EB] border border-[#0B636B]/10 flex items-center gap-1 text-xs font-semibold text-[#0B636B]">
            <button
              type="button"
              onClick={() => setTimeframe("bulan_ini")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeframe === "bulan_ini"
                  ? "bg-[#0B636B] text-[#B6F022] font-bold shadow-sm"
                  : "text-[#0B636B]/70 hover:text-[#0B636B]"
              }`}
            >
              Bulan Ini
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("minggu_ini")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeframe === "minggu_ini"
                  ? "bg-[#0B636B] text-[#B6F022] font-bold shadow-sm"
                  : "text-[#0B636B]/70 hover:text-[#0B636B]"
              }`}
            >
              Minggu Ini
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("semua")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                timeframe === "semua"
                  ? "bg-[#0B636B] text-[#B6F022] font-bold shadow-sm"
                  : "text-[#0B636B]/70 hover:text-[#0B636B]"
              }`}
            >
              Semua
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            title="Segarkan data terbaru"
            className="p-2.5 rounded-2xl bg-white border border-[#0B636B]/15 text-[#0B636B] hover:bg-[#EFF0EB] hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#64B60A]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Actionable Pending Banner */}
      {pendingDeposits.length > 0 && !dismissPendingBanner && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#B6F022]/20 border border-[#64B60A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0B636B] text-[#B6F022] flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-sm sm:text-base text-[#0B636B]">
                  {pendingDeposits.length} Pengajuan Setoran Menunggu Penimbangan
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0B636B] text-[#B6F022]">
                  Perlu Tindakan
                </span>
              </div>
              <p className="text-xs text-[#0B636B]/80 mt-0.5">
                Segera timbang berat riil sampah nasabah untuk menerbitkan poin sirkular Trashly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => handleOpenVerify(pendingDeposits[0].id)}
              className="px-4 py-2 rounded-full bg-[#0B636B] hover:bg-[#084b51] text-[#B6F022] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Verifikasi Teratas</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/admin/setoran"
              className="px-3 py-2 rounded-full bg-white/70 hover:bg-white text-[#0B636B] text-xs font-semibold border border-[#0B636B]/20 transition-all flex items-center gap-1"
            >
              <span>Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setDismissPendingBanner(true)}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#0B636B]/60 hover:text-[#0B636B] transition-colors"
              title="Tutup banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Metrics Row (Interactive KPI Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-display font-bold text-base sm:text-lg text-[#0B636B] flex items-center gap-2">
            <span>Metrik Operasional Unit</span>
            <span className="text-xs font-normal text-[#0B636B]/60 hidden sm:inline">
              (Klik metrik untuk beralih visualisasi analitik)
            </span>
          </h2>
          <span className="text-xs font-bold text-[#64B60A] bg-[#64B60A]/10 px-2.5 py-0.5 rounded-full">
            Real-time Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Nasabah Aktif"
            value={totalNasabah}
            icon={Users}
            description="Anggota bank terdaftar"
            trend={`${totalNasabah} Akun`}
            colorScheme="teal"
            onClick={() => setChartMetric("kategori")}
          />

          <StatCard
            title="Total Sampah Terkelola"
            value={`${totalBeratKg.toLocaleString("id-ID")} kg`}
            icon={Scale}
            description={totalBeratKg >= 1000 ? `Setara ${(totalBeratKg / 1000).toFixed(2)} Ton` : "Sampah sirkular tervalidasi"}
            trend="Sirkular"
            colorScheme="moss"
            isActive={chartMetric === "tonase"}
            onClick={() => setChartMetric("tonase")}
          />

          <StatCard
            title="Aktivitas Penimbangan"
            value={totalSetoran}
            icon={ArrowDownToLine}
            description={pendingDeposits.length > 0 ? `${pendingDeposits.length} menunggu verifikasi` : "Semua setoran tervalidasi"}
            trend={`${totalSetoran} Transaksi`}
            colorScheme="sprout"
            onClick={() => setChartMetric("tonase")}
          />

          <StatCard
            title="Poin Tersalurkan"
            value={`${totalPoinTersalurkan.toLocaleString("id-ID")} Poin`}
            icon={Coins}
            description="Reward sirkular nasabah"
            trend="Reward Poin"
            colorScheme="lime"
            isActive={chartMetric === "poin"}
            onClick={() => setChartMetric("poin")}
          />
        </div>
      </div>

      {/* Main Interactive Grid: Analytics & Target Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 Cols): Interactive Chart & Category Deep-dive */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#0B636B]/12 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0B636B]/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0B636B]/10 text-[#0B636B] text-[11px] font-bold mb-1">
                <TrendingUp className="w-3 h-3 text-[#64B60A]" />
                <span>Analitik Tren & Aliran Sampah</span>
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#0B636B]">
                {chartMetric === "tonase"
                  ? "Tren Tonase Sampah Masuk"
                  : chartMetric === "poin"
                  ? "Distribusi Poin Reward Diterbitkan"
                  : "Komposisi Kategori Sampah Unit"}
              </h3>
            </div>

            {/* Interactive View Toggles */}
            <div className="p-1 rounded-2xl bg-[#EFF0EB] border border-[#0B636B]/10 flex items-center gap-1 text-xs font-bold text-[#0B636B]">
              <button
                type="button"
                onClick={() => {
                  setChartMetric("tonase");
                  setSelectedCategory(null);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  chartMetric === "tonase"
                    ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                    : "text-[#0B636B]/70 hover:text-[#0B636B]"
                }`}
              >
                Tonase (kg)
              </button>
              <button
                type="button"
                onClick={() => {
                  setChartMetric("poin");
                  setSelectedCategory(null);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  chartMetric === "poin"
                    ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                    : "text-[#0B636B]/70 hover:text-[#0B636B]"
                }`}
              >
                Poin
              </button>
              <button
                type="button"
                onClick={() => setChartMetric("kategori")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  chartMetric === "kategori"
                    ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                    : "text-[#0B636B]/70 hover:text-[#0B636B]"
                }`}
              >
                Kategori
              </button>
            </div>
          </div>

          {/* Interactive Recharts Canvas */}
          <div className="w-full h-64 sm:h-72">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                {chartMetric === "kategori" ? (
                  <BarChart
                    data={categoryChartData}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#0B636B" strokeOpacity={0.06} />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#0B636B", opacity: 0.6 }}
                      unit=" kg"
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fontWeight: 700, fill: "#0B636B" }}
                      width={65}
                    />
                    <Tooltip content={<CustomChartTooltip />} cursor={{ fill: "#EFF0EB", opacity: 0.5 }} />
                    <Bar
                      dataKey="kg"
                      radius={[0, 10, 10, 0]}
                      barSize={24}
                      onClick={(entry: any) => setSelectedCategory(entry?.key ? String(entry.key) : null)}
                      className="cursor-pointer"
                    >
                      {categoryChartData.map((entry) => (
                        <Cell
                          key={entry.key}
                          fill={entry.color}
                          opacity={selectedCategory && selectedCategory !== entry.key ? 0.35 : 1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="tonaseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B636B" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0B636B" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="poinGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64B60A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#64B60A" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0B636B" strokeOpacity={0.08} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#0B636B", opacity: 0.6 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#0B636B", opacity: 0.6 }}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={chartMetric === "tonase" ? "kg" : "poin"}
                      stroke={chartMetric === "tonase" ? "#0B636B" : "#64B60A"}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill={chartMetric === "tonase" ? "url(#tonaseGrad)" : "url(#poinGrad)"}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            )}
          </div>

          {/* Interactive Category Deep-Dive Cards */}
          <div className="pt-2 border-t border-[#0B636B]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#0B636B]">
                Komposisi Jenis Sampah:
              </span>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-[11px] text-[#64B60A] font-semibold hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categoryChartData.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(isSelected ? null : cat.key);
                      setChartMetric("kategori");
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-[#0B636B] text-white border-[#0B636B] shadow-md scale-[1.02]"
                        : "bg-[#EFF0EB]/60 hover:bg-[#EFF0EB] border-[#0B636B]/10 text-[#0B636B]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-bold text-xs">{cat.name}</span>
                    </div>
                    <div className="text-sm font-extrabold">
                      {cat.kg.toLocaleString("id-ID")} <span className="text-[10px] font-normal opacity-80">kg</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? "text-[#B6F022]" : "text-[#64B60A] font-semibold"}`}>
                      {cat.poin} Poin
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right (5 Cols): Target Sirkular & Eco Impact Calculator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Progress Card */}
          <div className="bg-white rounded-3xl border border-[#0B636B]/12 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#B6F022]/40 text-[#0B636B] flex items-center justify-center font-black">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-display font-extrabold text-base text-[#0B636B]">
                  Target Sirkular Bulanan
                </h3>
              </div>
              <span className="text-xs font-bold text-[#0B636B] bg-[#B6F022]/30 px-2.5 py-1 rounded-full">
                {targetPercent}% Tercapai
              </span>
            </div>

            {/* Target interactive selector */}
            <div className="flex items-center justify-between text-xs text-[#0B636B]/70 pt-1">
              <span>Sasaran Unit:</span>
              <div className="flex items-center gap-1.5">
                {[250, 500, 1000].map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setTargetGoal(goal)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                      targetGoal === goal
                        ? "bg-[#0B636B] text-[#B6F022]"
                        : "bg-[#EFF0EB] hover:bg-[#0B636B]/10 text-[#0B636B]"
                    }`}
                  >
                    {goal} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Progress bar with glowing indicator */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-[#EFF0EB] overflow-hidden p-0.5 border border-[#0B636B]/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#64B60A] to-[#B6F022] transition-all duration-500 shadow-sm"
                  style={{ width: `${targetPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium text-[#0B636B]/70">
                <span>{totalBeratKg.toLocaleString("id-ID")} kg terkumpul</span>
                <span>Target: {targetGoal} kg</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#EFF0EB]/70 border border-[#0B636B]/10 text-xs text-[#0B636B]/80 flex items-center justify-between">
              <span>Kurang untuk target:</span>
              <strong className="text-[#0B636B] font-extrabold">
                {remainingKg > 0 ? `${remainingKg.toLocaleString("id-ID")} kg` : "Target Tercapai!"}
              </strong>
            </div>
          </div>

          {/* Eco Impact Hub */}
          <div className="relative overflow-hidden rounded-3xl bg-[#0B636B] text-white p-5 sm:p-6 shadow-md shadow-[#0B636B]/20 space-y-4">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full border-4 border-white/5 pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#B6F022] text-xs font-bold">
                <Leaf className="w-3.5 h-3.5" />
                <span>Dampak Ekologis Trashly</span>
              </div>
              <span className="text-[11px] text-white/70">Kalkulasi Otomatis</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-white/75 font-medium">Estimasi Penyelamatan Lingkungan:</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#B6F022]">
                  {impactView === "co2"
                    ? ecoMetrics.co2
                    : impactView === "pohon"
                    ? ecoMetrics.pohon
                    : ecoMetrics.energi}
                </span>
                <span className="text-sm font-bold text-white/90">
                  {impactView === "co2"
                    ? "kg CO₂"
                    : impactView === "pohon"
                    ? "Pohon"
                    : "kWh Listrik"}
                </span>
              </div>
            </div>

            {/* Interactive impact tabs */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setImpactView("co2")}
                className={`p-2 rounded-2xl text-center transition-all ${
                  impactView === "co2"
                    ? "bg-white text-[#0B636B] font-extrabold shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
                }`}
              >
                <div className="text-[10px] opacity-80">Emisi</div>
                <div className="text-xs font-bold">Reduksi CO₂</div>
              </button>

              <button
                type="button"
                onClick={() => setImpactView("pohon")}
                className={`p-2 rounded-2xl text-center transition-all ${
                  impactView === "pohon"
                    ? "bg-white text-[#0B636B] font-extrabold shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
                }`}
              >
                <div className="text-[10px] opacity-80">Flora</div>
                <div className="text-xs font-bold">Pohon Setara</div>
              </button>

              <button
                type="button"
                onClick={() => setImpactView("energi")}
                className={`p-2 rounded-2xl text-center transition-all ${
                  impactView === "energi"
                    ? "bg-white text-[#0B636B] font-extrabold shadow-md"
                    : "bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
                }`}
              >
                <div className="text-[10px] opacity-80">Daya</div>
                <div className="text-xs font-bold">Energi Hemat</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Access Toolbar ("Aksi Cepat Admin") */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-display font-bold text-base sm:text-lg text-[#0B636B]">
            Pusat Aksi Cepat Pengelolaan
          </h2>
          <span className="text-xs text-[#0B636B]/60">Navigasi langsung operasional</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/setoran"
            className="p-5 rounded-3xl bg-white border border-[#0B636B]/12 hover:border-[#64B60A]/40 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#0B636B]/10 text-[#0B636B] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0B636B] group-hover:text-[#B6F022] transition-all">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-[#0B636B]">
                Timbang & Verifikasi
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Input berat riil setoran nasabah & terbitkan poin otomatis.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Buka Menu Setoran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/admin/penukaran"
            className="p-5 rounded-3xl bg-white border border-[#0B636B]/12 hover:border-[#64B60A]/40 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#64B60A]/15 text-[#64B60A] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#64B60A] group-hover:text-white transition-all">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-[#0B636B]">
                Validasi Hadiah
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Konfirmasi serah terima voucher & reward fisik nasabah.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Buka Penukaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/admin/rekapitulasi"
            className="p-5 rounded-3xl bg-white border border-[#0B636B]/12 hover:border-[#64B60A]/40 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#B6F022]/30 text-[#0B636B] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0B636B] group-hover:text-[#B6F022] transition-all">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-[#0B636B]">
                Laporan & Cetak A4
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Rekap tonase bulanan siap arsip fisik dan cetak audit.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Cetak Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/admin/nasabah"
            className="p-5 rounded-3xl bg-white border border-[#0B636B]/12 hover:border-[#64B60A]/40 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#CFE26C]/30 text-[#0B636B] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0B636B] group-hover:text-[#CFE26C] transition-all">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-sm text-[#0B636B]">
                Data Nasabah
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Daftar akun nasabah, nomor telepon, dan riwayat saldo poin.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Kelola Nasabah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Interactive Activity Feed: Setoran & Penukaran */}
      <div className="bg-white rounded-3xl border border-[#0B636B]/12 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#0B636B]/10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActivityTab("setoran")}
              className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                activityTab === "setoran"
                  ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                  : "bg-[#EFF0EB]/70 text-[#0B636B]/70 hover:text-[#0B636B]"
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Setoran Terkini</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/20 text-current">
                {recentSetoran.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivityTab("penukaran")}
              className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all flex items-center gap-2 ${
                activityTab === "penukaran"
                  ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                  : "bg-[#EFF0EB]/70 text-[#0B636B]/70 hover:text-[#0B636B]"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Penukaran Hadiah</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/20 text-current">
                {recentPenukaran.length}
              </span>
            </button>
          </div>

          {/* Search & Filter within Feed */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#0B636B]/50" />
              <input
                type="text"
                placeholder="Cari kode / nasabah..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#EFF0EB] border border-[#0B636B]/10 text-xs text-[#0B636B] placeholder:text-[#0B636B]/40 focus:outline-none focus:ring-1 focus:ring-[#0B636B] w-36 sm:w-48"
              />
              {activitySearch && (
                <button
                  type="button"
                  onClick={() => setActivitySearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0B636B]/40 hover:text-[#0B636B]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="p-0.5 rounded-xl bg-[#EFF0EB] border border-[#0B636B]/10 flex items-center gap-0.5 text-xs font-semibold text-[#0B636B]">
              <button
                type="button"
                onClick={() => setActivityFilter("all")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activityFilter === "all" ? "bg-white text-[#0B636B] font-bold shadow-xs" : "opacity-60"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter("pending")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activityFilter === "pending" ? "bg-white text-[#0B636B] font-bold shadow-xs" : "opacity-60"
                }`}
              >
                Perlu Aksi
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter("selesai")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activityFilter === "selesai" ? "bg-white text-[#0B636B] font-bold shadow-xs" : "opacity-60"
                }`}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>

        {/* Content List */}
        {activityTab === "setoran" ? (
          <div className="space-y-3">
            {filteredSetoranList.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#0B636B]/60">
                Tidak ada data setoran yang cocok dengan filter pencarian.
              </div>
            ) : (
              filteredSetoranList.map((item) => {
                const isPending = item.status === "menunggu_konfirmasi";
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#EFF0EB]/50 hover:bg-[#EFF0EB] border border-[#0B636B]/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          isPending
                            ? "bg-amber-100 text-amber-800"
                            : "bg-[#0B636B]/10 text-[#0B636B]"
                        }`}
                      >
                        {isPending ? <Clock className="w-5 h-5 animate-pulse" /> : <Scale className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0B636B]">
                            {item.nasabah?.namaNasabah || "Nasabah Trashly"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.kodeSetor)}
                            className="inline-flex items-center gap-1 font-mono text-[10px] text-[#0B636B]/70 bg-white px-2 py-0.5 rounded-md border border-[#0B636B]/10 hover:bg-[#EFF0EB] transition-colors"
                            title="Klik untuk salin kode setor"
                          >
                            <span>{item.kodeSetor}</span>
                            {copiedCode === item.kodeSetor ? (
                              <Check className="w-2.5 h-2.5 text-[#64B60A]" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#0B636B]/60 mt-0.5">
                          <span>
                            {new Date(item.tanggal).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-[#0B636B]">
                            {Number(item.totalBeratKg || 0).toLocaleString("id-ID")} kg
                          </span>
                          <span>•</span>
                          <span className="font-bold text-[#64B60A]">
                            {Number(item.totalPoin || 0).toLocaleString("id-ID")} Poin
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isPending
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : item.status === "diverifikasi"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : item.status === "ditolak"
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-[#64B60A]/15 text-[#64B60A] border border-[#64B60A]/30"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>

                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => handleOpenVerify(item.id)}
                          className="px-3 py-1.5 rounded-full bg-[#0B636B] hover:bg-[#084b51] text-[#B6F022] text-xs font-bold transition-all shadow-xs"
                        >
                          Verifikasi
                        </button>
                      ) : (
                        <Link
                          href={`/nota/setor/${item.id}`}
                          className="p-1.5 rounded-xl bg-white hover:bg-[#EFF0EB] border border-[#0B636B]/15 text-[#0B636B] transition-colors"
                          title="Buka Nota Setor"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            <div className="pt-2 text-center">
              <Link
                href="/admin/setoran"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64B60A] hover:underline"
              >
                <span>Lihat Semua Data Setoran Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPenukaranList.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#0B636B]/60">
                Tidak ada data penukaran yang cocok dengan filter pencarian.
              </div>
            ) : (
              filteredPenukaranList.map((item) => {
                const isProcess = item.status === "diproses";
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#EFF0EB]/50 hover:bg-[#EFF0EB] border border-[#0B636B]/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          isProcess
                            ? "bg-amber-100 text-amber-800"
                            : "bg-[#64B60A]/15 text-[#64B60A]"
                        }`}
                      >
                        <Gift className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0B636B]">
                            {item.nasabah?.namaNasabah || "Nasabah Trashly"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.kodePenukaran)}
                            className="inline-flex items-center gap-1 font-mono text-[10px] text-[#0B636B]/70 bg-white px-2 py-0.5 rounded-md border border-[#0B636B]/10 hover:bg-[#EFF0EB] transition-colors"
                            title="Klik untuk salin kode penukaran"
                          >
                            <span>{item.kodePenukaran}</span>
                            {copiedCode === item.kodePenukaran ? (
                              <Check className="w-2.5 h-2.5 text-[#64B60A]" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#0B636B]/60 mt-0.5">
                          <span>
                            {new Date(item.tanggal).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-[#0B636B]">
                            Hadiah: {item.hadiah?.namaHadiah || "Reward"}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-[#64B60A]">
                            -{Number(item.poinTerpakai || 0).toLocaleString("id-ID")} Poin
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isProcess
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-[#64B60A]/15 text-[#64B60A] border border-[#64B60A]/30"
                        }`}
                      >
                        {isProcess ? "Diproses" : "Selesai"}
                      </span>

                      <Link
                        href="/admin/penukaran"
                        className="px-3 py-1.5 rounded-full bg-[#0B636B] hover:bg-[#084b51] text-[#B6F022] text-xs font-bold transition-all shadow-xs"
                      >
                        Kelola
                      </Link>
                    </div>
                  </div>
                );
              })
            )}

            <div className="pt-2 text-center">
              <Link
                href="/admin/penukaran"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64B60A] hover:underline"
              >
                <span>Lihat Semua Data Penukaran Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Verify Setor Modal (Interactive direct verification from dashboard) */}
      <VerifySetorModal
        setorId={selectedSetorId}
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setSelectedSetorId(null);
          setIsVerifyModalOpen(false);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
          queryClient.invalidateQueries({ queryKey: ["admin-pending-deposits"] });
          queryClient.invalidateQueries({ queryKey: ["admin-recent-setoran"] });
          queryClient.invalidateQueries({ queryKey: ["admin-rekapitulasi-bulanan"] });
        }}
      />
    </div>
  );
}
