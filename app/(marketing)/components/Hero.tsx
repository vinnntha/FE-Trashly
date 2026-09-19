"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Gift,
  Scale,
  Coins,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Layers,
  Box,
  Wine,
  Fuel,
  Users,
  TrendingUp,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { ScrollReveal } from "./ScrollReveal";

type WasteType = {
  id: string;
  name: string;
  label: string;
  ratePerKg: number;
  rupiahPerKg: number;
  icon: typeof Box;
  unit: string;
  rewardExample: string;
};

interface PublicStats {
  totalNasabah: number;
  totalKategoriSampah: number;
  totalTransaksiSetor: number;
  totalHadiah: number;
  totalBeratSampahKg: number;
  totalPoinTersalurkan: number;
}

const WEIGHT_MIN = 1;
const WEIGHT_MAX = 30;
const WEIGHT_PRESETS = [2, 5, 10, 20] as const;

const DEFAULT_WASTE_TYPES: WasteType[] = [
  {
    id: "plastik",
    name: "Botol Plastik PET",
    label: "Plastik PET",
    ratePerKg: 40,
    rupiahPerKg: 4000,
    icon: Box,
    unit: "kg",
    rewardExample: "Saldo E-Wallet / Pulsa",
  },
  {
    id: "kertas",
    name: "Kertas Kardus Bekas",
    label: "Kardus",
    ratePerKg: 25,
    rupiahPerKg: 2500,
    icon: Layers,
    unit: "kg",
    rewardExample: "Voucher Sembako",
  },
  {
    id: "logam",
    name: "Logam & Aluminium",
    label: "Logam",
    ratePerKg: 100,
    rupiahPerKg: 10000,
    icon: Wine,
    unit: "kg",
    rewardExample: "Minyak Goreng 1L",
  },
  {
    id: "minyak",
    name: "Minyak Jelantah",
    label: "Jelantah",
    ratePerKg: 65,
    rupiahPerKg: 6500,
    icon: Fuel,
    unit: "liter",
    rewardExample: "Poin Tabungan Sembako",
  },
];

