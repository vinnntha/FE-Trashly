"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api-client";
import { getImageUrl } from "@/lib/image";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SearchInput } from "@/components/admin/SearchInput";
import {
  kategoriSampahSchema,
  KategoriSampahInput,
} from "@/lib/validations/kategori-sampah.schema";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Layers,
  Upload,
  Coins,
  DollarSign,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface KategoriSampahItem {
  id: string;
  namaKategori: string;
  hargaPerKg: number;
  poinPerKg: number;
  jenis: "PLASTIK" | "KERTAS" | "LOGAM" | "KACA";
  foto?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminKategoriSampahPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJenis, setSelectedJenis] = useState<string>("ALL");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KategoriSampahItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KategoriSampahItem | null>(null);

  // File upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Notification banners
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Delete dialog backend error
  const [deleteDialogError, setDeleteDialogError] = useState<string | null>(null);

  // Query Kategori Sampah List
  const { data: rawKategori, isLoading } = useQuery({
    queryKey: ["kategori-sampah-list"],
    queryFn: async () => {
      const res = await apiClient<any>(
        "/kategori-sampah"
      );
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
  });

  const kategoriList: KategoriSampahItem[] = Array.isArray(rawKategori)
    ? rawKategori
    : Array.isArray((rawKategori as any)?.data)
    ? (rawKategori as any).data
    : [];

  // Form setup
  const form = useForm<KategoriSampahInput>({
    resolver: zodResolver(kategoriSampahSchema),
    defaultValues: {
      namaKategori: "",
      hargaPerKg: 0,
      poinPerKg: 0,
      jenis: "PLASTIK",
    },
  });

  // Open Create Modal
  const openCreateModal = () => {
    setEditingItem(null);
    form.reset({
      namaKategori: "",
      hargaPerKg: 0,
      poinPerKg: 0,
      jenis: "PLASTIK",
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: KategoriSampahItem) => {
    setEditingItem(item);
    form.reset({
      namaKategori: item.namaKategori,
      hargaPerKg: Number(item.hargaPerKg),
      poinPerKg: Number(item.poinPerKg),
      jenis: item.jenis,
    });
    setPhotoFile(null);
    setPhotoPreview(item.foto ? getImageUrl(item.foto) : null);
    setIsFormOpen(true);
  };

  // Open Delete Dialog
  const openDeleteDialog = (item: KategoriSampahItem) => {
    setSelectedItem(item);
    setDeleteDialogError(null);
    setIsDeleteOpen(true);
  };

  // Save (Create or Update) Mutation
  const saveMutation = useMutation({
    mutationFn: async (input: KategoriSampahInput) => {
      const formData = new FormData();
      formData.append("namaKategori", input.namaKategori);
      formData.append("hargaPerKg", input.hargaPerKg.toString());
      formData.append("poinPerKg", input.poinPerKg.toString());
      formData.append("jenis", input.jenis);
      if (photoFile) {
        formData.append("foto", photoFile);
      }

      if (editingItem) {
        return apiClient<{ message: string; data: any }>(
          `/kategori-sampah/${editingItem.id}`,
          {
            method: "PUT",
            body: formData,
          }
        );
      } else {
        return apiClient<{ message: string; data: any }>("/kategori-sampah", {
          method: "POST",
          body: formData,
        });
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["kategori-sampah-list"] });
      setIsFormOpen(false);
      setEditingItem(null);
      form.reset();
      setPhotoFile(null);
      setPhotoPreview(null);
      setToastMessage({
        type: "success",
        text:
          res.message ||
          (editingItem
            ? "Kategori sampah berhasil diperbarui."
            : "Kategori sampah baru berhasil ditambahkan."),
      });
      setTimeout(() => setToastMessage(null), 4000);
    },
    onError: (err: any) => {
      setToastMessage({
        type: "error",
        text: err?.message || "Gagal menyimpan data kategori sampah.",
      });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient<{ message: string }>(`/kategori-sampah/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["kategori-sampah-list"] });
      setIsDeleteOpen(false);
      setSelectedItem(null);
      setDeleteDialogError(null);
      setToastMessage({
        type: "success",
        text: res.message || "Kategori sampah berhasil dihapus.",
      });
      setTimeout(() => setToastMessage(null), 4000);
    },
    onError: (err: any) => {
      // Backend specific 400 error rejection
      setDeleteDialogError(
        err?.message ||
          "Kategori sampah tidak dapat dihapus karena masih tercatat dalam riwayat transaksi setoran."
      );
    },
  });

  // Handle file input
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5MB.");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Badge jenis helper
  const renderJenisBadge = (jenis: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      PLASTIK: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      KERTAS: {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
      },
      LOGAM: {
        bg: "bg-slate-100",
        text: "text-slate-800",
        border: "border-slate-300",
      },
      KACA: {
        bg: "bg-teal-50",
        text: "text-teal-800",
        border: "border-teal-200",
      },
    };

    const current = styles[jenis] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${current.bg} ${current.text} ${current.border} uppercase tracking-wider`}
      >
        {jenis}
      </span>
    );
  };

  // Table Columns Definition
  const columns: Column<KategoriSampahItem>[] = [
    {
      header: "Kategori Sampah",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-[#EFF0EB] overflow-hidden border border-[#0B636B]/15 shrink-0 flex items-center justify-center">
            {item.foto ? (
              <Image
                src={getImageUrl(item.foto)}
                alt={item.namaKategori}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <Layers className="w-5 h-5 text-[#0B636B]/40" />
            )}
          </div>
          <div>
            <span className="font-bold text-[#0B636B] block leading-snug">
              {item.namaKategori}
            </span>
            <span className="text-[11px] text-[#0B636B]/50">
              ID: {item.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Jenis",
      cell: (item) => renderJenisBadge(item.jenis),
    },
    {
      header: "Harga / Kg",
      align: "right",
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-[#0B636B]">
          Rp {Number(item.hargaPerKg).toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Poin / Kg",
      align: "right",
      cell: (item) => (
        <div className="inline-flex items-center gap-1 font-bold text-xs text-[#0B636B] bg-[#B6F022]/20 border border-[#B6F022]/40 px-2 py-0.5 rounded-full">
          <Coins className="w-3 h-3 text-[#64B60A]" />
          <span>{Number(item.poinPerKg).toLocaleString("id-ID")}</span>
        </div>
      ),
    },
    {
      header: "Aksi",
      align: "center",
      cell: (item) => (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(item)}
            className="p-1.5 rounded-xl text-[#0B636B]/70 hover:text-[#64B60A] hover:bg-[#EFF0EB] transition-colors"
            title="Edit Kategori"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => openDeleteDialog(item)}
            className="p-1.5 rounded-xl text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Kategori"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Grouping metrics per jenis
  const jenisMetrics = {
    PLASTIK: kategoriList.filter((k) => k.jenis === "PLASTIK"),
    KERTAS: kategoriList.filter((k) => k.jenis === "KERTAS"),
    LOGAM: kategoriList.filter((k) => k.jenis === "LOGAM"),
    KACA: kategoriList.filter((k) => k.jenis === "KACA"),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-[#0B636B]/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64B60A] bg-[#64B60A]/10 px-2.5 py-0.5 rounded-full">
              Master Data
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0B636B]">
            Kategori Sampah
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-0.5">
            Kelola jenis sampah yang diterima, tarif harga rupiah per kg, dan perolehan poin nasabah.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["kategori-sampah-list"] })}
            title="Segarkan data"
            className="p-2.5 rounded-2xl bg-white border border-[#0B636B]/15 text-[#0B636B] hover:bg-[#EFF0EB] hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#64B60A]" : ""}`} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-display font-bold text-xs sm:text-sm shadow-md shadow-[#B6F022]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Kategori</span>
          </button>
        </div>
      </div>

      {/* Category Type Interactive Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: "PLASTIK", label: "Plastik", color: "#0B636B", list: jenisMetrics.PLASTIK },
          { key: "KERTAS", label: "Kertas", color: "#64B60A", list: jenisMetrics.KERTAS },
          { key: "LOGAM", label: "Logam", color: "#CFE26C", list: jenisMetrics.LOGAM },
          { key: "KACA", label: "Kaca", color: "#B6F022", list: jenisMetrics.KACA },
        ].map((item) => {
          const isSelected = selectedJenis === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedJenis(isSelected ? "ALL" : item.key)}
              className={`p-4 rounded-3xl border text-left transition-all ${
                isSelected
                  ? "bg-[#0B636B] text-white border-[#0B636B] shadow-md scale-[1.02]"
                  : "bg-white hover:bg-[#EFF0EB]/50 border-[#0B636B]/12 text-[#0B636B] shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-display font-bold text-xs">{item.label}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold">
                {item.list.length} <span className="text-xs font-normal opacity-70">Item</span>
              </div>
              <div className={`text-[10px] mt-1 ${isSelected ? "text-[#B6F022]" : "text-[#64B60A] font-semibold"}`}>
                {isSelected ? "Filter aktif (klik lepas)" : "Klik untuk filter"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-3xl border text-xs sm:text-sm flex items-center gap-3 animate-in fade-in ${
            toastMessage.type === "success"
              ? "bg-[#B6F022]/20 border-[#B6F022] text-[#0B636B]"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-[#64B60A] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <SearchInput
          placeholder="Cari nama kategori..."
          onSearch={setSearchQuery}
          className="w-full sm:max-w-md"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {["ALL", "PLASTIK", "KERTAS", "LOGAM", "KACA"].map((jenis) => (
            <button
              key={jenis}
              type="button"
              onClick={() => setSelectedJenis(jenis)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedJenis === jenis
                  ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                  : "bg-[#EFF0EB]/70 text-[#0B636B]/70 hover:bg-[#EFF0EB] hover:text-[#0B636B]"
              }`}
            >
              {jenis === "ALL" ? "Semua Kategori" : jenis}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-[#0B636B]/12 shadow-sm p-4 sm:p-6">
        <DataTable<KategoriSampahItem>
          columns={columns}
          data={kategoriList}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyTitle="Belum ada data kategori sampah"
          emptyDescription="Belum ada jenis sampah yang dikonfigurasi pada unit ini."
          searchFilter={(item) => {
            if (selectedJenis !== "ALL" && item.jenis !== selectedJenis) return false;
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
              item.namaKategori.toLowerCase().includes(query) ||
              item.jenis.toLowerCase().includes(query)
            );
          }}
        />
      </div>

      {/* MODAL: Tambah / Edit Kategori */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => !saveMutation.isPending && setIsFormOpen(false)}
        title={editingItem ? "Perbarui Kategori Sampah" : "Tambah Kategori Sampah"}
        description="Atur nama, golongan jenis sampah, harga per kg, dan perolehan poin."
      >
        <form
          onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))}
          className="space-y-4"
        >
          {/* Nama Kategori */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...form.register("namaKategori")}
              placeholder="Contoh: Plastik PET Bening"
              className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
            />
            {form.formState.errors.namaKategori && (
              <p className="text-[11px] text-red-600">
                {form.formState.errors.namaKategori.message}
              </p>
            )}
          </div>

          {/* Jenis Kategori */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Golongan Jenis <span className="text-red-500">*</span>
            </label>
            <select
              {...form.register("jenis")}
              className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
            >
              <option value="PLASTIK">Plastik</option>
              <option value="KERTAS">Kertas</option>
              <option value="LOGAM">Logam</option>
              <option value="KACA">Kaca</option>
            </select>
            {form.formState.errors.jenis && (
              <p className="text-[11px] text-red-600">
                {form.formState.errors.jenis.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Harga Per Kg */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                Harga per Kg (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                {...form.register("hargaPerKg", { valueAsNumber: true })}
                placeholder="misal: 3500"
                className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
              />
              {form.formState.errors.hargaPerKg && (
                <p className="text-[11px] text-red-600">
                  {form.formState.errors.hargaPerKg.message}
                </p>
              )}
            </div>

            {/* Poin Per Kg */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                Poin per Kg <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                {...form.register("poinPerKg", { valueAsNumber: true })}
                placeholder="misal: 35"
                className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
              />
              {form.formState.errors.poinPerKg && (
                <p className="text-[11px] text-red-600">
                  {form.formState.errors.poinPerKg.message}
                </p>
              )}
            </div>
          </div>

          {/* Upload Foto */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Foto Kategori <span className="text-[#0B636B]/40 font-normal lowercase">(opsional)</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-[#EFF0EB] border border-[#0B636B]/15 overflow-hidden flex items-center justify-center shrink-0">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <Upload className="w-5 h-5 text-[#0B636B]/40" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="kategori-foto"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <label
                  htmlFor="kategori-foto"
                  className="inline-block px-4 py-2 rounded-xl border border-[#0B636B]/20 text-xs font-semibold text-[#0B636B] hover:bg-[#EFF0EB] cursor-pointer transition-colors"
                >
                  {photoPreview ? "Ganti Foto" : "Pilih Foto"}
                </label>
                <p className="text-[10px] text-[#0B636B]/50 mt-1">
                  Format JPG, PNG, atau WebP (maks. 5MB).
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#0B636B]/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              disabled={saveMutation.isPending}
              className="px-4 py-2.5 rounded-full border border-[#0B636B]/20 text-xs font-semibold text-[#0B636B] hover:bg-[#EFF0EB] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-6 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-bold text-xs shadow-md shadow-[#B6F022]/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saveMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>{editingItem ? "Simpan Perubahan" : "Tambah Kategori"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DIALOG: Hapus Kategori */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setIsDeleteOpen(false);
            setDeleteDialogError(null);
          }
        }}
        onConfirm={() => {
          if (selectedItem) {
            deleteMutation.mutate(selectedItem.id);
          }
        }}
        title="Hapus Kategori Sampah?"
        message={`Apakah Anda yakin ingin menghapus kategori "${selectedItem?.namaKategori}"? Jika kategori ini pernah digunakan pada riwayat setoran nasabah, penghapusan akan ditolak oleh sistem audit.`}
        confirmLabel="Ya, Hapus Kategori"
        isLoading={deleteMutation.isPending}
        error={deleteDialogError}
      />
    </div>
  );
}
