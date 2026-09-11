"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import StatusBadge from "@/components/nasabah/StatusBadge";
import JenisSampahBadge from "@/components/nasabah/JenisSampahBadge";
import EmptyState from "@/components/nasabah/EmptyState";
import {
  Printer,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Phone,
  Building2,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

interface DetailItem {
  id: string;
  namaKategori: string;
  jenis: string;
  hargaPerKg: number;
  poinPerKg: number;
  beratKg: number;
  beratKgReal?: number | null;
  subtotalPoin: number;
}

interface StrukSetorData {
  id: string;
  kodeSetor: string;
  tanggal: string;
  status: string;
  totalBeratKg: number;
  totalPoin: number;
  catatan?: string | null;
  catatanAdmin?: string | null;
  nasabah: {
    id: string;
    namaNasabah: string;
    alamat: string;
    telp: string;
  };
  admin?: {
    id: string;
    namaUnit: string;
    namaPengelola: string;
    telp: string;
  } | null;
  items: DetailItem[];
}

export default function NotaSetorPage({
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
  } = useQuery<{ message: string; data: StrukSetorData }>({
    queryKey: ["nota-setor", id],
    queryFn: () => apiClient<{ message: string; data: StrukSetorData }>(`/setor-sampah/${id}`),
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
          <p className="text-sm font-semibold text-[#0B636B]">Memuat nota transaksi...</p>
        </div>
      </main>
    );
  }

  if (isError || !nota) {
    return (
      <EmptyState
        title="Nota Tidak Ditemukan"
        description="Transaksi setoran sampah tidak ditemukan atau Anda tidak memiliki akses ke data ini."
        actionLabel="Kembali ke Riwayat"
        actionHref="/riwayat"
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
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Action Bar (hidden on print) */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link
          href="/riwayat"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0B636B] hover:text-[#64B60A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B636B] hover:bg-[#08494f] text-[#EFF0EB] font-bold text-xs transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4 text-[#B6F022]" />
          <span>Cetak Bukti Nota</span>
        </button>
      </div>

      {/* Printable Receipt Paper Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0B636B]/15 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Kop Surat / Header Nota */}
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
              Platform Bank Sampah Digital & Ekonomi Sirkular
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-[#0B636B]/60 tracking-wider">
              Bukti Transaksi Setoran
            </span>
            <p className="font-mono font-extrabold text-base sm:text-lg text-[#0B636B]">
              {nota.kodeSetor}
            </p>
            <div className="mt-1">
              <StatusBadge status={nota.status} type="setor" />
            </div>
          </div>
        </div>

        {/* Transaction Meta & Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#0B636B]">
          {/* Nasabah */}
          <div className="p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 space-y-2">
            <p className="font-bold text-[11px] uppercase tracking-wider text-[#0B636B]/60">
              Data Nasabah Penyetor
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

          {/* Unit & Tanggal */}
          <div className="p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 space-y-2">
            <p className="font-bold text-[11px] uppercase tracking-wider text-[#0B636B]/60">
              Waktu & Unit Penerima
            </p>
            <p className="text-[#0B636B] flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#64B60A]" />
              <span>{formatDate(nota.tanggal)}</span>
            </p>
            {nota.admin ? (
              <div className="space-y-1 pt-1">
                <p className="font-bold text-[#0B636B] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#64B60A]" />
                  <span>{nota.admin.namaUnit}</span>
                </p>
                <p className="text-[#0B636B]/70">
                  Petugas: {nota.admin.namaPengelola} ({nota.admin.telp})
                </p>
              </div>
            ) : (
              <p className="text-[#0B636B]/60 italic pt-1">
                Menunggu penugasan verifikasi unit bank sampah
              </p>
            )}
          </div>
        </div>

        {/* Breakdown Items Table */}
        <div>
          <h4 className="font-display font-bold text-sm text-[#0B636B] mb-3">
            Rincian Sampah Terpilah
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#0B636B]/20 text-[#0B636B]/70 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Jenis</th>
                  <th className="py-2.5 px-3 text-right">Berat (kg)</th>
                  <th className="py-2.5 px-3 text-right">Rate Poin</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B636B]/10">
                {nota.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#EFF0EB]/40">
                    <td className="py-3 px-3 font-semibold text-[#0B636B]/60">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#0B636B]">
                      {item.namaKategori}
                    </td>
                    <td className="py-3 px-3">
                      <JenisSampahBadge jenis={item.jenis} showIcon={false} />
                    </td>
                    <td className="py-3 px-3 text-right font-medium">
                      {item.beratKgReal ?? item.beratKg} kg
                      {item.beratKgReal !== undefined && item.beratKgReal !== null && (
                        <span className="block text-[10px] text-[#64B60A] font-semibold">
                          (Verified)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-[#0B636B]/80">
                      {item.poinPerKg} poin/kg
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#64B60A]">
                      +{item.subtotalPoin} Poin
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B636B] text-[#EFF0EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#CFE26C] font-semibold">
              Total Akumulasi Penimbangan
            </p>
            <p className="text-xs text-[#EFF0EB]/80 mt-0.5">
              Total Berat Sampah: <strong>{nota.totalBeratKg} kg</strong>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#EFF0EB]/70">
              Total Poin Diperoleh
            </span>
            <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#B6F022]">
              +{nota.totalPoin.toLocaleString("id-ID")} POIN
            </p>
          </div>
        </div>

        {/* Notes & Verification Stamp */}
        {(nota.catatan || nota.catatanAdmin) && (
          <div className="space-y-2 pt-2 text-xs text-[#0B636B]/80">
            {nota.catatan && (
              <p>
                <strong>Catatan Nasabah:</strong> {nota.catatan}
              </p>
            )}
            {nota.catatanAdmin && (
              <p className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <strong>Catatan Verifikasi Petugas:</strong> {nota.catatanAdmin}
              </p>
            )}
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="pt-6 border-t border-dashed border-[#0B636B]/20 text-center text-[11px] text-[#0B636B]/60">
          <p>
            Struk ini adalah bukti pencatatan resmi penimbangan sampah digital Trashly Indonesia.
          </p>
          <p className="font-mono mt-1">Dicetak pada {new Date().toLocaleString("id-ID")}</p>
        </div>
      </div>
    </div>
  );
}
