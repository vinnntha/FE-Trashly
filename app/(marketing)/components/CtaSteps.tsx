"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PackageCheck,
  Scale,
  Gift,
  Coins,
  ChevronRight,
} from "lucide-react";

export default function CtaSteps() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      number: 1,
      title: "Pilah & Siapkan Sampah di Rumah",
      desc: "Kumpulkan sampah anorganik terpilah (botol plastik, kardus, atau kaleng) dalam kondisi bersih dan kering. Cek jenis yang diterima langsung di aplikasi.",
      actionLabel: "Daftar Akun Gratis",
    },
    {
      number: 2,
      title: "Bawa ke Unit Mitra & Timbang Digital",
      desc: "Datang ke bank sampah terdekat di RT, RW, atau sekolah mitra. Admin menimbang sampahmu secara transparan dan data langsung tercatat di aplikasi.",
      actionLabel: "Cari Lokasi Unit",
    },
    {
      number: 3,
      title: "Poin Masuk & Siap Ditukarkan",
      desc: "Poin terakumulasi otomatis seketika setelah penimbangan selesai. Tukarkan kapan saja dengan saldo e-wallet (GoPay/DANA) atau paket sembako.",
      actionLabel: "Tukar Reward",
    },
  ];

  return (
    <section
      id="cara-kerja"
      className="py-20 md:py-28 bg-[#0B636B] text-[#EFF0EB] relative overflow-hidden"
    >
      {/* Subtle organic background decoration */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#64B60A]/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#B6F022]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#CFE26C] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B6F022]" />
            <span>Alur Praktis 3 Langkah</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Bagaimana Trashly Mengubah Sampah Menjadi Berkah
          </h2>
          <p className="text-sm sm:text-base text-[#EFF0EB]/80 mt-4 leading-relaxed">
            Klik tiap langkah di bawah untuk melihat simulasi proses nyata dari rumah
            hingga saldo reward masuk ke akunmu.
          </p>
        </div>

        {/* 2-Column Interactive Walkthrough */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Kolom Kiri: Interactive Mock Preview Card (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl p-7 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between transition-all">
              
              {/* Dynamic Step Content */}
              {activeStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-white/15">
                    <span className="text-xs font-bold text-[#CFE26C] uppercase tracking-wider">
                      Langkah 1 • Pemilahan
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B6F022] text-[#0B636B] font-bold">
                      Pra-Setoran
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <PackageCheck className="w-4 h-4 text-[#B6F022]" />
                      <span>Checklist Mandiri di Rumah:</span>
                    </div>
                    <ul className="text-xs text-[#EFF0EB]/85 space-y-1.5 pl-6 list-disc">
                      <li>Botol plastik PET dicuci bersih & dikeringkan</li>
                      <li>Kardus/kertas dilipat rapi dan diikat</li>
                      <li>Pisahkan logam/kaleng dari sampah basah</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 text-xs text-[#CFE26C] flex items-center justify-between">
                    <span>Estimasi Muatan:</span>
                    <strong className="text-white">~3.5 kg Terpilah</strong>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-white/15">
                    <span className="text-xs font-bold text-[#CFE26C] uppercase tracking-wider">
                      Langkah 2 • Penimbangan
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B6F022] text-[#0B636B] font-bold">
                      Di Unit Mitra
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#EFF0EB]/70">
                      <span>Lokasi: Bank Sampah Melati 03</span>
                      <span className="text-[#B6F022] font-semibold">Timbangan Aktif</span>
                    </div>
                    
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <div className="text-[11px] text-[#EFF0EB]/60">Hasil Timbang:</div>
                        <div className="font-display font-bold text-3xl text-white">
                          4.20 <span className="text-sm font-normal text-[#EFF0EB]/70">kg</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#64B60A] text-white text-xs font-bold">
                        Tervalidasi Petugas
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 text-xs text-[#CFE26C] flex items-center justify-between">
                    <span>Kategori Terbanyak:</span>
                    <strong className="text-white">Plastik PET (Grade A)</strong>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-white/15">
                    <span className="text-xs font-bold text-[#CFE26C] uppercase tracking-wider">
                      Langkah 3 • Poin & Hadiah
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#64B60A] text-white font-bold">
                      Selesai
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#EFF0EB]/70">Poin Baru Masuk:</span>
                      <span className="text-[#B6F022] font-extrabold text-sm">+420 Poin</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                      <span className="text-xs text-[#EFF0EB]/80">Total Saldo Aktif:</span>
                      <span className="font-display font-extrabold text-3xl text-[#B6F022]">
                        1.420 <span className="text-xs text-[#CFE26C]">Pts</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#B6F022]/20 border border-[#B6F022]/30 text-xs text-white flex items-center justify-between">
                    <span>Opsi Penukaran:</span>
                    <strong className="text-[#B6F022]">Tersedia 6 Hadiah</strong>
                  </div>
                </div>
              )}

              {/* Bottom Quick Action */}
              <div className="pt-4 border-t border-white/15 mt-4 flex items-center justify-between">
                <span className="text-xs text-[#EFF0EB]/70">
                  Langkah {activeStep} dari 3
                </span>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] text-xs font-bold transition-all shadow-xs"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

          {/* Kolom Kanan: 3 Interactive Clickable Step Panels (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
            {steps.map((step) => {
              const isSelected = activeStep === step.number;
              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(step.number)}
                  className={`p-6 rounded-3xl transition-all duration-200 cursor-pointer border text-left ${
                    isSelected
                      ? "bg-white/15 border-[#B6F022] shadow-[0_8px_30px_-6px_rgba(0,0,0,0.3)] translate-x-1"
                      : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Number Badge */}
                    <div
                      className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center font-display font-extrabold text-base transition-colors ${
                        isSelected
                          ? "bg-[#B6F022] text-[#0B636B] shadow-sm"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {step.number}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-display font-bold text-lg transition-colors ${
                            isSelected ? "text-[#B6F022]" : "text-white"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${
                            isSelected
                              ? "text-[#B6F022] rotate-90"
                              : "text-white/40"
                          }`}
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-[#EFF0EB]/80 mt-1.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom Final CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-base transition-all duration-200 shadow-[0_6px_24px_-4px_rgba(182,240,34,0.6)] active:scale-95"
              >
                <span>Daftar Sekarang & Mulai Setor</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
