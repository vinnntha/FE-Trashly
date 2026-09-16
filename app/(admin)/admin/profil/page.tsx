"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import {
  updateAdminProfileSchema,
  UpdateAdminProfileInput,
} from "@/lib/validations/update-admin-profile.schema";
import {
  Building2,
  User,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";

export default function AdminProfilPage() {
  const queryClient = useQueryClient();
  const { user, refreshUser } = useAuth();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateAdminProfileInput>({
    resolver: zodResolver(updateAdminProfileSchema),
    defaultValues: {
      namaUnit: "",
      namaPengelola: "",
      telp: "",
    },
  });

  // Pre-fill form values when user profile is loaded
  useEffect(() => {
    if (user?.adminBank) {
      reset({
        namaUnit: user.adminBank.namaUnit || "",
        namaPengelola: user.adminBank.namaPengelola || "",
        telp: user.adminBank.telp || "",
      });
    }
  }, [user, reset]);

  // Mutation to update profile
  const mutation = useMutation({
    mutationFn: async (data: UpdateAdminProfileInput) => {
      return apiClient<{ message: string; data: any }>("/admin/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: async (res) => {
      setSuccessMessage(res.message || "Profil unit bank sampah berhasil diperbarui.");
      setErrorMessage(null);
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || "Gagal memperbarui profil. Silakan coba lagi.");
      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: UpdateAdminProfileInput) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    mutation.mutate(data);
  };

  const watchedNamaUnit = watch("namaUnit") || user?.adminBank?.namaUnit || "Unit Bank Sampah";
  const watchedPengelola = watch("namaPengelola") || user?.adminBank?.namaPengelola || "Admin Pengelola";
  const watchedTelp = watch("telp") || user?.adminBank?.telp || "-";

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-[#0B636B]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F022]/20 text-[#0B636B] text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Pengaturan Identitas Unit</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0B636B] tracking-tight">
            Profil Unit Bank Sampah
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-0.5">
            Perbarui identitas operasional bank sampah, nama koordinator pengelola, dan nomor kontak resmi.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#64B60A]/10 text-[#64B60A] text-xs font-bold shrink-0 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#64B60A] animate-ping" />
          <span>Status Unit Aktif</span>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 rounded-3xl bg-[#B6F022]/20 border border-[#B6F022] text-[#0B636B] text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#64B60A] shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-3xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2-Column Split: Identity Badge + Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (4 Cols): Identity Preview Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-[#0B636B] to-[#084b51] text-white p-6 rounded-3xl shadow-md shadow-[#0B636B]/20 relative overflow-hidden space-y-4">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full border-4 border-white/5 pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-[#B6F022] text-[#0B636B] flex items-center justify-center font-black shadow-md">
              <Building2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B6F022]">
                Unit Bank Sampah
              </span>
              <h2 className="font-display font-extrabold text-lg text-white leading-tight mt-0.5">
                {watchedNamaUnit}
              </h2>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#B6F022]" />
                <span>Pengelola: <strong className="text-white">{watchedPengelola}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B6F022]" />
                <span>Kontak: <strong className="text-white font-mono">{watchedTelp}</strong></span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-[#B6F022] font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Terdaftar di Trashly
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-white">
                Admin
              </span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white rounded-3xl border border-[#0B636B]/12 p-5 shadow-sm text-xs text-[#0B636B]/75 space-y-2.5">
            <div className="font-display font-bold text-xs text-[#0B636B] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#64B60A]" />
              <span>Petunjuk Profil Unit</span>
            </div>
            <p className="leading-relaxed">
              Nama unit dan nomor telepon akan tercetak otomatis pada struk nota setoran dan nota klaim hadiah nasabah.
            </p>
          </div>
        </div>

        {/* Right (8 Cols): Editable Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#0B636B]/12 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Metadata Row */}
            <div className="p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[#0B636B]/60 block font-medium">Username Akun</span>
                <span className="font-mono font-bold text-[#0B636B] text-sm">
                  @{user?.username}
                </span>
              </div>
              <div>
                <span className="text-[#0B636B]/60 block font-medium">Hak Akses Sistem</span>
                <span className="font-bold bg-[#0B636B] text-[#B6F022] px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wide">
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Nama Unit Bank Sampah */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                  Nama Unit Bank Sampah <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#0B636B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    {...register("namaUnit")}
                    placeholder="Contoh: Bank Sampah Sukamaju Sejahtera"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#EFF0EB]/30 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] transition-all"
                  />
                </div>
                {errors.namaUnit && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.namaUnit.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Pengelola */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                    Nama Pengelola / Koordinator <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#0B636B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      {...register("namaPengelola")}
                      placeholder="Nama pengelola unit"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#EFF0EB]/30 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] transition-all"
                    />
                  </div>
                  {errors.namaPengelola && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.namaPengelola.message}
                    </p>
                  )}
                </div>

                {/* Nomor Telepon */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                    Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#0B636B]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      {...register("telp")}
                      placeholder="081234567890"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#EFF0EB]/30 border border-[#0B636B]/15 rounded-2xl text-xs sm:text-sm text-[#0B636B] placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] transition-all"
                    />
                  </div>
                  {errors.telp && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.telp.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#0B636B]/10 flex items-center justify-between">
              {isDirty ? (
                <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Ada perubahan belum disimpan
                </span>
              ) : (
                <span className="text-xs text-[#0B636B]/50">Data tersinkron</span>
              )}

              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-6 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-display font-bold text-xs sm:text-sm shadow-md shadow-[#B6F022]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
