"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { getImageUrl } from "@/lib/image";
import StatusBadge from "@/components/nasabah/StatusBadge";
import EmptyState from "@/components/nasabah/EmptyState";
import {
  Printer,
  ArrowLeft,
  Calendar,
  Gift,
  MapPin,
  Phone,
  User,
  Sparkles,
} from "lucide-react";

interface NotaTukarData {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  status: string;
  poinTerpakai: number;
  nasabah: {
    id: string;
    namaNasabah: string;
    alamat: string;
    telp: string;
  };
  hadiah: {
    id: string;
    namaHadiah: string;
    poinDibutuhkan: number;
    foto?: string | null;
  };
}

export default function NotaTukarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const {
    data: resData,
    isLoading,
    isError,
  } = useQuery<{ message: string; data: NotaTukarData }>({
    queryKey: ["nota-tukar", id],
    queryFn: () => apiClient<{ message: string; data: NotaTukarData }>(`/penukaran-poin/nota/${id}`),
  });

  const nota = resData?.data;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0B636B] border-t-[#B6F022] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#0B636B]">Memuat nota penukaran...</p>
        </div>
      </main>
    );
  }

  if (isError || !nota) {
    return (
      <EmptyState
        title="Nota Tidak Ditemukan"
        description="Transaksi penukaran poin tidak ditemukan atau Anda tidak memiliki akses ke data ini."
        actionLabel="Kembali ke Hadiah"
        actionHref="/hadiah/riwayat"
      />
    );
  }

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Action Bar (hidden on print) */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link
          href="/hadiah/riwayat"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0B636B] hover:text-[#64B60A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Histori</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B636B] hover:bg-[#08494f] text-[#EFF0EB] font-bold text-xs transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4 text-[#B6F022]" />
          <span>Cetak Bukti Nota</span>
        </button>
      </div>

      {/* Printable Receipt Paper */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0B636B]/15 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Header Nota */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-[#0B636B]/20">
          <div>
            <Image
              src="/images/Full Logo Trashly.png"
              alt="Trashly Logo"
              width={140}
              height={44}
              priority
              className="h-9 w-auto object-contain mb-2"
            />
            <p className="text-xs text-[#0B636B]/70">
              Bukti Pengambilan & Penukaran Reward
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-[#0B636B]/60 tracking-wider">
              Kode Penukaran
            </span>
            <p className="font-mono font-extrabold text-base sm:text-lg text-[#0B636B]">
              {nota.kodePenukaran}
            </p>
            <div className="mt-1">
              <StatusBadge status={nota.status} type="penukaran" />
            </div>
          </div>
        </div>

        {/* Nasabah & Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#0B636B]">
          <div className="p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 space-y-2">
            <p className="font-bold text-[11px] uppercase tracking-wider text-[#0B636B]/60">
              Penerima Reward
            </p>
            <p className="font-bold text-sm text-[#0B636B]">
              {nota.nasabah.namaNasabah}
            </p>
            <p className="text-[#0B636B]/80 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#64B60A]" />
              <span>{nota.nasabah.alamat}</span>
            </p>
            <p className="text-[#0B636B]/80 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0 text-[#64B60A]" />
              <span>{nota.nasabah.telp}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 space-y-2">
            <p className="font-bold text-[11px] uppercase tracking-wider text-[#0B636B]/60">
              Waktu Transaksi
            </p>
            <p className="text-[#0B636B] flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#64B60A]" />
              <span>{formatDate(nota.tanggal)}</span>
            </p>
            <p className="text-[11px] text-[#0B636B]/70 pt-2">
              Tunjukkan bukti nota ini kepada petugas bank sampah unit saat pengambilan barang reward.
            </p>
          </div>
        </div>

        {/* Reward Detail Box */}
        <div className="p-5 rounded-3xl bg-[#EFF0EB]/60 border border-[#0B636B]/12 flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl bg-white overflow-hidden shrink-0 border border-[#0B636B]/10 flex items-center justify-center">
            {nota.hadiah.foto ? (
              <Image
                src={getImageUrl(nota.hadiah.foto)}
                alt={nota.hadiah.namaHadiah}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <Gift className="w-8 h-8 text-[#0B636B]/40" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold text-[#64B60A] tracking-wider">
              Barang Reward
            </span>
            <h3 className="font-display font-bold text-lg text-[#0B636B] truncate">
              {nota.hadiah.namaHadiah}
            </h3>
            <p className="text-xs text-[#0B636B]/70 mt-0.5">
              Kategori Hadiah Resmi Trashly
            </p>
          </div>
        </div>

        {/* Total Points Deducted */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B636B] text-[#EFF0EB] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#CFE26C] font-semibold">
              Total Poin Ditukarkan
            </p>
            <p className="text-xs text-[#EFF0EB]/70 mt-0.5">
              Saldo otomatis terpotong dari tabungan nasabah
            </p>
          </div>

          <div className="text-right">
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-amber-300">
              -{nota.poinTerpakai.toLocaleString("id-ID")} POIN
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-dashed border-[#0B636B]/20 text-center text-[11px] text-[#0B636B]/60">
          <p>
            Simpan atau cetak nota ini sebagai bukti penukaran resmi Trashly Indonesia.
          </p>
          <p className="font-mono mt-1">Dicetak pada {new Date().toLocaleString("id-ID")}</p>
        </div>
      </div>
    </div>
  );
}
