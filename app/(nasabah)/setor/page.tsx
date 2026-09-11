"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";
import JenisSampahBadge from "@/components/nasabah/JenisSampahBadge";
import {
  PlusCircle,
  Trash2,
  Calendar,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Scale,
  Recycle,
} from "lucide-react";

interface KategoriSampahItem {
  id: string;
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  jenis: string;
}

// Zod schema for validation
const setorItemSchema = z.object({
  kategoriSampahId: z.string().min(1, "Pilih jenis sampah"),
  beratKg: z.coerce
    .number()
    .min(0.1, "Berat minimal 0.1 kg")
    .max(1000, "Berat maksimal 1000 kg"),
});

const createSetorSampahSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  catatan: z.string().optional(),
  items: z.array(setorItemSchema).min(1, "Minimal harus ada 1 item sampah"),
});

type SetorFormValues = z.infer<typeof createSetorSampahSchema>;

export default function AjukanSetorPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [successResult, setSuccessResult] = useState<{
    kodeSetor: string;
    id: string;
    totalBeratKg: number;
    estimasiTotalPoin: number;
  } | null>(null);

  // Today's date YYYY-MM-DD
  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Fetch list of available waste categories
  const { data: kategoriRes, isLoading: loadingKategori } = useQuery<{
    message: string;
    data: KategoriSampahItem[];
  }>({
    queryKey: ["kategori-sampah-list"],
    queryFn: () => apiClient<{ message: string; data: KategoriSampahItem[] }>("/kategori-sampah"),
  });

  const kategoriList = kategoriRes?.data || [];
  const kategoriMap = useMemo(() => {
    return new Map(kategoriList.map((k) => [k.id, k]));
  }, [kategoriList]);

  // React Hook Form
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetorFormValues>({
    resolver: zodResolver(createSetorSampahSchema) as any,
    defaultValues: {
      tanggal: todayDate,
      catatan: "",
      items: [{ kategoriSampahId: "", beratKg: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch items for live point calculation
  const watchedItems = watch("items");

  // Calculate live estimation
  const { liveTotalBeratKg, liveTotalPoin } = useMemo(() => {
    let totalBerat = 0;
    let totalPoin = 0;

    (watchedItems || []).forEach((item) => {
      const berat = Number(item.beratKg) || 0;
      const kat = kategoriMap.get(item.kategoriSampahId);
      const poinPerKg = kat ? kat.poinPerKg : 0;

      totalBerat += berat;
      totalPoin += berat * poinPerKg;
    });

    return {
      liveTotalBeratKg: Number(totalBerat.toFixed(2)),
      liveTotalPoin: Number(totalPoin.toFixed(2)),
    };
  }, [watchedItems, kategoriMap]);

  // Mutation for submitting pengajuan
  const submitMutation = useMutation({
    mutationFn: (values: SetorFormValues) => {
      // Format tanggal to ISO8601 string
      const isoDate = new Date(`${values.tanggal}T08:00:00Z`).toISOString();
      return apiClient<{ message: string; data: any }>("/setor-sampah/pengajuan", {
        method: "POST",
        body: JSON.stringify({
          tanggal: isoDate,
          catatan: values.catatan || undefined,
          items: values.items.map((i) => ({
            kategoriSampahId: i.kategoriSampahId,
            beratKg: Number(i.beratKg),
          })),
        }),
      });
    },
    onSuccess: (res) => {
      // Invalidate relevant queries so everything refreshes automatically
      queryClient.invalidateQueries({ queryKey: ["setor-sampah-list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });

      setSuccessResult({
        kodeSetor: res.data.kodeSetor,
        id: res.data.id,
        totalBeratKg: res.data.totalBeratKg,
        estimasiTotalPoin: res.data.estimasiTotalPoin,
      });
    },
  });

  const onSubmit = (values: SetorFormValues) => {
    submitMutation.mutate(values);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-2">
          <Recycle className="w-3.5 h-3.5 text-[#64B60A]" />
          <span>Formulir Penyetoran</span>
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B636B] tracking-tight">
          Ajukan Setoran Sampah Terpilah
        </h1>
        <p className="text-xs sm:text-sm text-[#0B636B]/75 mt-1">
          Daftarkan jenis dan perkiraan berat sampah yang akan Anda setorkan. Petugas bank sampah unit akan menimbang dan memverifikasi saat sampah diserahkan.
        </p>
      </div>

      {/* Success Modal / Banner */}
      {successResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B636B] text-[#EFF0EB] shadow-[0_20px_50px_-12px_rgba(11,99,107,0.35)] space-y-4 border border-white/20 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#B6F022] text-[#0B636B] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-[#CFE26C] font-semibold">Pengajuan Berhasil!</p>
              <h3 className="font-display font-bold text-xl text-white">
                Kode Setor: {successResult.kodeSetor}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#EFF0EB]/80 leading-relaxed">
            Pengajuan Anda telah tercatat dengan estimasi berat{" "}
            <strong>{successResult.totalBeratKg} kg</strong> dan potensi perolehan{" "}
            <strong className="text-[#B6F022]">+{successResult.estimasiTotalPoin} Poin</strong>.
            Silakan bawa sampah Anda ke unit bank sampah untuk penimbangan resmi.
          </p>

          <div className="pt-4 border-t border-white/15 flex flex-wrap gap-3">
            <Link
              href={`/nota/setor/${successResult.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-xs transition-all shadow-sm"
            >
              <span>Lihat Bukti Nota</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/riwayat"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/20"
            >
              <span>Ke Daftar Riwayat</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      {!successResult && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B636B]/12 shadow-sm space-y-6">
            {/* Header Form: Tanggal & Catatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-6 border-b border-[#0B636B]/10">
              {/* Field Tanggal */}
              <div>
                <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-2">
                  Tanggal Penyetoran <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B636B]/50">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    min={todayDate}
                    {...register("tanggal")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#64B60A]"
                  />
                </div>
                {errors.tanggal && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.tanggal.message}
                  </p>
                )}
              </div>

              {/* Field Catatan */}
              <div>
                <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-2">
                  Catatan Tambahan (Opsional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-[#0B636B]/50">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Contoh: Sudah dipilah rapi per karung"
                    {...register("catatan")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-xs sm:text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A]"
                  />
                </div>
              </div>
            </div>

            {/* Section Multi-Item Sampah */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#0B636B]">
                    Rincian Jenis Sampah
                  </h3>
                  <p className="text-xs text-[#0B636B]/65">
                    Pilih kategori dan masukkan perkiraan berat dalam kilogram.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => append({ kategoriSampahId: "", beratKg: 1 })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF0EB] hover:bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#64B60A]" />
                  <span>+ Tambah Sampah</span>
                </button>
              </div>

              {/* Item Rows */}
              <div className="space-y-3">
                {fields.map((field, index) => {
                  const selectedKategoriId = watchedItems?.[index]?.kategoriSampahId;
                  const selectedKat = kategoriMap.get(selectedKategoriId);
                  const currentBerat = Number(watchedItems?.[index]?.beratKg) || 0;
                  const itemSubtotalPoin = selectedKat
                    ? Number((currentBerat * selectedKat.poinPerKg).toFixed(2))
                    : 0;

                  return (
                    <div
                      key={field.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#EFF0EB]/50 border border-[#0B636B]/10 flex flex-col sm:flex-row sm:items-center gap-4 transition-all"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#0B636B]/10 text-[#0B636B] font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>

                      {/* Dropdown Kategori */}
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-[#0B636B]/70 uppercase tracking-wider mb-1">
                          Kategori Sampah
                        </label>
                        <select
                          {...register(`items.${index}.kategoriSampahId` as const)}
                          disabled={loadingKategori}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0B636B]/20 text-[#0B636B] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#64B60A]"
                        >
                          <option value="">-- Pilih Kategori Sampah --</option>
                          {kategoriList.map((kat) => (
                            <option key={kat.id} value={kat.id}>
                              {kat.namaKategori} ({kat.poinPerKg} poin/kg)
                            </option>
                          ))}
                        </select>
                        {errors.items?.[index]?.kategoriSampahId && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">
                            {errors.items[index]?.kategoriSampahId?.message}
                          </p>
                        )}
                      </div>

                      {/* Input Berat */}
                      <div className="w-full sm:w-36">
                        <label className="block text-[10px] font-bold text-[#0B636B]/70 uppercase tracking-wider mb-1">
                          Perkiraan Berat (kg)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            {...register(`items.${index}.beratKg` as const)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#0B636B]/20 text-[#0B636B] text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#64B60A]"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-[#0B636B]/50 font-semibold">
                            kg
                          </span>
                        </div>
                        {errors.items?.[index]?.beratKg && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">
                            {errors.items[index]?.beratKg?.message}
                          </p>
                        )}
                      </div>

                      {/* Subtotal Poin Preview */}
                      <div className="w-full sm:w-32 text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[#0B636B]/10">
                        <p className="text-[10px] font-bold text-[#0B636B]/60 uppercase">
                          Subtotal Poin
                        </p>
                        <p className="font-display font-bold text-sm text-[#64B60A] mt-0.5">
                          +{itemSubtotalPoin} Poin
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:pointer-events-none transition-colors self-end sm:self-center"
                        title="Hapus baris sampah"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {errors.items && !Array.isArray(errors.items) && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.items.message}
                </p>
              )}
            </div>

            {/* Live Point & Weight Summary Box */}
            <div className="p-5 rounded-3xl bg-[#0B636B] text-[#EFF0EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#B6F022]/20 text-[#B6F022] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#EFF0EB]/70">Estimasi Total Perolehan</p>
                  <p className="text-xs text-[#CFE26C]">
                    Total Berat: <strong>{liveTotalBeratKg} kg</strong>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#EFF0EB]/70">
                  Estimasi Poin Masuk
                </p>
                <div className="flex items-baseline gap-1.5 justify-start sm:justify-end">
                  <span className="font-display font-extrabold text-3xl text-[#B6F022]">
                    +{liveTotalPoin.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs font-bold text-[#CFE26C]">POIN</span>
                </div>
              </div>
            </div>

            {submitMutation.isError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {submitMutation.error instanceof Error
                    ? submitMutation.error.message
                    : "Gagal mengajukan setoran sampah. Silakan periksa formulir Anda."}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full py-4 px-6 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-sm sm:text-base transition-all duration-200 shadow-[0_6px_20px_-4px_rgba(182,240,34,0.6)] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0B636B] border-t-transparent rounded-full animate-spin" />
                  <span>Mengirim Pengajuan...</span>
                </div>
              ) : (
                <>
                  <span>Ajukan Penyetoran Sampah</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
