"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Scale,
  Calendar,
  User,
  Phone,
  Coins,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  Sparkles,
} from "lucide-react";

interface SetorDetailItem {
  id: string;
  kategoriSampahId: string;
  namaKategori: string;
  jenis: string;
  hargaPerKg: number;
  poinPerKg: number;
  beratKg: number;
  beratKgReal: number | null;
  subtotalPoin: number;
}

interface SetorDetailResponse {
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
    telp: string;
    alamat: string;
  };
  items: SetorDetailItem[];
}

interface VerifySetorModalProps {
  setorId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function VerifySetorModal({
  setorId,
  isOpen,
  onClose,
  onSuccess,
}: VerifySetorModalProps) {
  const queryClient = useQueryClient();

  // Local state for weights, status, and admin note
  const [realWeights, setRealWeights] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<string>("diverifikasi");
  const [catatanAdmin, setCatatanAdmin] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Irreversible confirmation dialog for "selesai" status
  const [isConfirmSelesaiOpen, setIsConfirmSelesaiOpen] = useState(false);

  // 1. Fetch full detail setoran when modal is opened
  const { data: detail, isLoading: isFetchingDetail } = useQuery<SetorDetailResponse>({
    queryKey: ["setor-detail", setorId],
    queryFn: async () => {
      if (!setorId) throw new Error("Setor ID is missing");
      const res = await apiClient<{ data: SetorDetailResponse }>(
        `/setor-sampah/${setorId}`
      );
      return res.data;
    },
    enabled: !!setorId && isOpen,
  });

  // Initialize weights & notes when detail is loaded
  useEffect(() => {
    if (detail) {
      const initialWeights: Record<string, number> = {};
      detail.items.forEach((item) => {
        initialWeights[item.kategoriSampahId] =
          item.beratKgReal ?? item.beratKg;
      });
      setRealWeights(initialWeights);
      setStatus(
        detail.status.toLowerCase() === "menunggu_konfirmasi"
          ? "diverifikasi"
          : detail.status.toLowerCase()
      );
      setCatatanAdmin(detail.catatanAdmin || "");
      setErrorMsg(null);
    }
  }, [detail]);

  // 2. Live Preview Calculation of Total Points & Total Weight
  const { previewTotalBerat, previewTotalPoin } = useMemo(() => {
    if (!detail) return { previewTotalBerat: 0, previewTotalPoin: 0 };

    let totalBerat = 0;
    let totalPoin = 0;

    detail.items.forEach((item) => {
      const weight = realWeights[item.kategoriSampahId] ?? item.beratKg;
      totalBerat += weight;
      totalPoin += Number((weight * item.poinPerKg).toFixed(2));
    });

    return {
      previewTotalBerat: Number(totalBerat.toFixed(2)),
      previewTotalPoin: Number(totalPoin.toFixed(2)),
    };
  }, [detail, realWeights]);

  // Mutation to verify setoran
  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!setorId || !detail) return;

      const itemsReal = detail.items.map((item) => ({
        kategoriSampahId: item.kategoriSampahId,
        beratKgReal: Number(realWeights[item.kategoriSampahId] ?? item.beratKg),
      }));

