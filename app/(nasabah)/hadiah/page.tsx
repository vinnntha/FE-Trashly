"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { getImageUrl } from "@/lib/image";
import { useAuth } from "@/context/AuthContext";
import SkeletonCard from "@/components/nasabah/SkeletonCard";
import EmptyState from "@/components/nasabah/EmptyState";
import {
  Gift,
  History,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";

interface HadiahItem {
  id: string;
  namaHadiah: string;
  poinDibutuhkan: number;
  stok: number;
  foto?: string | null;
}

export default function KatalogHadiahPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // State for modal confirmation
  const [selectedHadiah, setSelectedHadiah] = useState<HadiahItem | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    namaHadiah: string;
    kodePenukaran: string;
    sisaSaldoPoin: number;
    id: string;
  } | null>(null);

  // Fetch current user summary to get live active points
  const { data: summaryRes } = useQuery<{
    message: string;
    data: { saldoPoinSaatIni: number };
  }>({
    queryKey: ["dashboard-summary"],
    queryFn: () =>
      apiClient<{ message: string; data: { saldoPoinSaatIni: number } }>(
        "/dashboard/summary"
      ),
  });

  const saldoPoin =
    summaryRes?.data?.saldoPoinSaatIni ?? user?.nasabah?.saldoPoin ?? 0;

  // Fetch Hadiah catalog
  const {
    data: hadiahRes,
    isLoading,
    isError,
    refetch,
  } = useQuery<{ message: string; data: HadiahItem[] }>({
    queryKey: ["hadiah-list"],
    queryFn: () => apiClient<{ message: string; data: HadiahItem[] }>("/hadiah"),
  });

  const hadiahList = hadiahRes?.data || [];

  // Tukar Poin Mutation
  const tukarMutation = useMutation({
    mutationFn: (hadiahId: string) => {
      return apiClient<{ message: string; data: any }>("/penukaran-poin/tukar", {
        method: "POST",
        body: JSON.stringify({ hadiahId }),
      });
    },
    onSuccess: (res) => {
      // Invalidate queries so that dashboard summary and hadiah stock update instantly
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["hadiah-list"] });
      queryClient.invalidateQueries({ queryKey: ["penukaran-list"] });

      setSuccessInfo({
        namaHadiah: res.data.hadiah?.namaHadiah || selectedHadiah?.namaHadiah || "",
        kodePenukaran: res.data.kodePenukaran,
        sisaSaldoPoin: res.data.sisaSaldoPoin,
        id: res.data.id,
      });

      setSelectedHadiah(null);
    },
  });

  const handleConfirmTukar = () => {
    if (!selectedHadiah) return;
    tukarMutation.mutate(selectedHadiah.id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>Katalog Reward</span>
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B636B] tracking-tight">
            Tukar Poin Sampah Jadi Hadiah 🎁
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/75 mt-1">
            Gunakan tabungan poin sampah Anda untuk mendapatkan sembako, voucher belanja, dan hadiah ramah lingkungan.
          </p>
        </div>

        <Link
          href="/hadiah/riwayat"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-white/80 border border-[#0B636B]/15 text-[#0B636B] font-semibold text-xs transition-colors shadow-sm shrink-0 self-start sm:self-auto"
        >
          <History className="w-4 h-4 text-[#64B60A]" />
          <span>Histori Penukaran</span>
        </Link>
      </div>

      {/* Saldo Poin Live Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0B636B] text-[#EFF0EB] shadow-[0_16px_40px_-10px_rgba(11,99,107,0.3)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#B6F022]/20 text-[#B6F022] flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#EFF0EB]/70">Poin Anda Siap Ditukar</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#B6F022]">
                {Number(saldoPoin).toLocaleString("id-ID")}
              </span>
              <span className="text-xs font-bold text-[#CFE26C]">POIN TERSEDIA</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#EFF0EB]/70 max-w-xs">
          Poin tidak kedaluwarsa selama akun Anda aktif di bank sampah unit Trashly.
        </p>
      </div>

      {/* Success Notification Alert */}
      {successInfo && (
        <div className="p-5 rounded-3xl bg-teal-50 border border-teal-200 text-[#0B636B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#64B60A] shrink-0" />
            <div>
              <p className="font-bold text-sm">
                Penukaran Berhasil! ({successInfo.kodePenukaran})
              </p>
              <p className="text-xs text-[#0B636B]/80 mt-0.5">
                Selamat! Anda berhasil menukar <strong>{successInfo.namaHadiah}</strong>. Sisa saldo poin:{" "}
                <strong>{successInfo.sisaSaldoPoin} Poin</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/nota/tukar/${successInfo.id}`}
              className="px-4 py-2 rounded-full bg-[#0B636B] text-[#EFF0EB] font-bold text-xs hover:bg-[#08484e] transition-colors"
            >
              Lihat Bukti Nota
            </Link>
            <button
              onClick={() => setSuccessInfo(null)}
              className="p-2 rounded-full hover:bg-teal-100 text-[#0B636B]/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Catalog Grid */}
      {isLoading ? (
        <SkeletonCard count={6} />
      ) : isError ? (
        <EmptyState
          title="Gagal Memuat Katalog Hadiah"
          description="Terjadi gangguan saat mengambil data hadiah. Silakan coba lagi."
          actionLabel="Coba Lagi"
          onAction={() => refetch()}
        />
      ) : hadiahList.length === 0 ? (
        <EmptyState
          title="Belum Ada Hadiah Tersedia"
          description="Pengelola bank sampah sedang memperbarui stok hadiah. Silakan periksa kembali beberapa saat lagi."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hadiahList.map((item) => {
            const isOutOfStock = item.stok === 0;
            const isPointInsufficient = saldoPoin < item.poinDibutuhkan;
            const isDisabled = isOutOfStock || isPointInsufficient;

            let buttonLabel = "Tukar Hadiah";
            let reasonLabel = "";
            if (isOutOfStock) {
              buttonLabel = "Stok Habis";
              reasonLabel = "Stok hadiah sedang kosong";
            } else if (isPointInsufficient) {
              buttonLabel = "Poin Tidak Cukup";
              reasonLabel = `Kurang ${(item.poinDibutuhkan - saldoPoin).toLocaleString("id-ID")} poin`;
            }

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white border border-[#0B636B]/12 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Photo / Container */}
                  <div className="relative w-full h-48 bg-[#EFF0EB] overflow-hidden flex items-center justify-center">
                    {item.foto ? (
                      <Image
                        src={getImageUrl(item.foto)}
                        alt={item.namaHadiah}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#0B636B]/30">
                        <Gift className="w-14 h-14 text-[#0B636B]/40" />
                        <span className="text-[11px] font-semibold text-[#0B636B]/50">
                          Foto Segera Tersedia
                        </span>
                      </div>
                    )}

                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${
                          isOutOfStock
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-white/95 text-[#0B636B] border-[#0B636B]/15"
                        }`}
                      >
                        {isOutOfStock ? "Habis" : `Sisa Stok: ${item.stok}`}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-[#0B636B] tracking-tight mb-2">
                      {item.namaHadiah}
                    </h3>

                    <div className="flex items-baseline gap-2 pt-3 border-t border-[#0B636B]/10">
                      <span className="font-display font-extrabold text-2xl text-[#64B60A]">
                        {item.poinDibutuhkan.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs font-bold text-[#0B636B]/70">
                        POIN DIPERLUKAN
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tukar Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedHadiah(item)}
                    disabled={isDisabled}
                    title={reasonLabel}
                    className={`w-full py-3 px-4 rounded-full font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                      isDisabled
                        ? "bg-[#EFF0EB] text-[#0B636B]/40 cursor-not-allowed border border-[#0B636B]/10"
                        : "bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] active:scale-95 shadow-[0_4px_16px_-4px_rgba(182,240,34,0.6)]"
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>{buttonLabel}</span>
                  </button>
                  {reasonLabel && (
                    <p className="text-[11px] text-center text-[#0B636B]/50 mt-1.5 font-medium">
                      {reasonLabel}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedHadiah && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#0B636B]/15 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF0EB] text-[#64B60A] flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <button
                onClick={() => setSelectedHadiah(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-[#0B636B]">
                Konfirmasi Penukaran Poin
              </h3>
              <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-1">
                Apakah Anda yakin ingin menukar poin Anda dengan reward berikut?
              </p>
            </div>

            {/* Breakdown Box */}
            <div className="p-4 rounded-2xl bg-[#EFF0EB]/70 border border-[#0B636B]/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#0B636B]/70">Nama Hadiah:</span>
                <span className="font-bold text-[#0B636B]">{selectedHadiah.namaHadiah}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0B636B]/70">Poin Dibutuhkan:</span>
                <span className="font-bold text-amber-700">
                  -{selectedHadiah.poinDibutuhkan} Poin
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#0B636B]/10">
                <span className="text-[#0B636B]/70">Sisa Poin Anda:</span>
                <span className="font-bold text-[#64B60A]">
                  {(saldoPoin - selectedHadiah.poinDibutuhkan).toLocaleString("id-ID")} Poin
                </span>
              </div>
            </div>

            {tukarMutation.isError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {tukarMutation.error instanceof Error
                    ? tukarMutation.error.message
                    : "Gagal menukar poin. Silakan coba lagi."}
                </span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedHadiah(null)}
                className="flex-1 py-3 px-4 rounded-full border border-[#0B636B]/20 text-[#0B636B] font-semibold text-xs hover:bg-[#EFF0EB] transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmTukar}
                disabled={tukarMutation.isPending}
                className="flex-1 py-3 px-4 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-xs transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {tukarMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-[#0B636B] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Tukar Sekarang</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
