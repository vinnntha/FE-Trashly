"use client";

import Link from "next/link";
import { Recycle, Award, PlusCircle, Gift, ArrowRight, ShieldCheck } from "lucide-react";

interface SummaryCardProps {
  saldoPoin: number;
  nasabahName?: string;
  nasabahId?: string;
}

export default function SummaryCard({
  saldoPoin,
  nasabahName = "Nasabah",
  nasabahId,
}: SummaryCardProps) {
  return (
    <div className="bg-[#0B636B] text-[#EFF0EB] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(11,99,107,0.35)] border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
      {/* Decorative Recycling Cycle Background Motif */}
      <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 pointer-events-none select-none">
        <Recycle className="w-56 h-56 sm:w-64 sm:h-64 text-white" />
      </div>

      {/* Card Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B6F022]/20 flex items-center justify-center text-[#B6F022] border border-[#B6F022]/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#EFF0EB]/70 leading-none">Kartu Tabungan Sampah</p>
              <p className="text-sm font-bold text-white mt-1">Eco Champion Trashly</p>
            </div>
          </div>

          {nasabahId && (
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/10 text-[#CFE26C] border border-white/10">
              ID: #{nasabahId.slice(0, 8)}
            </span>
          )}
        </div>

        {/* Saldo Poin Display */}
        <div className="my-3 sm:my-5">
          <p className="text-xs font-semibold text-[#EFF0EB]/70 uppercase tracking-wider">
            Saldo Poin Kamu
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-display font-extrabold text-5xl sm:text-6xl text-[#B6F022] tracking-tight">
              {Number(saldoPoin || 0).toLocaleString("id-ID")}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#CFE26C] tracking-wide">
              POIN
            </span>
          </div>
          <p className="text-xs text-[#EFF0EB]/70 mt-2">
            Estimasi nilai manfaat setara Rp {(Number(saldoPoin || 0) * 100).toLocaleString("id-ID")} voucher sembako & e-wallet
          </p>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="relative z-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-[#CFE26C] font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#B6F022]" />
          <span>Status Akun Aktif</span>
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
            <span>Tukar Poin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