      return apiClient<{ message: string; data: any }>(
        `/setor-sampah/admin/verify/${setorId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status,
            catatanAdmin: catatanAdmin.trim(),
            itemsReal,
          }),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setoran-admin-list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setIsConfirmSelesaiOpen(false);
      onSuccess();
      onClose();
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || "Gagal memverifikasi setoran sampah.");
      setIsConfirmSelesaiOpen(false);
    },
  });

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!catatanAdmin.trim()) {
      setErrorMsg("Catatan admin wajib diisi.");
      return;
    }

    // Check if any real weight is <= 0
    for (const key of Object.keys(realWeights)) {
      if (realWeights[key] <= 0) {
        setErrorMsg("Berat timbangan real harus lebih besar dari 0 kg.");
        return;
      }
    }

    // If status is 'selesai', prompt double confirmation
    if (status === "selesai") {
      setIsConfirmSelesaiOpen(true);
    } else {
      verifyMutation.mutate();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={!verifyMutation.isPending ? onClose : () => {}}
        title={`Verifikasi Setoran — ${detail?.kodeSetor || "Memuat..."}`}
        description="Validasi timbangan aktual di lapangan dan konfirmasi penambahan poin nasabah."
        maxWidth="xl"
      >
        {isFetchingDetail || !detail ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#64B60A] animate-spin" />
            <p className="text-xs font-semibold text-[#0B636B]/70">
              Mengambil rincian data setoran...
            </p>
          </div>
        ) : (
          <form onSubmit={handlePreSubmit} className="space-y-5">
            {/* Nasabah & Metadata Header */}
            <div className="p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#0B636B]/60 block font-medium">Nasabah</span>
                <span className="font-bold text-[#0B636B] text-sm">
                  {detail.nasabah.namaNasabah}
                </span>
                <span className="text-[11px] text-[#0B636B]/70 block font-mono">
                  {detail.nasabah.telp}
                </span>
              </div>
              <div>
                <span className="text-[#0B636B]/60 block font-medium">Tanggal Pengajuan</span>
                <span className="font-semibold text-[#0B636B]">
                  {new Date(detail.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-[11px] text-[#0B636B]/70 block truncate" title={detail.nasabah.alamat}>
                  {detail.nasabah.alamat}
                </span>
              </div>

              {detail.catatan && (
                <div className="sm:col-span-2 pt-2 border-t border-[#0B636B]/10">
                  <span className="text-[#0B636B]/60 block font-medium">Catatan Nasabah:</span>
                  <p className="text-xs italic text-[#0B636B]/80">"{detail.catatan}"</p>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Table Input Berat Real */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#0B636B]">
                  Timbangan Aktual Sampah
                </h4>
                <span className="text-[11px] text-[#0B636B]/60">
                  Sesuaikan nilai berat real jika timbangan berbeda dari estimasi
                </span>
              </div>

              <div className="border border-[#0B636B]/12 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#EFF0EB]/80 text-[#0B636B]/70 border-b border-[#0B636B]/10 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3 text-right">Poin/Kg</th>
                      <th className="py-2.5 px-3 text-right">Estimasi (Kg)</th>
                      <th className="py-2.5 px-3 text-right">Berat Real (Kg) *</th>
                      <th className="py-2.5 px-3 text-right">Subtotal Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0B636B]/8">
                    {detail.items.map((item) => {
                      const currentWeight = realWeights[item.kategoriSampahId] ?? item.beratKg;
                      const subtotal = Number((currentWeight * item.poinPerKg).toFixed(2));

                      return (
                        <tr key={item.id} className="hover:bg-[#EFF0EB]/30">
                          <td className="py-2.5 px-3 font-semibold text-[#0B636B]">
                            {item.namaKategori}
                            <span className="block text-[10px] text-[#0B636B]/50 uppercase">
                              {item.jenis}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#0B636B]/75">
                            {item.poinPerKg}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-[#0B636B]/60">
                            {item.beratKg} kg
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={currentWeight}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setRealWeights((prev) => ({
                                  ...prev,
                                  [item.kategoriSampahId]: val,
                                }));
                              }}
                              className="w-24 text-right font-mono font-bold px-2.5 py-1 bg-white border border-[#0B636B]/20 rounded-xl text-xs text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-[#64B60A]">
                            {subtotal.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Total Preview Row */}
                  <tfoot className="bg-[#EFF0EB]/50 border-t border-[#0B636B]/10 font-bold text-xs text-[#0B636B]">
                    <tr>
                      <td colSpan={3} className="py-3 px-3 text-right">
                        Total Penimbangan Aktual:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#0B636B]">
                        {previewTotalBerat} kg
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#64B60A] text-sm">
                        {previewTotalPoin.toLocaleString("id-ID")} poin
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Pilihan Status Verifikasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider block">
                Status Verifikasi <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <label
                  className={`flex flex-col p-3 rounded-2xl border cursor-pointer transition-all ${
                    status === "diverifikasi"
                      ? "bg-[#0B636B]/10 border-[#0B636B] text-[#0B636B]"
                      : "bg-white border-[#0B636B]/15 hover:bg-[#EFF0EB]/50 text-[#0B636B]/70"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <input
                      type="radio"
                      name="status"
                      value="diverifikasi"
                      checked={status === "diverifikasi"}
                      onChange={(e) => setStatus(e.target.value)}
                      className="text-[#0B636B] focus:ring-[#0B636B]"
                    />
                    <span>Diverifikasi</span>
                  </div>
                  <span className="text-[10px] text-[#0B636B]/60 mt-1">
                    Timbangan disetujui, siap diselesaikan.
                  </span>
                </label>

                <label
                  className={`flex flex-col p-3 rounded-2xl border cursor-pointer transition-all ${
                    status === "selesai"
                      ? "bg-[#B6F022]/25 border-[#64B60A] text-[#0B636B]"
                      : "bg-white border-[#0B636B]/15 hover:bg-[#EFF0EB]/50 text-[#0B636B]/70"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <input
                      type="radio"
                      name="status"
                      value="selesai"
                      checked={status === "selesai"}
                      onChange={(e) => setStatus(e.target.value)}
                      className="text-[#64B60A] focus:ring-[#64B60A]"
                    />
                    <span className="text-[#0B636B]">Selesai (Kredit Poin)</span>
                  </div>
                  <span className="text-[10px] text-[#0B636B]/60 mt-1">
                    Poin langsung bertambah ke saldo nasabah.
                  </span>
                </label>

                <label
                  className={`flex flex-col p-3 rounded-2xl border cursor-pointer transition-all ${
                    status === "ditolak"
                      ? "bg-red-50 border-red-400 text-red-700"
                      : "bg-white border-[#0B636B]/15 hover:bg-[#EFF0EB]/50 text-[#0B636B]/70"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <input
                      type="radio"
                      name="status"
                      value="ditolak"
                      checked={status === "ditolak"}
                      onChange={(e) => setStatus(e.target.value)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>Ditolak</span>
                  </div>
                  <span className="text-[10px] text-red-600/70 mt-1">
                    Sampah tidak sesuai ketentuan unit.
                  </span>
                </label>
              </div>
            </div>

            {/* Field Catatan Admin */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider block">
                Catatan Verifikasi Admin <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={catatanAdmin}
                onChange={(e) => setCatatanAdmin(e.target.value)}
                placeholder="Contoh: Berat bersih setelah ditimbang di unit. Plastik PET bersih."
                className="w-full px-3.5 py-2.5 bg-white border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-[#0B636B]/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={verifyMutation.isPending}
                className="px-4 py-2.5 rounded-full border border-[#0B636B]/20 text-xs font-semibold text-[#0B636B] hover:bg-[#EFF0EB] transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={verifyMutation.isPending}
                className="px-6 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-bold text-xs shadow-md shadow-[#B6F022]/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {verifyMutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Simpan Hasil Verifikasi</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Irreversible Confirmation Dialog for 'Selesai' status */}
      <ConfirmDialog
        isOpen={isConfirmSelesaiOpen}
        onClose={() => setIsConfirmSelesaiOpen(false)}
        onConfirm={() => verifyMutation.mutate()}
        title="Konfirmasi Penyelesaian Setoran"
        message={`Sebanyak ${previewTotalPoin.toLocaleString(
          "id-ID"
        )} poin akan langsung ditambahkan ke saldo akun nasabah "${
          detail?.nasabah.namaNasabah
        }". Transaksi berstatus selesai bersifat permanen dan tidak dapat dibatalkan. Lanjutkan?`}
        confirmLabel="Ya, Selesaikan & Berikan Poin"
        variant="warning"
        isLoading={verifyMutation.isPending}
      />
    </>
  );
}