export default function Hero() {
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>(DEFAULT_WASTE_TYPES);
  const [selectedWasteId, setSelectedWasteId] = useState(DEFAULT_WASTE_TYPES[0].id);
  const [weight, setWeight] = useState(5);
  const [isLiveLoaded, setIsLiveLoaded] = useState(false);
  const [stats, setStats] = useState<PublicStats>({
    totalNasabah: 7,
    totalKategoriSampah: 6,
    totalTransaksiSetor: 15,
    totalHadiah: 4,
    totalBeratSampahKg: 85,
    totalPoinTersalurkan: 1250,
  });

  // Dynamic fetch categories and public stats from backend
  useEffect(() => {
    // 1. Fetch categories
    apiClient<{ data: any[] }>("/kategori-sampah")
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: WasteType[] = res.data.slice(0, 4).map((item: any) => {
            const poin = Number(item.poinPerKg || 10);
            const harga = Number(item.hargaPerKg || poin * 100);
            let iconComponent = Box;
            if (item.jenis === "KERTAS") iconComponent = Layers;
            else if (item.jenis === "LOGAM" || item.jenis === "KACA") iconComponent = Wine;
            else if (item.jenis === "MINYAK") iconComponent = Fuel;

            let example = "Saldo E-Wallet / Pulsa";
            if (harga >= 8000) example = "Minyak Goreng 1L / Beras";
            else if (harga >= 3000) example = "Voucher Sembako";

            return {
              id: item.id,
              name: item.namaKategori,
              label:
                item.namaKategori.length > 15
                  ? item.namaKategori.split("(")[0].trim()
                  : item.namaKategori,
              ratePerKg: poin,
              rupiahPerKg: harga,
              icon: iconComponent,
              unit: "kg",
              rewardExample: example,
            };
          });

          setWasteTypes(mapped);
          setSelectedWasteId(mapped[0].id);
          setIsLiveLoaded(true);
        }
      })
      .catch(() => {});

    // 2. Fetch live stats
    apiClient<{ data: PublicStats }>("/dashboard/public-stats")
      .then((res) => {
        if (res?.data) {
          setStats(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const selectedWaste =
    wasteTypes.find((item) => item.id === selectedWasteId) || wasteTypes[0];

  const totalPoints = selectedWaste.ratePerKg * weight;
  const totalRupiah = selectedWaste.rupiahPerKg * weight;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#CFE26C]/25 via-[#B6F022]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Kolom Kiri: Headline & Value Prop (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-7">
            <ScrollReveal animation="fade-up" duration={600}>
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#B6F022]/20 border border-[#64B60A]/30 text-[#0B636B] text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#64B60A] animate-pulse" />
                <span>Solusi Digital Bank Sampah Modern</span>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100} duration={700}>
              {/* Headline H1 */}
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#0B636B] tracking-tight leading-[1.08]">
                Ubah Sampah Jadi Berkah,{" "}
                <span className="relative inline-block text-[#0B636B]">
                  Pilah Mudah
                  <span className="absolute left-0 bottom-1.5 w-full h-3 bg-[#B6F022] -z-10 rounded-sm -rotate-1" />
                </span>{" "}
                Raih Poin Melimpah.
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200} duration={700}>
              {/* Paragraph Body */}
              <p className="text-base sm:text-lg text-[#0B636B]/85 leading-relaxed max-w-xl">
                Timbang sampah anorganikmu secara transparan, kumpulkan poin reward sirkular, dan tukarkan dengan saldo digital, sembako, atau voucher belanja kebutuhan harian.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300} duration={700}>
              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#0B636B] hover:bg-[#084b51] text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-md shadow-[#0B636B]/25 hover:shadow-lg hover:-translate-y-0.5 group"
                >
                  <span>Mulai Setor Sekarang</span>
                  <ArrowRight className="w-4 h-4 text-[#B6F022] transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#kalkulator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/70 hover:bg-white border border-[#0B636B]/20 text-[#0B636B] font-semibold text-sm transition-all duration-200 shadow-xs hover:-translate-y-0.5"
                >
                  <Calculator className="w-4 h-4 text-[#64B60A]" />
                  <span>Simulasi Poin Setoran</span>
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400} duration={800}>
              {/* Real Impact Stats Bar */}
              <div className="w-full pt-6 border-t border-[#0B636B]/15 grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#64B60A]" />
                    <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B]">
                      {stats.totalNasabah > 0 ? `${stats.totalNasabah}+` : "100+"}
                    </p>
                  </div>
                  <p className="text-xs text-[#0B636B]/70 mt-0.5 font-medium">
                    Nasabah Terdaftar
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#64B60A]" />
                    <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B]">
                      {stats.totalBeratSampahKg > 0 ? `${stats.totalBeratSampahKg.toLocaleString("id-ID")} kg` : "12.5k kg"}
                    </p>
                  </div>
                  <p className="text-xs text-[#0B636B]/70 mt-0.5 font-medium">
                    Sampah Terkelola
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#64B60A]" />
                    <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#64B60A]">
                      {stats.totalPoinTersalurkan > 0 ? `${stats.totalPoinTersalurkan.toLocaleString("id-ID")}` : "50.000+"}
                    </p>
                  </div>
                  <p className="text-xs text-[#0B636B]/70 mt-0.5 font-medium">
                    Poin Tersalurkan
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Kolom Kanan: Interactive Live Waste Calculator (5 cols) */}
          <div id="kalkulator" className="lg:col-span-5 relative">
            <ScrollReveal animation="zoom-in" delay={200} duration={800}>
              {/* Card Container with subtle hover shadow */}
              <div className="relative rounded-3xl bg-white/90 backdrop-blur-md p-6 sm:p-7 border border-[#0B636B]/15 shadow-[0_20px_50px_-12px_rgba(11,99,107,0.18)]">
                {/* Header Card */}
                <div className="flex items-center justify-between pb-5 border-b border-[#0B636B]/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#B6F022]/30 text-[#0B636B]">
                      <Calculator className="w-5 h-5 text-[#0B636B]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-[#0B636B]">
                        Simulasi Poin Setoran
                      </h3>
                      <p className="text-xs text-[#0B636B]/70">
                        {isLiveLoaded ? "Rate resmi terhubung Bank Sampah" : "Hitung nilai sampah sebelum disetor"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#64B60A]/10 text-[#64B60A] border border-[#64B60A]/20">
                    Live Rates
                  </span>
                </div>

                {/* Body Form: Pilih Kategori Sampah */}
                <div className="pt-5 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-2.5">
                      1. Pilih Kategori Sampah
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {wasteTypes.map((waste) => {
                        const Icon = waste.icon;
                        const isSelected = waste.id === selectedWasteId;
                        return (
                          <button
                            key={waste.id}
                            type="button"
                            onClick={() => setSelectedWasteId(waste.id)}
                            className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all duration-150 ${
                              isSelected
                                ? "bg-[#0B636B] text-white border-[#0B636B] shadow-sm shadow-[#0B636B]/20"
                                : "bg-[#EFF0EB]/50 hover:bg-[#EFF0EB] border-[#0B636B]/10 text-[#0B636B]"
                            }`}
                          >
                            <div
                              className={`p-1.5 rounded-lg ${
                                isSelected ? "bg-white/20 text-[#B6F022]" : "bg-white text-[#64B60A]"
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate leading-tight">
                                {waste.label}
                              </p>
                              <p
                                className={`text-[10px] ${
                                  isSelected ? "text-white/75" : "text-[#0B636B]/60"
                                }`}
                              >
                                {waste.ratePerKg} Poin/kg
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slider Bobot Berat */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                        2. Estimasi Berat Sampah
                      </label>
                      <span className="font-display font-black text-base text-[#0B636B] bg-[#B6F022]/30 px-3 py-0.5 rounded-full border border-[#64B60A]/20">
                        {weight} {selectedWaste.unit}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={WEIGHT_MIN}
                      max={WEIGHT_MAX}
                      step="1"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full h-2 bg-[#EFF0EB] rounded-lg appearance-none cursor-pointer accent-[#0B636B]"
                    />
                    <div className="relative h-7 mt-2.5">
                      {WEIGHT_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setWeight(preset)}
                          style={{
                            left: `${((preset - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * 100}%`,
                          }}
                          className={`absolute -translate-x-1/2 whitespace-nowrap text-[11px] py-1 px-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                            weight === preset
                              ? "bg-[#64B60A] text-white font-bold"
                              : "bg-white/80 hover:bg-white text-[#0B636B]/75 border border-[#0B636B]/10"
                          }`}
                        >
                          {preset} {selectedWaste.unit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Output Perhitungan (Interactive Result Box) */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B636B] to-[#084b51] text-white shadow-md relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#B6F022]/15 rounded-full blur-xl pointer-events-none" />

                    <p className="text-[11px] font-semibold text-white/75 uppercase tracking-wider mb-2">
                      Estimasi Reward yang Didapat
                    </p>

                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Coins className="w-5 h-5 text-[#B6F022]" />
                          <span className="font-display font-black text-3xl sm:text-4xl text-[#B6F022] tracking-tight">
                            {totalPoints.toLocaleString("id-ID")}
                          </span>
                          <span className="text-xs font-bold text-white/80 self-end mb-1">
                            Poin
                          </span>
                        </div>
                        <p className="text-xs text-white/70 mt-1 font-medium">
                          Setara Rp {totalRupiah.toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-semibold text-white border border-white/15">
                          <Sparkles className="w-3 h-3 text-[#B6F022]" />
                          <span>Dapat Ditukar</span>
                        </div>
                        <p className="text-xs font-bold text-[#CFE26C] mt-1.5 truncate max-w-[140px]">
                          {selectedWaste.rewardExample}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Link to Register */}
                  <Link
                    href="/register"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#B6F022] hover:bg-[#a5db1d] text-[#0B636B] font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-sm shadow-[#B6F022]/30 hover:shadow"
                  >
                    <span>Mulai Setor {selectedWaste.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
