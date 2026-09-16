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
} from "lucide-react";

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
    id: "kaca",
    name: "Kaca & Botol Beling",
    label: "Kaca",
    ratePerKg: 15,
    rupiahPerKg: 1500,
    icon: Wine,
    unit: "kg",
    rewardExample: "Poin Tabungan Sembako",
  },
];

export default function Hero() {
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>(DEFAULT_WASTE_TYPES);
  const [selectedWasteId, setSelectedWasteId] = useState(DEFAULT_WASTE_TYPES[0].id);
  const [weight, setWeight] = useState(5);
  const [isLiveLoaded, setIsLiveLoaded] = useState(false);

  // Dynamic fetch from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/kategori-sampah")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil kategori");
        return res.json();
      })
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
      .catch(() => {
        // graceful fallback to DEFAULT_WASTE_TYPES
      });
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
          
          {/* Kolom Kiri: Copywriting & Trust Evidence (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#0B636B]/15 text-[#0B636B] text-xs font-semibold mb-6 shadow-xs backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#64B60A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#64B60A]"></span>
              </span>
              <span>Sistem Bank Sampah Terintegrasi Timbangan Digital</span>
            </div>

            {/* Headline Editorial */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B636B] tracking-tight leading-[1.12] mb-6">
              Ubah Pilahan Sampah Jadi{" "}
              <span className="relative inline-block text-[#0B636B]">
                <span className="relative z-10">Poin Bernilai</span>
                <span className="absolute left-0 bottom-1 w-full h-3 bg-[#B6F022]/60 -z-0 rounded-xs" />
              </span>{" "}
              & Saldo Bermanfaat.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#0B636B]/80 font-normal leading-relaxed mb-8 max-w-xl">
              Trashly menghubungkan warga, sekolah, dan unit bank sampah dengan sistem
              penimbangan presisi. Pilah sampah di rumah, setor tanpa antre lama,
              dan cairkan poin jadi saldo atau sembako kapan saja.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-base transition-all duration-200 shadow-[0_4px_20px_-4px_rgba(182,240,34,0.7)] hover:shadow-[0_8px_24px_-2px_rgba(182,240,34,0.85)] active:scale-95"
              >
                <span>Buka Akun Nasabah</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#kalkulator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/70 hover:bg-white border border-[#0B636B]/20 text-[#0B636B] font-semibold text-sm transition-all duration-200 shadow-xs"
              >
                <Calculator className="w-4 h-4 text-[#64B60A]" />
                <span>Simulasi Poin Setoran</span>
              </a>
            </div>

            {/* Real Impact Stats Bar */}
            <div className="w-full pt-6 border-t border-[#0B636B]/15 grid grid-cols-3 gap-4">
              <div>
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B]">
                  45+
                </p>
                <p className="text-xs text-[#0B636B]/70 mt-0.5 font-medium">
                  Unit Bank Sampah
                </p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B]">
                  12.5k+
                </p>
                <p className="text-xs text-[#0B636B]/70 mt-0.5 font-medium">
                  Kg Sampah Terpilah
                </p>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#64B60A]">
                  100%
                </p>
                <p className="text-xs text-[#0B636B]/70 mt-0.5 font-medium">
                  Timbangan Akurat
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Interactive Live Waste Calculator (5 cols) */}
          <div id="kalkulator" className="lg:col-span-5 relative">
            {/* Card Container with subtle float animation */}
            <div className="relative rounded-3xl bg-white/90 backdrop-blur-md p-6 sm:p-7 border border-[#0B636B]/15 shadow-[0_20px_50px_-12px_rgba(11,99,107,0.18)]">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#0B636B]/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0B636B] text-[#B6F022] flex items-center justify-center shadow-xs">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0B636B]">
                      Simulasi Poin Setoran
                    </h3>
                    <p className="text-xs text-[#0B636B]/70">Hitung nilai sampah sebelum disetor</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] border border-[#64B60A]/20">
                  {isLiveLoaded ? "Live DB Rate" : "Rate Resmi"}
                </span>
              </div>

              {/* Waste Type Selector Chips */}
              <div className="mt-5">
                <label className="text-xs font-semibold text-[#0B636B]/80 block mb-2">
                  1. Pilih Kategori Sampah
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {wasteTypes.map((type) => {
                    const isSelected = type.id === selectedWasteId;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedWasteId(type.id)}
                        className={`text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                          isSelected
                            ? "bg-[#0B636B] text-[#EFF0EB] border-[#0B636B] shadow-xs"
                            : "bg-[#EFF0EB]/60 hover:bg-[#EFF0EB] text-[#0B636B] border-[#0B636B]/10"
                        }`}
                      >
                        <span className="truncate mr-1">{type.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 ${
                            isSelected
                              ? "bg-white/20 text-[#B6F022]"
                              : "bg-white text-[#0B636B]/70"
                          }`}
                        >
                          {type.ratePerKg} pt
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight Slider with dynamic numbers */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#0B636B]/80">
                    2. Estimasi Berat Sampah
                  </label>
                  <span className="font-display font-extrabold text-base text-[#0B636B]">
                    {weight}{" "}
                    <span className="text-xs font-medium text-[#0B636B]/70">
                      {selectedWaste.unit}
                    </span>
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-slider cursor-pointer"
                />

                {/* Quick select buttons */}
                <div className="flex items-center justify-between gap-1.5 mt-2.5">
                  {[2, 5, 10, 20].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWeight(preset)}
                      className={`text-[11px] py-1 px-2.5 rounded-lg font-medium transition-all cursor-pointer ${
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

              {/* Live Output Box */}
              <div className="mt-6 p-4 rounded-2xl bg-[#EFF0EB] border border-[#0B636B]/10 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium text-[#0B636B]/70">
                    Perolehan Poin:
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-3xl text-[#0B636B] tracking-tight">
                      {totalPoints.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs font-bold text-[#64B60A]">POIN</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#0B636B]/10 text-xs">
                  <span className="text-[#0B636B]/70">Estimasi Nilai Rupiah:</span>
                  <span className="font-bold text-[#0B636B]">
                    Rp {totalRupiah.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#0B636B]/10 flex items-center gap-2 text-xs text-[#0B636B]">
                  <Gift className="w-4 h-4 text-[#64B60A] shrink-0" />
                  <span className="text-[11px]">
                    Bisa ditukar: <strong className="font-semibold">{selectedWaste.rewardExample}</strong>
                  </span>
                </div>
              </div>

              {/* Bottom Card CTA */}
              <div className="mt-5">
                <Link
                  href="/register"
                  className="w-full py-3 px-4 rounded-xl bg-[#0B636B] hover:bg-[#084e55] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Mulai Setor {selectedWaste.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#B6F022]" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
