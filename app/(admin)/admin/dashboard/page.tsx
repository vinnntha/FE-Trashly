"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/admin/StatCard";
import {
  Users,
  Layers,
  Gift,
  Building2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  PackageCheck,
  Coins,
  Scale,
  Clock,
  ArrowDownToLine,
  ArrowLeftRight,
  FileText,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Queries for comprehensive stats
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
      const res = await apiClient<{ data: any[] }>(
        "/setor-sampah/admin/list?status=menunggu_konfirmasi"
      );
      return res.data || [];
    },
  });

  const { data: nasabahList = [] } = useQuery({
    queryKey: ["nasabah-list"],
    queryFn: async () => {
      const res = await apiClient<{ data: any[] }>("/admin/nasabah");
      return res.data || [];
    },
  });

  const { data: kategoriList = [] } = useQuery({
    queryKey: ["kategori-sampah-list"],
    queryFn: async () => {
      const res = await apiClient<{ data: any[] }>("/kategori-sampah");
      return res.data || [];
    },
  });

  const { data: hadiahList = [] } = useQuery({
    queryKey: ["hadiah-list"],
    queryFn: async () => {
      const res = await apiClient<{ data: any[] }>("/hadiah");
      return res.data || [];
    },
  });

  const totalNasabah = dashboardStats?.totalNasabah ?? nasabahList.length;
  const totalKategori = dashboardStats?.totalKategoriSampah ?? kategoriList.length;
  const totalSetoran = dashboardStats?.totalTransaksiSetor ?? 0;
  const totalBeratKg = Number(dashboardStats?.totalBeratSampahKg ?? 0);
  const totalPoinTersalurkan = Number(dashboardStats?.totalPoinTersalurkan ?? 0);

  return (
    <div className="space-y-8">
      {/* Pending Deposit Verification Action Banner */}
      {pendingDeposits.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#B6F022]/15 border border-[#64B60A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0B636B] text-[#B6F022] flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[#0B636B]">
                Ada {pendingDeposits.length} Setoran Menunggu Verifikasi
              </h4>
              <p className="text-xs text-[#0B636B]/70 mt-0.5">
                Nasabah telah mengajukan penimbangan sampah. Segera timbang dan input berat riil untuk menerbitkan poin.
              </p>
            </div>
          </div>
          <Link
            href="/admin/setoran"
            className="px-4 py-2 rounded-full bg-[#0B636B] hover:bg-[#084b51] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Verifikasi Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B636B] text-white p-6 sm:p-8 shadow-xl shadow-[#0B636B]/20">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-6 -bottom-16 w-80 h-80 rounded-full border border-[#B6F022]/15 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#B6F022] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal Pengelola Unit Bank Sampah</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
            Selamat Datang,{" "}
            <span className="text-[#B6F022]">
              {user?.adminBank?.namaUnit || user?.adminBank?.namaPengelola || "Admin Bank"}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
            Kelola transaksi penimbangan, konfirmasi penukaran hadiah, dan pantau rekapitulasi tonase sirkular Trashly secara terintegrasi.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/admin/setoran"
              className="px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-display font-bold text-xs shadow-md shadow-[#B6F022]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Periksa Data Setoran</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/rekapitulasi"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors"
            >
              Laporan Bulanan
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-[#0B636B]">
            Ringkasan Operasional Unit
          </h2>
          <span className="text-xs text-[#0B636B]/60">Pembaruan Real-Time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Nasabah"
            value={totalNasabah}
            icon={Users}
            description="Nasabah aktif terdaftar"
            trend="Aktif"
            colorScheme="teal"
          />

          <StatCard
            title="Total Berat Sampah"
            value={`${totalBeratKg.toLocaleString("id-ID")} kg`}
            icon={Scale}
            description="Sampah terverifikasi"
            trend="Sirkular"
            colorScheme="moss"
          />

          <StatCard
            title="Transaksi Setoran"
            value={totalSetoran}
            icon={ArrowDownToLine}
            description="Aktivitas penimbangan"
            trend="Setoran"
            colorScheme="sprout"
          />

          <StatCard
            title="Poin Tersalurkan"
            value={`${totalPoinTersalurkan.toLocaleString("id-ID")} Poin`}
            icon={Coins}
            description="Diterbitkan ke nasabah"
            trend="Reward"
            colorScheme="lime"
          />
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg text-[#0B636B]">
          Akses Cepat Pengelolaan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            href="/admin/setoran"
            className="p-6 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm hover:shadow-md hover:border-[#64B60A]/40 transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0B636B]/10 text-[#0B636B] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowDownToLine className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B636B]">
                Data Setoran Sampah
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Verifikasi berat riil timbangan sampah dari nasabah, hitung poin otomatis, dan selesaikan setoran.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Buka Menu Setoran</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/admin/penukaran"
            className="p-6 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm hover:shadow-md hover:border-[#64B60A]/40 transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#64B60A]/15 text-[#64B60A] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B636B]">
                Data Penukaran Hadiah
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Validasi klaim voucher dan penyerahan barang fisik kepada nasabah, serta tandai status selesai.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Buka Penukaran Poin</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/admin/rekapitulasi"
            className="p-6 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm hover:shadow-md hover:border-[#64B60A]/40 transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#B6F022]/30 text-[#0B636B] flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B636B]">
                Rekapitulasi Bulanan
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Laporan tonase per jenis sampah, grafik distribusi sirkular, dan ekspor cetak format A4 siap arsip.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Buka Rekapitulasi</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
