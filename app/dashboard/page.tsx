"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/auth/RoleGuard";
import {
  LogOut,
  Award,
  Recycle,
  Building2,
  UserCheck,
  MapPin,
  Phone,
  ShieldCheck,
  PlusCircle,
  History,
  Gift,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const { user, tokenRole, logout } = useAuth();

  if (!user) return null;

  const currentRole = tokenRole || user.role;
  const isNasabah = currentRole === "NASABAH";
  const nasabahData = user.nasabah;
  const adminData = user.adminBank;

  return (
    <main className="min-h-screen bg-[#EFF0EB] text-[#0B636B] pb-16">
      {/* Navbar Dashboard */}
      <header className="bg-[#EFF0EB] border-b border-[#0B636B]/10 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/Full Logo Trashly.png"
              alt="Trashly Logo"
              width={130}
              height={40}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#0B636B]/15 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#64B60A]" />
              <span>{isNasabah ? "Portal Nasabah" : "Portal Admin Unit"}</span>
            </div>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B636B]/10 hover:bg-red-50 hover:text-red-600 text-[#0B636B] text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 sm:pt-12">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#64B60A]" />
              <span>Dashboard {currentRole}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B] tracking-tight">
              Halo, {isNasabah ? nasabahData?.namaNasabah || user.username : adminData?.namaPengelola || user.username}! 👋
            </h1>
            <p className="text-sm text-[#0B636B]/75 mt-1">
              {isNasabah
                ? "Pantau perolehan poin sampah terpilah dan lakukan penukaran reward."
                : `Pengelola resmi unit bank sampah ${adminData?.namaUnit || ""}.`}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#0B636B]/25 hover:border-[#0B636B] text-[#0B636B] font-semibold text-xs transition-colors bg-white/50"
          >
            <span>Halaman Utama</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* DASHBOARD NASABAH */}
        {isNasabah && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Kartu Saldo Poin Main Card (7 cols) */}
            <div className="lg:col-span-7 bg-[#0B636B] text-[#EFF0EB] rounded-3xl p-8 shadow-[0_20px_50px_-12px_rgba(11,99,107,0.35)] border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Recycle className="w-56 h-56 text-white" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#B6F022]/20 flex items-center justify-center text-[#B6F022]">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#EFF0EB]/70 leading-none">Kartu Tabungan Sampah</p>
                      <p className="text-sm font-bold text-white mt-0.5">Eco Champion</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-[#CFE26C] border border-white/10">
                    ID: #{user.id.slice(0, 8)}
                  </span>
                </div>

                <div className="my-4">
                  <p className="text-xs font-medium text-[#EFF0EB]/70">Total Saldo Poin Aktif</p>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-display font-extrabold text-5xl sm:text-6xl text-[#B6F022] tracking-tight">
                      {nasabahData?.saldoPoin ?? 0}
                    </span>
                    <span className="text-sm font-bold text-[#CFE26C]">POIN</span>
                  </div>
                  <p className="text-xs text-[#EFF0EB]/65 mt-2">
                    Setara Rp {(nasabahData?.saldoPoin ?? 0) * 100} saldo e-wallet / voucher belanja
                  </p>
                </div>
              </div>

              {/* Quick Action Bar */}
              <div className="relative z-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#CFE26C] flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#B6F022]" />
                  <span>Status Terverifikasi</span>
                </span>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-full bg-[#B6F022] text-[#0B636B] font-bold hover:bg-[#a9e419] transition-colors flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Tukar Poin</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profil & Detail Nasabah (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-[#0B636B]/12 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-[#0B636B] mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#64B60A]" />
                  <span>Informasi Akun Nasabah</span>
                </h3>

                <div className="space-y-4 text-sm text-[#0B636B]">
                  <div className="p-3.5 rounded-2xl bg-[#EFF0EB]/70 border border-[#0B636B]/10 flex items-center gap-3">
                    {nasabahData?.foto ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#0B636B]/20">
                        <Image
                          src={nasabahData.foto.startsWith("http") ? nasabahData.foto : `http://localhost:5000${nasabahData.foto}`}
                          alt="Foto Profil"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#0B636B]/10 text-[#0B636B] font-bold text-lg flex items-center justify-center shrink-0">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[#0B636B]">{nasabahData?.namaNasabah || user.username}</p>
                      <p className="text-xs text-[#0B636B]/60">@{user.username}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-[#0B636B]/80 pt-2">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#64B60A] shrink-0 mt-0.5" />
                      <span>{nasabahData?.alamat || "Alamat belum diatur"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#64B60A] shrink-0" />
                      <span>{nasabahData?.telp || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#0B636B]/10 text-xs text-[#0B636B]/60">
                Terdaftar di sistem Trashly Indonesia.
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD ADMIN BANK SAMPAH */}
        {!isNasabah && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Admin Card (7 cols) */}
            <div className="lg:col-span-7 bg-[#0B636B] text-[#EFF0EB] rounded-3xl p-8 shadow-[0_20px_50px_-12px_rgba(11,99,107,0.35)] border border-white/10 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B6F022]/20 text-[#B6F022] text-xs font-semibold mb-4">
                  <Building2 className="w-4 h-4" />
                  <span>Pengelola Unit Resmi</span>
                </div>

                <h2 className="font-display font-extrabold text-3xl text-white mb-2">
                  {adminData?.namaUnit || "Unit Bank Sampah"}
                </h2>
                <p className="text-sm text-[#EFF0EB]/80 leading-relaxed">
                  Penanggung jawab: <strong className="text-[#B6F022]">{adminData?.namaPengelola || user.username}</strong>
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-xs text-[#EFF0EB]/60">Nomor Kontak Unit</p>
                    <p className="font-bold text-sm text-[#CFE26C] mt-0.5">{adminData?.telp || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#EFF0EB]/60">Status Akses</p>
                    <p className="font-bold text-sm text-[#B6F022] mt-0.5">Admin Terverifikasi</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/15 flex items-center justify-between text-xs">
                <span className="text-[#EFF0EB]/70">Modul Administrasi Penimbangan</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-[#CFE26C]">Versi 1.0</span>
              </div>
            </div>

            {/* Quick Actions (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-[#0B636B]/12 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg text-[#0B636B] mb-2">
                Aksi Cepat Pengelola
              </h3>

              <button className="w-full p-4 rounded-2xl bg-[#EFF0EB] hover:bg-[#CFE26C]/30 border border-[#0B636B]/10 text-[#0B636B] font-bold text-sm flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 text-[#64B60A]" />
                  <span>Catat Setoran Sampah Baru</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button className="w-full p-4 rounded-2xl bg-[#EFF0EB] hover:bg-[#CFE26C]/30 border border-[#0B636B]/10 text-[#0B636B] font-bold text-sm flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-[#64B60A]" />
                  <span>Rekapitulasi Penimbangan</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={["NASABAH", "ADMIN"]}>
      <DashboardContent />
    </RoleGuard>
  );
}
