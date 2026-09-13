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
  Sparkles,
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64B60A] bg-[#64B60A]/10 px-2.5 py-0.5 rounded-full">
            Pengaturan Akun
          </span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0B636B]">
          Profil Unit Bank Sampah
        </h1>
        <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-1">
          Perbarui identitas unit bank sampah, nama penanggung jawab pengelola, dan kontak resmi.
        </p>
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

      {/* Main Profile Form Card */}
      <div className="bg-white rounded-3xl border border-[#0B636B]/12 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Readonly Account Info */}
          <div className="p-4 rounded-2xl bg-[#EFF0EB]/50 border border-[#0B636B]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#0B636B]/60 block font-medium">Username Akun</span>
              <span className="font-mono font-bold text-[#0B636B] text-sm">
                @{user?.username}
              </span>
            </div>
            <div>
              <span className="text-[#0B636B]/60 block font-medium">Peran Sistem</span>
              <span className="font-bold bg-[#0B636B] text-[#B6F022] px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wide">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Nama Unit Bank Sampah */}
            <div className="sm:col-span-2 space-y-1.5">
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

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#0B636B]/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-3 rounded-full bg-[#B6F022] hover:bg-[#a8e018] text-[#0B636B] font-display font-bold text-xs sm:text-sm shadow-md shadow-[#B6F022]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Perubahan...</span>
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
  );
}
