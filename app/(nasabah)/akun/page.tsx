"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { getImageUrl } from "@/lib/image";
import { useAuth } from "@/context/AuthContext";
import { clearSession } from "@/lib/auth";
import SkeletonCard from "@/components/nasabah/SkeletonCard";
import {
  User,
  MapPin,
  Phone,
  LogOut,
  Sparkles,
  ShieldCheck,
  Award,
  Recycle,
  Info,
} from "lucide-react";

interface UserMeResponse {
  message: string;
  data: {
    id: string;
    username: string;
    role: string;
    nasabah: {
      id: string;
      namaNasabah: string;
      alamat: string;
      telp: string;
      saldoPoin: number;
      foto?: string | null;
    } | null;
  };
}

export default function AkunNasabahPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const { data: resData, isLoading } = useQuery<UserMeResponse>({
    queryKey: ["user-me"],
    queryFn: () => apiClient<UserMeResponse>("/auth/me"),
  });

  const userData = resData?.data;
  const nasabah = userData?.nasabah;

  const handleLogout = () => {
    clearSession();
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
        <div className="w-48 h-8 bg-white/70 rounded-2xl animate-pulse" />
        <div className="h-64 bg-white/70 rounded-3xl animate-pulse" />
      </div>
    );
  }

  const userInitial = (nasabah?.namaNasabah?.[0] || userData?.username?.[0] || "N").toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-2">
          <User className="w-3.5 h-3.5 text-[#64B60A]" />
          <span>Profil Pengguna</span>
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B636B] tracking-tight">
          Akun Nasabah Saya
        </h1>
        <p className="text-xs sm:text-sm text-[#0B636B]/75 mt-1">
          Informasi data kepesertaan Anda di platform bank sampah Trashly.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B636B]/12 shadow-sm space-y-6">
        {/* Main Info Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#0B636B]/10">
          {nasabah?.foto ? (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shrink-0 border-2 border-[#64B60A]/30 shadow-md">
              <Image
                src={getImageUrl(nasabah.foto)}
                alt={nasabah.namaNasabah}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0B636B] text-[#B6F022] font-display font-extrabold text-3xl flex items-center justify-center shrink-0 shadow-md">
              {userInitial}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0B636B]">
                {nasabah?.namaNasabah || userData?.username}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-[10px] font-bold uppercase">
                <ShieldCheck className="w-3 h-3 text-[#64B60A]" />
                <span>Terverifikasi</span>
              </span>
            </div>
            <p className="text-xs text-[#0B636B]/60 font-mono">
              Username: @{userData?.username}
            </p>
            <p className="text-xs text-[#64B60A] font-semibold flex items-center gap-1.5 pt-1">
              <Award className="w-4 h-4" />
              <span>Saldo: {Number(nasabah?.saldoPoin ?? 0).toLocaleString("id-ID")} Poin Aktif</span>
            </p>
          </div>
        </div>

        {/* Detail Fields (Read-Only) */}
        {/* TODO: endpoint edit profil nasabah belum tersedia di backend, tambahkan PUT /api/v1/nasabah/profile bila diperlukan */}
        <div className="space-y-4 text-xs text-[#0B636B]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#0B636B]/60 tracking-wider">
                Nomor Telepon / WhatsApp
              </p>
              <p className="font-semibold text-sm text-[#0B636B] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#64B60A]" />
                <span>{nasabah?.telp || "-"}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#0B636B]/60 tracking-wider">
                Peran Akun
              </p>
              <p className="font-semibold text-sm text-[#0B636B] flex items-center gap-2">
                <Recycle className="w-4 h-4 text-[#64B60A]" />
                <span>Nasabah Bank Sampah</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/10 space-y-1">
            <p className="text-[10px] uppercase font-bold text-[#0B636B]/60 tracking-wider">
              Alamat Lengkap Domisili
            </p>
            <p className="font-medium text-xs sm:text-sm text-[#0B636B] flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#64B60A] shrink-0 mt-0.5" />
              <span>{nasabah?.alamat || "Alamat belum diatur"}</span>
            </p>
          </div>
        </div>

        {/* Read-Only Notice */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 shrink-0 text-[#0B636B] mt-0.5" />
          <p className="leading-relaxed">
            Perubahan data profil (nama, alamat, telepon) dikelola langsung oleh administrator bank sampah unit demi validitas pendataan penimbangan resmi.
          </p>
        </div>

        {/* Logout Action */}
        <div className="pt-4 border-t border-[#0B636B]/10">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}
