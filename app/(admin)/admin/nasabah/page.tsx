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
  createNasabahSchema,
  CreateNasabahInput,
} from "@/lib/validations/create-nasabah.schema";
import {
  updateNasabahSchema,
  UpdateNasabahInput,
} from "@/lib/validations/update-nasabah.schema";
import {
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  Users,
  Coins,
  Phone,
  MapPin,
  Calendar,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface NasabahItem {
  id: string;
  namaNasabah: string;
  alamat: string;
  telp: string;
  saldoPoin: number;
  foto?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    role: string;
    createdAt: string;
  };
}

export default function AdminNasabahPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selected item
  const [selectedNasabah, setSelectedNasabah] = useState<NasabahItem | null>(null);

  // File upload state for forms
  const [createPhotoFile, setCreatePhotoFile] = useState<File | null>(null);
  const [createPhotoPreview, setCreatePhotoPreview] = useState<string | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);

  // Notification banners
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Specific delete dialog error (e.g. active transaction rejection from backend)
  const [deleteDialogError, setDeleteDialogError] = useState<string | null>(null);

  // Query Nasabah List
  const { data: nasabahList = [], isLoading } = useQuery({
    queryKey: ["nasabah-list"],
    queryFn: async () => {
      const res = await apiClient<{ data: NasabahItem[] }>("/admin/nasabah");
      return res.data || [];
    },
  });

  // Form for Create Nasabah
  const createForm = useForm<CreateNasabahInput>({
    resolver: zodResolver(createNasabahSchema),
    defaultValues: {
      username: "",
      password: "",
      namaNasabah: "",
      alamat: "",
      telp: "",
    },
  });

  // Form for Edit Nasabah
  const editForm = useForm<UpdateNasabahInput>({
    resolver: zodResolver(updateNasabahSchema),
    defaultValues: {
      namaNasabah: "",
      telp: "",
      alamat: "",
    },
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (input: CreateNasabahInput) => {
      const formData = new FormData();
      formData.append("username", input.username);
      formData.append("password", input.password);
      formData.append("namaNasabah", input.namaNasabah);
      formData.append("alamat", input.alamat);
      formData.append("telp", input.telp);
      if (createPhotoFile) {
        formData.append("foto", createPhotoFile);
      }

      return apiClient<{ message: string; data: any }>("/admin/nasabah", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["nasabah-list"] });
      setIsCreateOpen(false);
      createForm.reset();
      setCreatePhotoFile(null);
      setCreatePhotoPreview(null);
      setToastMessage({
        type: "success",
        text: res.message || "Nasabah baru berhasil didaftarkan.",
      });
      setTimeout(() => setToastMessage(null), 4000);
    },
    onError: (err: any) => {
      setToastMessage({
        type: "error",
        text: err?.message || "Gagal menambahkan nasabah.",
      });
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateNasabahInput;
    }) => {
      const formData = new FormData();
      if (input.namaNasabah) formData.append("namaNasabah", input.namaNasabah);
      if (input.telp) formData.append("telp", input.telp);
      if (input.alamat) formData.append("alamat", input.alamat);
      if (editPhotoFile) {
        formData.append("foto", editPhotoFile);
      }

      return apiClient<{ message: string; data: any }>(`/admin/nasabah/${id}`, {
        method: "PUT",
        body: formData,
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["nasabah-list"] });
      setIsEditOpen(false);
      setSelectedNasabah(null);
      editForm.reset();
      setEditPhotoFile(null);
      setEditPhotoPreview(null);
      setToastMessage({
        type: "success",
        text: res.message || "Data nasabah berhasil diperbarui.",
      });
      setTimeout(() => setToastMessage(null), 4000);
    },
    onError: (err: any) => {
      setToastMessage({
        type: "error",
        text: err?.message || "Gagal memperbarui data nasabah.",
      });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient<{ message: string }>(`/admin/nasabah/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["nasabah-list"] });
      setIsDeleteOpen(false);
      setSelectedNasabah(null);
      setDeleteDialogError(null);
      setToastMessage({
        type: "success",
        text: res.message || "Data nasabah berhasil dihapus.",
      });
      setTimeout(() => setToastMessage(null), 4000);
    },
    onError: (err: any) => {
      // Show backend exact rejection error in the dialog
      setDeleteDialogError(
        err?.message || "Gagal menghapus nasabah: terjadi kesalahan sistem."
      );
    },
  });

  // Handlers for Modals
  const openDetail = (nasabah: NasabahItem) => {
    setSelectedNasabah(nasabah);
    setIsDetailOpen(true);
  };

  const openEdit = (nasabah: NasabahItem) => {
    setSelectedNasabah(nasabah);
    editForm.reset({
      namaNasabah: nasabah.namaNasabah,
      telp: nasabah.telp,
      alamat: nasabah.alamat,
    });
    setEditPhotoFile(null);
    setEditPhotoPreview(nasabah.foto ? getImageUrl(nasabah.foto) : null);
    setIsEditOpen(true);
  };

  const openDelete = (nasabah: NasabahItem) => {
    setSelectedNasabah(nasabah);
    setDeleteDialogError(null);
    setIsDeleteOpen(true);
  };

  // Handle Photo input client validation
  const handlePhotoSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (isEdit) {
      setEditPhotoFile(file);
      setEditPhotoPreview(previewUrl);
    } else {
      setCreatePhotoFile(file);
      setCreatePhotoPreview(previewUrl);
    }
  };

  // Table Columns Definition
  const columns: Column<NasabahItem>[] = [
    {
      header: "Nasabah",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-[#EFF0EB] overflow-hidden border border-[#0B636B]/15 shrink-0 flex items-center justify-center">
            {item.foto ? (
              <Image
                src={getImageUrl(item.foto)}
                alt={item.namaNasabah}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <span className="font-bold text-[#0B636B] text-xs">
                {item.namaNasabah.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <span className="font-bold text-[#0B636B] block leading-snug">
              {item.namaNasabah}
            </span>
            <span className="text-[11px] text-[#0B636B]/60 font-mono">
              @{item.user?.username || "nasabah"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "No. Telepon",
      accessorKey: "telp",
      cell: (item) => (
        <span className="font-mono text-xs text-[#0B636B]/80">{item.telp}</span>
      ),
    },
    {
      header: "Alamat",
      accessorKey: "alamat",
      cell: (item) => (
        <span className="text-xs text-[#0B636B]/75 line-clamp-1 max-w-[200px]" title={item.alamat}>
          {item.alamat}
        </span>
      ),
    },
    {
      header: "Saldo Poin",
      align: "right",
      cell: (item) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B6F022]/20 border border-[#B6F022]/40 text-[#0B636B] font-bold text-xs">
          <Coins className="w-3.5 h-3.5 text-[#64B60A]" />
          <span>{Number(item.saldoPoin).toLocaleString("id-ID")}</span>
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
            onClick={() => openDetail(item)}
            className="p-1.5 rounded-xl text-[#0B636B]/70 hover:text-[#0B636B] hover:bg-[#EFF0EB] transition-colors"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => openEdit(item)}
            className="p-1.5 rounded-xl text-[#0B636B]/70 hover:text-[#64B60A] hover:bg-[#EFF0EB] transition-colors"
            title="Edit Data"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => openDelete(item)}
            className="p-1.5 rounded-xl text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Nasabah"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Metrics
  const totalNasabah = nasabahList.length;
  const totalSaldoPoin = nasabahList.reduce((acc, n) => acc + Number(n.saldoPoin || 0), 0);
  const avgPoin = totalNasabah > 0 ? Math.round(totalSaldoPoin / totalNasabah) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-[#0B636B]/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64B60A] bg-[#64B60A]/10 px-2.5 py-0.5 rounded-full">
              Master Data
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0B636B]">
            Data Nasabah
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-0.5">
            Kelola data akun nasabah terdaftar, saldo poin sirkular, dan verifikasi informasi kepesertaan.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["nasabah-list"] })}
            title="Segarkan data"
            className="p-2.5 rounded-2xl bg-white border border-[#0B636B]/15 text-[#0B636B] hover:bg-[#EFF0EB] hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#64B60A]" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              createForm.reset();
              setCreatePhotoFile(null);
              setCreatePhotoPreview(null);
              setIsCreateOpen(true);
            }}
            className="px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-display font-bold text-xs sm:text-sm shadow-md shadow-[#B6F022]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Nasabah</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-[#0B636B]/12 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Total Nasabah Terdaftar</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#0B636B]">
            {totalNasabah} <span className="text-xs font-normal opacity-70">Akun</span>
          </div>
          <div className="text-[10px] text-[#64B60A] font-semibold">Aktif terdaftar di unit</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#64B60A]/20 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Akumulasi Saldo Poin</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#64B60A]">
            {totalSaldoPoin.toLocaleString("id-ID")} <span className="text-xs font-normal opacity-70">Poin</span>
          </div>
          <div className="text-[10px] text-[#0B636B]/60">Total poin beredar</div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#B6F022]/40 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-[#0B636B]/70">Rata-rata Saldo / Akun</span>
          <div className="text-xl sm:text-2xl font-display font-extrabold text-[#0B636B]">
            {avgPoin.toLocaleString("id-ID")} <span className="text-xs font-normal opacity-70">Poin</span>
          </div>
          <div className="text-[10px] text-[#0B636B]/60">Estimasi keaktifan nasabah</div>
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          placeholder="Cari nama nasabah, username, atau no. telepon..."
          onSearch={setSearchQuery}
          className="w-full sm:max-w-md"
        />

        <div className="text-xs font-semibold text-[#0B636B]/70 self-end sm:self-auto">
          Total: <span className="text-[#0B636B] font-bold">{nasabahList.length}</span> nasabah
        </div>
      </div>

      {/* Data Table */}
      <DataTable<NasabahItem>
        columns={columns}
        data={nasabahList}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyTitle="Belum ada data nasabah"
        emptyDescription="Belum ada nasabah terdaftar di unit bank sampah ini. Mulai dengan menambahkan data nasabah pertama."
        searchFilter={(item) => {
          if (!searchQuery.trim()) return true;
          const query = searchQuery.toLowerCase();
          return (
            item.namaNasabah.toLowerCase().includes(query) ||
            item.telp.toLowerCase().includes(query) ||
            item.alamat.toLowerCase().includes(query) ||
            (item.user?.username || "").toLowerCase().includes(query)
          );
        }}
      />

      {/* MODAL: Tambah Nasabah */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => !createMutation.isPending && setIsCreateOpen(false)}
        title="Pendaftaran Nasabah Baru"
        description="Masukkan informasi kredensial login dan identitas nasabah."
      >
        <form
          onSubmit={createForm.handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...createForm.register("username")}
                placeholder="misal: budi_santoso"
                className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
              />
              {createForm.formState.errors.username && (
                <p className="text-[11px] text-red-600">
                  {createForm.formState.errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...createForm.register("password")}
                placeholder="Minimal 6 karakter"
                className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
              />
              {createForm.formState.errors.password && (
                <p className="text-[11px] text-red-600">
                  {createForm.formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Nama Nasabah */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Nama Lengkap Nasabah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...createForm.register("namaNasabah")}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
            />
            {createForm.formState.errors.namaNasabah && (
              <p className="text-[11px] text-red-600">
                {createForm.formState.errors.namaNasabah.message}
              </p>
            )}
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...createForm.register("telp")}
              placeholder="081234567890"
              className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
            />
            {createForm.formState.errors.telp && (
              <p className="text-[11px] text-red-600">
                {createForm.formState.errors.telp.message}
              </p>
            )}
          </div>

          {/* Alamat */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Alamat Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              {...createForm.register("alamat")}
              rows={2}
              placeholder="Alamat domisili nasabah"
              className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none resize-none"
            />
            {createForm.formState.errors.alamat && (
              <p className="text-[11px] text-red-600">
                {createForm.formState.errors.alamat.message}
              </p>
            )}
          </div>

          {/* Upload Foto (Optional) */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Foto Profil <span className="text-[#0B636B]/40 font-normal lowercase">(opsional)</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl bg-[#EFF0EB] border border-[#0B636B]/15 overflow-hidden flex items-center justify-center shrink-0">
                {createPhotoPreview ? (
                  <Image
                    src={createPhotoPreview}
                    alt="Preview"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <Upload className="w-5 h-5 text-[#0B636B]/40" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="create-foto"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handlePhotoSelect(e, false)}
                  className="hidden"
                />
                <label
                  htmlFor="create-foto"
                  className="inline-block px-4 py-2 rounded-xl border border-[#0B636B]/20 text-xs font-semibold text-[#0B636B] hover:bg-[#EFF0EB] cursor-pointer transition-colors"
                >
                  Pilih Foto
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
              onClick={() => setIsCreateOpen(false)}
              disabled={createMutation.isPending}
              className="px-4 py-2.5 rounded-full border border-[#0B636B]/20 text-xs font-semibold text-[#0B636B] hover:bg-[#EFF0EB] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-bold text-xs shadow-md shadow-[#B6F022]/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {createMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Daftarkan Nasabah</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Edit Nasabah */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => !updateMutation.isPending && setIsEditOpen(false)}
        title="Perbarui Data Nasabah"
        description={`Mengubah data profil untuk @${selectedNasabah?.user?.username || "nasabah"}`}
      >
        <form
          onSubmit={editForm.handleSubmit((data) => {
            if (selectedNasabah) {
              updateMutation.mutate({ id: selectedNasabah.id, input: data });
            }
          })}
          className="space-y-4"
        >
          {/* Nama Nasabah */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Nama Lengkap Nasabah
            </label>
            <input
              type="text"
              {...editForm.register("namaNasabah")}
              className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
            />
            {editForm.formState.errors.namaNasabah && (
              <p className="text-[11px] text-red-600">
                {editForm.formState.errors.namaNasabah.message}
              </p>
            )}
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Nomor Telepon
            </label>
            <input
              type="text"
              {...editForm.register("telp")}
              className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none"
            />
            {editForm.formState.errors.telp && (
              <p className="text-[11px] text-red-600">
                {editForm.formState.errors.telp.message}
              </p>
            )}
          </div>

          {/* Alamat */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Alamat
            </label>
            <textarea
              {...editForm.register("alamat")}
              rows={2}
              className="w-full px-3.5 py-2.5 bg-[#EFF0EB]/40 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] outline-none resize-none"
            />
          </div>

          {/* Upload Foto Baru */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-[#0B636B] uppercase tracking-wider">
              Perbarui Foto Profil
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl bg-[#EFF0EB] border border-[#0B636B]/15 overflow-hidden flex items-center justify-center shrink-0">
                {editPhotoPreview ? (
                  <Image
                    src={editPhotoPreview}
                    alt="Preview"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <Upload className="w-5 h-5 text-[#0B636B]/40" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="edit-foto"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handlePhotoSelect(e, true)}
                  className="hidden"
                />
                <label
                  htmlFor="edit-foto"
                  className="inline-block px-4 py-2 rounded-xl border border-[#0B636B]/20 text-xs font-semibold text-[#0B636B] hover:bg-[#EFF0EB] cursor-pointer transition-colors"
                >
                  Pilih Foto Baru
                </label>
                <p className="text-[10px] text-[#0B636B]/50 mt-1">
                  Biarkan kosong jika tidak ingin mengubah foto.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#0B636B]/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              disabled={updateMutation.isPending}
              className="px-4 py-2.5 rounded-full border border-[#0B636B]/20 text-xs font-semibold text-[#0B636B] hover:bg-[#EFF0EB] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-bold text-xs shadow-md shadow-[#B6F022]/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {updateMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Detail Nasabah */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Detail Akun Nasabah"
        description="Informasi lengkap kepesertaan dan saldo nasabah"
      >
        {selectedNasabah && (
          <div className="space-y-5">
            {/* Header Identity Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10">
              <div className="relative w-16 h-16 rounded-2xl bg-white border border-[#0B636B]/15 overflow-hidden flex items-center justify-center shrink-0">
                {selectedNasabah.foto ? (
                  <Image
                    src={getImageUrl(selectedNasabah.foto)}
                    alt={selectedNasabah.namaNasabah}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <span className="font-display font-extrabold text-[#0B636B] text-xl">
                    {selectedNasabah.namaNasabah.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-display font-bold text-base text-[#0B636B] truncate">
                  {selectedNasabah.namaNasabah}
                </h4>
                <p className="text-xs text-[#0B636B]/60 font-mono">
                  Username: @{selectedNasabah.user?.username || "nasabah"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold bg-[#B6F022] text-[#0B636B] px-2 py-0.5 rounded-full">
                    {selectedNasabah.user?.role || "NASABAH"}
                  </span>
                  <span className="text-[11px] text-[#0B636B]/60">
                    ID: {selectedNasabah.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#0B636B]/10">
                <span className="text-[#0B636B]/60 flex items-center gap-1.5 mb-1">
                  <Coins className="w-3.5 h-3.5 text-[#64B60A]" />
                  Saldo Poin
                </span>
                <span className="font-display font-extrabold text-xl text-[#0B636B]">
                  {Number(selectedNasabah.saldoPoin).toLocaleString("id-ID")}{" "}
                  <span className="text-xs font-normal text-[#0B636B]/60">poin</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#0B636B]/10">
                <span className="text-[#0B636B]/60 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-[#0B636B]" />
                  Kontak Telepon
                </span>
                <span className="font-mono font-bold text-sm text-[#0B636B]">
                  {selectedNasabah.telp}
                </span>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white border border-[#0B636B]/10">
                <span className="text-[#0B636B]/60 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0B636B]" />
                  Alamat Domisili
                </span>
                <p className="text-xs font-medium text-[#0B636B] leading-relaxed">
                  {selectedNasabah.alamat}
                </p>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white border border-[#0B636B]/10 flex items-center justify-between text-[#0B636B]/60">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Tanggal Terdaftar
                </span>
                <span className="font-semibold text-[#0B636B]">
                  {new Date(selectedNasabah.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#0B636B]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-5 py-2 rounded-full bg-[#EFF0EB] hover:bg-[#EFF0EB]/80 text-xs font-bold text-[#0B636B]"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* CONFIRM DIALOG: Hapus Nasabah */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setIsDeleteOpen(false);
            setDeleteDialogError(null);
          }
        }}
        onConfirm={() => {
          if (selectedNasabah) {
            deleteMutation.mutate(selectedNasabah.id);
          }
        }}
        title="Hapus Data Nasabah?"
        message={`Apakah Anda yakin ingin menghapus akun nasabah "${selectedNasabah?.namaNasabah}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Nasabah"
        isLoading={deleteMutation.isPending}
        error={deleteDialogError}
      />
    </div>
  );
}
