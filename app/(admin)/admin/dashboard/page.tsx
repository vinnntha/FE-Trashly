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
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Queries for stats
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

  const totalStokHadiah = hadiahList.reduce(
    (acc, curr) => acc + (Number(curr.stok) || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B636B] text-white p-6 sm:p-8 shadow-xl shadow-[#0B636B]/20">
        {/* Background Decorative Rings */}
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
            Kelola data nasabah, katalog kategori sampah, dan persediaan hadiah dengan sistem ekonomi sirkular digital Trashly.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/admin/nasabah"
              className="px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-display font-bold text-xs shadow-md shadow-[#B6F022]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Kelola Nasabah</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/kategori-sampah"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors"
            >
              Kategori Sampah
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-[#0B636B]">
            Ringkasan Master Data
          </h2>
          <span className="text-xs text-[#0B636B]/60">Pembaruan Real-Time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Nasabah"
            value={nasabahList.length}
            icon={Users}
            description="Nasabah aktif terdaftar"
            trend="Aktif"
            colorScheme="teal"
          />

          <StatCard
            title="Kategori Sampah"
            value={kategoriList.length}
            icon={Layers}
            description="Jenis sampah diterima"
            trend="Katalog"
            colorScheme="moss"
          />

          <StatCard
            title="Katalog Hadiah"
            value={hadiahList.length}
            icon={Gift}
            description="Item reward penukaran"
            trend="Reward"
            colorScheme="sprout"
          />

          <StatCard
            title="Total Stok Barang"
            value={totalStokHadiah}
            icon={PackageCheck}
            description="Unit persediaan hadiah"
            trend="Stok Fisik"
            colorScheme="lime"
          />
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg text-[#0B636B]">
          Akses Cepat Pengelolaan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/admin/nasabah"
            className="p-6 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm hover:shadow-md hover:border-[#64B60A]/40 transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0B636B]/10 text-[#0B636B] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B636B]">
                Data Nasabah
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Pendaftaran nasabah baru, cek riwayat saldo poin, pembaruan kontak, dan detail audit kepesertaan.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Buka Menu Nasabah</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/admin/kategori-sampah"
            className="p-6 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm hover:shadow-md hover:border-[#64B60A]/40 transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#64B60A]/15 text-[#64B60A] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B636B]">
                Kategori Sampah
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Penetapan tarif harga beli per kg, bobot poin per kg, dan pengelompokan jenis (Plastik, Kertas, Logam, Kaca).
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Buka Kategori Sampah</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/admin/hadiah"
            className="p-6 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm hover:shadow-md hover:border-[#64B60A]/40 transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#B6F022]/30 text-[#0B636B] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0B636B]">
                Hadiah & Voucher
              </h3>
              <p className="text-xs text-[#0B636B]/65 leading-relaxed">
                Katalog reward nasabah, kuota stok barang fisik, voucher pulsa, serta pengaturan ambang batas poin penukaran.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#64B60A] group-hover:translate-x-1 transition-transform">
              <span>Buka Katalog Hadiah</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
