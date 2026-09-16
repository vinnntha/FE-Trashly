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
  hadiahSchema,
  HadiahInput,
} from "@/lib/validations/hadiah.schema";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Gift,
  Upload,
  Coins,
  Package,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface HadiahItem {
  id: string;
  namaHadiah: string;
  poinDibutuhkan: number;
  stok: number;
  foto?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminHadiahPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"ALL" | "AVAILABLE" | "LOW">("ALL");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HadiahItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HadiahItem | null>(null);

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

  // Query Hadiah List
  const { data: rawHadiah, isLoading } = useQuery({
    queryKey: ["hadiah-list"],
    queryFn: async () => {
      const res = await apiClient<any>("/hadiah");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
  });

  const hadiahList: HadiahItem[] = Array.isArray(rawHadiah)
    ? rawHadiah
    : Array.isArray((rawHadiah as any)?.data)
    ? (rawHadiah as any).data
    : [];

  // Form setup
  const form = useForm<HadiahInput>({
    resolver: zodResolver(hadiahSchema),
    defaultValues: {
      namaHadiah: "",
      poinDibutuhkan: 0,
      stok: 0,
    },
  });

  // Open Create Modal
  const openCreateModal = () => {
    setEditingItem(null);
    form.reset({
      namaHadiah: "",
      poinDibutuhkan: 0,
      stok: 0,
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: HadiahItem) => {
    setEditingItem(item);
    form.reset({
      namaHadiah: item.namaHadiah,
      poinDibutuhkan: Number(item.poinDibutuhkan),
      stok: Number(item.stok),
    });
    setPhotoFile(null);
    setPhotoPreview(item.foto ? getImageUrl(item.foto) : null);
    setIsFormOpen(true);
  };

  // Open Delete Dialog
  const openDeleteDialog = (item: HadiahItem) => {
    setSelectedItem(item);
    setDeleteDialogError(null);
    setIsDeleteOpen(true);
  };

  // Save (Create or Update) Mutation
  const saveMutation = useMutation({
    mutationFn: async (input: HadiahInput) => {
      const formData = new FormData();
      formData.append("namaHadiah", input.namaHadiah);
      formData.append("poinDibutuhkan", input.poinDibutuhkan.toString());
      formData.append("stok", input.stok.toString());
      if (photoFile) {
        formData.append("foto", photoFile);
      }

      if (editingItem) {
        return apiClient<{ message: string; data: any }>(
          `/hadiah/${editingItem.id}`,
          {
            method: "PUT",
            body: formData,
          }
        );
      } else {
        return apiClient<{ message: string; data: any }>("/hadiah", {
          method: "POST",
          body: formData,
        });
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hadiah-list"] });
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
            ? "Hadiah berhasil diperbarui."
            : "Hadiah baru berhasil ditambahkan."),
      });
      setTimeout(() => setToastMessage(null), 4000);
    },
    onError: (err: any) => {
      setToastMessage({
        type: "error",
        text: err?.message || "Gagal menyimpan data hadiah.",
      });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient<{ message: string }>(`/hadiah/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["hadiah-list"] });
      setIsDeleteOpen(false);
      setSelectedItem(null);
      setDeleteDialogError(null);
      setToastMessage({
        type: "success",
        text: res.message || "Hadiah berhasil dihapus.",
      });
      setTimeout(() => setToastMessage(null), 4000);
    },
    onError: (err: any) => {
      // Backend specific 400 error rejection (e.g. pending redemption exists)
      setDeleteDialogError(
        err?.message ||
          "Hadiah tidak dapat dihapus karena masih ada transaksi penukaran poin yang sedang diproses atau tercatat dalam riwayat."
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

  // Table Columns Definition
  const columns: Column<HadiahItem>[] = [
    {
      header: "Hadiah / Voucher",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-[#EFF0EB] overflow-hidden border border-[#0B636B]/15 shrink-0 flex items-center justify-center">
            {item.foto ? (
              <Image
                src={getImageUrl(item.foto)}
                alt={item.namaHadiah}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <Gift className="w-5 h-5 text-[#0B636B]/40" />
            )}
          </div>
          <div>
            <span className="font-bold text-[#0B636B] block leading-snug">
              {item.namaHadiah}
            </span>
            <span className="text-[11px] text-[#0B636B]/50">
              ID: {item.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Poin Dibutuhkan",
      align: "right",
      cell: (item) => (
        <div className="inline-flex items-center gap-1 font-bold text-xs text-[#0B636B] bg-[#B6F022]/20 border border-[#B6F022]/40 px-2.5 py-1 rounded-full">
          <Coins className="w-3.5 h-3.5 text-[#64B60A]" />
          <span>{Number(item.poinDibutuhkan).toLocaleString("id-ID")} poin</span>
        </div>
      ),
    },
    {
      header: "Stok Barang",
      align: "center",
      cell: (item) => {
        const isOutOfStock = item.stok === 0;
        const isLowStock = item.stok > 0 && item.stok < 5;

        return (
          <div className="inline-flex items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isOutOfStock
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : isLowStock
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-[#EFF0EB] text-[#0B636B] border border-[#0B636B]/15"
              }`}
            >
              {isOutOfStock ? "Habis (0)" : `${item.stok} unit`}
            </span>
          </div>
        );
      },
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
            title="Edit Hadiah"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => openDeleteDialog(item)}
            className="p-1.5 rounded-xl text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Hadiah"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Metrics
  const totalItems = hadiahList.length;
  const totalStock = hadiahList.reduce((acc, h) => acc + Number(h.stok || 0), 0);
  const lowStockCount = hadiahList.filter((h) => Number(h.stok || 0) <= 5).length;

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
            Hadiah & Voucher
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-0.5">
            Kelola katalog barang reward, kuota ketersediaan stok, dan nilai poin penukaran nasabah.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["hadiah-list"] })}
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
            <span>Tambah Hadiah</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Katalog Hadiah</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#0B636B]">
            {totalItems} <span className="text-xs font-normal opacity-70">Item</span>
          </div>
          <div className="text-[10px] text-[#64B60A] font-semibold">Tersedia untuk klaim nasabah</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#64B60A]/20 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Total Unit Stok</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#64B60A]">
            {totalStock.toLocaleString("id-ID")} <span className="text-xs font-normal opacity-70">Unit</span>
          </div>
          <div className="text-[10px] text-[#0B636B]/60">Total fisik dan voucher</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-amber-300 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-800">Stok Menipis / Habis</span>
            {lowStockCount > 0 && (
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-amber-800">
            {lowStockCount} <span className="text-xs font-normal opacity-70">Item</span>
          </div>
          <div className="text-[10px] text-amber-700 font-medium">Stok &le; 5 unit perlu restock</div>
        </div>
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
          placeholder="Cari nama barang atau voucher..."
          onSearch={setSearchQuery}
          className="w-full sm:max-w-md"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { key: "ALL", label: "Semua", count: totalItems },
            { key: "AVAILABLE", label: "Stok Aman (>5)", count: totalItems - lowStockCount },
            { key: "LOW", label: "Menipis (≤5)", count: lowStockCount },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStockFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                stockFilter === tab.key
                  ? "bg-[#0B636B] text-[#B6F022] shadow-sm"
                  : "bg-[#EFF0EB]/70 text-[#0B636B]/70 hover:bg-[#EFF0EB] hover:text-[#0B636B]"
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-[#0B636B]/12 shadow-sm p-4 sm:p-6">
        <DataTable<HadiahItem>
          columns={columns}
          data={hadiahList}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyTitle="Belum ada data hadiah"
          emptyDescription="Belum ada hadiah atau voucher reward yang terdaftar di unit ini."
          searchFilter={(item) => {
            if (stockFilter === "AVAILABLE" && Number(item.stok) <= 5) return false;
            if (stockFilter === "LOW" && Number(item.stok) > 5) return false;
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return item.namaHadiah.toLowerCase().includes(query);
          }}
        />
      </div>

      {/* MODAL: Tambah / Edit Hadiah */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => !saveMutation.isPending && setIsFormOpen(false)}
        title={editingItem ? "Perbarui Hadiah" : "Tambah Hadiah Baru"}
        description="Atur nama barang, jumlah poin yang dibutuhkan, dan stok yang tersedia."
      >
        <form
          onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))}
          className="space-y-4"
        >
          {/* Nama Hadiah */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Nama Hadiah / Reward <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...form.register("namaHadiah")}
              placeholder="Contoh: Minyak Goreng 2 Liter"
              className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
            />
            {form.formState.errors.namaHadiah && (
              <p className="text-[11px] text-red-600">
                {form.formState.errors.namaHadiah.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Poin Dibutuhkan */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                Poin Dibutuhkan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                {...form.register("poinDibutuhkan", { valueAsNumber: true })}
                placeholder="misal: 150"
                className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
              />
              {form.formState.errors.poinDibutuhkan && (
                <p className="text-[11px] text-red-600">
                  {form.formState.errors.poinDibutuhkan.message}
                </p>
              )}
            </div>

            {/* Stok */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                Jumlah Stok Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...form.register("stok", { valueAsNumber: true })}
                placeholder="misal: 25"
                className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
              />
              {form.formState.errors.stok && (
                <p className="text-[11px] text-red-600">
                  {form.formState.errors.stok.message}
                </p>
              )}
            </div>
          </div>

          {/* Upload Foto */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Foto Hadiah <span className="text-[#0B636B]/40 font-normal lowercase">(opsional)</span>
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
                  id="hadiah-foto"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <label
                  htmlFor="hadiah-foto"
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
              <span>{editingItem ? "Simpan Perubahan" : "Tambah Hadiah"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DIALOG: Hapus Hadiah */}
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
        title="Hapus Hadiah / Voucher?"
        message={`Apakah Anda yakin ingin menghapus item hadiah "${selectedItem?.namaHadiah}"? Jika masih ada penukaran berstatus diproses yang mereferensikannya, penghapusan akan ditolak oleh sistem audit.`}
        confirmLabel="Ya, Hapus Hadiah"
        isLoading={deleteMutation.isPending}
        error={deleteDialogError}
      />
    </div>
  );
}
