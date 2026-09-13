"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/admin/StatCard";
import { MonthPicker } from "@/components/admin/MonthPicker";
import { JenisBreakdownChart } from "@/components/admin/JenisBreakdownChart";
import {
  FileText,
  Printer,
  Scale,
  DollarSign,
  Coins,
  Gift,
  Building2,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";

interface RekapitulasiResponse {
  bulan: string;
  totalKg: number;
  totalTon: number;
  totalEstimasiPembayaranRupiah: number;
  totalPoinDiterbitkan: number;
  breakdownJenisSampah: {
    plastik: { tonaseKg: number; rupiah: number; poin: number };
    kertas: { tonaseKg: number; rupiah: number; poin: number };
    logam: { tonaseKg: number; rupiah: number; poin: number };
    kaca: { tonaseKg: number; rupiah: number; poin: number };
  };
  rekapitulasiPenukaranPoin: {
    totalTransaksiPenukaran: number;
    totalPoinTerpakai: number;
  };
}

export default function RekapitulasiPage() {
  const { user } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  const {
    data: rekapData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-rekapitulasi-bulanan", selectedMonth],
    queryFn: async () => {
      const res = await apiClient<{ data: RekapitulasiResponse }>(
        `/rekapitulasi/bulanan?bulan=${selectedMonth}`
      );
      return res.data;
    },
  });

  const handlePrint = () => {
    window.print();
  };

  const formatMonthLabel = (m: string) => {
    try {
      const [year, month] = m.split("-");
      const date = new Date(Number(year), Number(month) - 1, 1);
      return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    } catch {
      return m;
    }
  };

  const breakdown = rekapData?.breakdownJenisSampah || {
    plastik: { tonaseKg: 0, rupiah: 0, poin: 0 },
    kertas: { tonaseKg: 0, rupiah: 0, poin: 0 },
    logam: { tonaseKg: 0, rupiah: 0, poin: 0 },
    kaca: { tonaseKg: 0, rupiah: 0, poin: 0 },
  };

  const totalKg = rekapData?.totalKg || 0;
  const totalTon = rekapData?.totalTon || 0;
  const totalRupiah = rekapData?.totalEstimasiPembayaranRupiah || 0;
  const totalPoin = rekapData?.totalPoinDiterbitkan || 0;
  const totalPenukaran = rekapData?.rekapitulasiPenukaranPoin?.totalTransaksiPenukaran || 0;
  const totalPoinTerpakai = rekapData?.rekapitulasiPenukaranPoin?.totalPoinTerpakai || 0;

  return (
    <div className="space-y-8">
      {/* Header & Controls (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F022]/20 text-[#0B636B] text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Laporan & Analitik Operasional</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B] tracking-tight">
            Rekapitulasi Bulanan
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-1">
            Laporan agregasi sampah masuk, perputaran nilai rupiah/poin, dan sirkularitas unit.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <MonthPicker
            value={selectedMonth}
            onChange={(m) => setSelectedMonth(m)}
          />

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0B636B] hover:bg-[#084b51] text-white text-xs font-bold shadow-md shadow-[#0B636B]/20 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Printable Document Sheet */}
      <div className="bg-white rounded-3xl border border-[#0B636B]/12 shadow-sm p-6 sm:p-8 space-y-8 print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Print Only Official Letterhead */}
        <div className="hidden print:block border-b-2 border-[#0B636B] pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-display text-[#0B636B] uppercase tracking-wider">
                TRASHLY BANK SAMPAH DIGITAL
              </h2>
              <p className="text-xs text-gray-600 font-semibold">
                Unit Operasional: {user?.adminBank?.namaUnit || "Unit Pengelola Bank Sampah"}
              </p>
              <p className="text-[11px] text-gray-500">
                Pengelola: {user?.adminBank?.namaPengelola || "Admin Bank"} | Telp: {user?.adminBank?.telp || "-"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-gray-100 text-gray-800 rounded">
                Laporan Resmi
              </span>
              <p className="text-[11px] text-gray-500 mt-1">
                Periode: {formatMonthLabel(selectedMonth)}
              </p>
            </div>
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#EFF0EB]/70 border border-[#0B636B]/10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B636B]/60">
              Periode Rekapitulasi
            </span>
            <h2 className="font-display font-bold text-xl text-[#0B636B]">
              Bulan {formatMonthLabel(selectedMonth)}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-[#0B636B]/60 block">
                Total Tonase
              </span>
              <span className="font-display font-extrabold text-lg text-[#0B636B]">
                {totalTon.toFixed(2)} Ton
              </span>
            </div>
            <div className="w-px h-8 bg-[#0B636B]/15" />
            <div>
              <span className="text-[11px] text-[#0B636B]/60 block">
                Total Berat
              </span>
              <span className="font-display font-extrabold text-lg text-[#64B60A]">
                {totalKg.toLocaleString("id-ID")} kg
              </span>
            </div>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Berat Masuk"
            value={`${totalKg.toLocaleString("id-ID")} kg`}
            icon={Scale}
            description={`${totalTon.toFixed(2)} Ton terkumpul`}
            trend="Tonase"
            colorScheme="teal"
          />

          <StatCard
            title="Estimasi Nilai Sampah"
            value={`Rp ${totalRupiah.toLocaleString("id-ID")}`}
            icon={DollarSign}
            description="Perputaran nilai ekonomi"
            trend="Rupiah"
            colorScheme="moss"
          />

          <StatCard
            title="Poin Diterbitkan"
            value={`${totalPoin.toLocaleString("id-ID")} Poin`}
            icon={Coins}
            description="Poin reward ke nasabah"
            trend="Poin Masuk"
            colorScheme="lime"
          />

          <StatCard
            title="Poin Digunakan"
            value={`${totalPoinTerpakai.toLocaleString("id-ID")} Poin`}
            icon={Gift}
            description={`${totalPenukaran} transaksi penukaran`}
            trend="Poin Keluar"
            colorScheme="sprout"
          />
        </div>

        {/* Chart Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#0B636B]">
              Distribusi Volume Sampah Berdasarkan Jenis
            </h3>
            <span className="text-xs text-[#0B636B]/60 print:hidden">
              Grafik Komparasi (kg)
            </span>
          </div>

          <JenisBreakdownChart data={breakdown} />
        </div>

        {/* Detailed Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-base text-[#0B636B]">
            Rincian Material Per Jenis Sampah
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-[#0B636B]/10">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#EFF0EB] text-[#0B636B] font-display font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Jenis Sampah</th>
                  <th className="py-3 px-4 text-right">Tonase (kg)</th>
                  <th className="py-3 px-4 text-right">Tonase (Ton)</th>
                  <th className="py-3 px-4 text-right">Persentase</th>
                  <th className="py-3 px-4 text-right">Estimasi Nilai</th>
                  <th className="py-3 px-4 text-right">Poin Diterbitkan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B636B]/8 text-[#0B636B]">
                {[
                  { key: "plastik", label: "Plastik", data: breakdown.plastik, color: "#0B636B" },
                  { key: "kertas", label: "Kertas", data: breakdown.kertas, color: "#3B7A57" },
                  { key: "logam", label: "Logam", data: breakdown.logam, color: "#64B60A" },
                  { key: "kaca", label: "Kaca", data: breakdown.kaca, color: "#8EBC42" },
                ].map((row) => {
                  const kg = row.data?.tonaseKg || 0;
                  const ton = kg / 1000;
                  const percent = totalKg > 0 ? ((kg / totalKg) * 100).toFixed(1) : "0";
                  const rupiah = row.data?.rupiah || 0;
                  const poin = row.data?.poin || 0;

                  return (
                    <tr key={row.key} className="hover:bg-[#EFF0EB]/40">
                      <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: row.color }}
                        />
                        <span>{row.label}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold">
                        {kg.toLocaleString("id-ID")} kg
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {ton.toFixed(3)} Ton
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold">
                        {percent}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        Rp {rupiah.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#64B60A]">
                        +{poin.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-[#EFF0EB]/80 font-bold text-[#0B636B] border-t border-[#0B636B]/20">
                <tr>
                  <td className="py-3.5 px-4 font-display text-xs uppercase">
                    Total Keseluruhan
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs">
                    {totalKg.toLocaleString("id-ID")} kg
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs">
                    {totalTon.toFixed(3)} Ton
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs">
                    100%
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs">
                    Rp {totalRupiah.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-[#0B636B]">
                    +{totalPoin.toLocaleString("id-ID")} Poin
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Redemption & Circulation Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="p-5 rounded-2xl bg-[#EFF0EB]/50 border border-[#0B636B]/10 space-y-3">
            <h4 className="font-display font-bold text-sm text-[#0B636B]">
              Aktivitas Penukaran Reward
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#0B636B]/8">
                <span className="text-[#0B636B]/70">Transaksi Penukaran</span>
                <span className="font-bold text-[#0B636B]">
                  {totalPenukaran} klaim hadiah
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#0B636B]/8">
                <span className="text-[#0B636B]/70">Poin Ditebus Nasabah</span>
                <span className="font-bold text-amber-600">
                  {totalPoinTerpakai.toLocaleString("id-ID")} Poin
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#0B636B]/70">Rasio Poin Terpakai / Terbit</span>
                <span className="font-bold text-[#0B636B]">
                  {totalPoin > 0 ? ((totalPoinTerpakai / totalPoin) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#EFF0EB]/50 border border-[#0B636B]/10 space-y-3">
            <h4 className="font-display font-bold text-sm text-[#0B636B]">
              Dampak Sirkular Lingkungan
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#0B636B]/8">
                <span className="text-[#0B636B]/70">Sampah Tercegah ke TPA</span>
                <span className="font-bold text-[#64B60A]">
                  {(totalKg * 0.95).toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#0B636B]/8">
                <span className="text-[#0B636B]/70">Estimasi Reduksi Emisi CO₂</span>
                <span className="font-bold text-[#0B636B]">
                  {(totalKg * 1.5).toFixed(1)} kg CO₂e
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#0B636B]/70">Peningkatan Nilai Sirkular</span>
                <span className="font-bold text-[#0B636B]">
                  Rp {totalRupiah.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures for Print Document */}
        <div className="hidden print:grid grid-cols-2 gap-8 pt-12 text-center text-xs">
          <div>
            <p className="text-gray-600">Mengetahui,</p>
            <p className="font-bold text-gray-800 mt-1">Ketua Unit Bank Sampah</p>
            <div className="h-16" />
            <p className="font-bold underline text-gray-800">
              ( {user?.adminBank?.namaPengelola || "...................................."} )
            </p>
          </div>
          <div>
            <p className="text-gray-600">Dicetak pada {new Date().toLocaleDateString("id-ID")},</p>
            <p className="font-bold text-gray-800 mt-1">Petugas Administrasi</p>
            <div className="h-16" />
            <p className="font-bold underline text-gray-800">
              ( .................................... )
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
