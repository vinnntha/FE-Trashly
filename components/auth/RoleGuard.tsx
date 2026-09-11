"use client";

import React, { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { isTokenExpired } from "@/lib/jwt";
import { ShieldAlert, LogOut, Home, ArrowLeft } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: ("NASABAH" | "ADMIN")[];
  fallback?: ReactNode;
}

export default function RoleGuard({
  children,
  allowedRoles = ["NASABAH", "ADMIN"],
  fallback,
}: RoleGuardProps) {
  const router = useRouter();
  const { user, token, tokenRole, isLoading, isSessionExpired, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // 1. Session expired or token missing/expired
    if (!token || isTokenExpired(token) || isSessionExpired) {
      if (token && isTokenExpired(token)) {
        logout(true);
      }
      router.push("/login");
      return;
    }

    // 2. No user loaded
    if (!user) {
      router.push("/login");
      return;
    }
  }, [isLoading, token, isSessionExpired, user, logout, router]);

  // Loading state while auth is initializing or being checked
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#EFF0EB] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0B636B] border-t-[#B6F022] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#0B636B]">Memverifikasi akses aman...</p>
        </div>
      </main>
    );
  }

  // If not logged in or token is expired, do not render children while redirecting
  if (!user || !token || isTokenExpired(token) || isSessionExpired) {
    return null;
  }

  // Check role authorization: use tokenRole (cryptographically from JWT payload) or user.role
  const currentRole = tokenRole || user.role;
  const isAuthorized = allowedRoles.includes(currentRole);

  if (!isAuthorized) {
    if (fallback) return <>{fallback}</>;

    return (
      <main className="min-h-screen bg-[#EFF0EB] flex items-center justify-center p-6 text-[#0B636B]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5 border border-red-100 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
            Akses Ditolak (403 Forbidden)
          </span>

          <h1 className="font-display font-bold text-2xl text-[#0B636B] mb-2">
            Izin Akses Terbatas
          </h1>

          <p className="text-xs text-[#0B636B]/75 leading-relaxed mb-6">
            Halaman ini hanya dapat diakses oleh peran{" "}
            <strong className="text-red-600 font-semibold">{allowedRoles.join(" atau ")}</strong>. Akun Anda saat ini terdaftar sebagai peran{" "}
            <strong className="text-[#0B636B] font-semibold">{currentRole}</strong>.
          </p>

          <div className="space-y-2.5">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0B636B] hover:bg-[#08494f] text-[#EFF0EB] font-bold text-xs transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Dashboard Saya</span>
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#0B636B]/20 hover:border-[#0B636B] text-[#0B636B] font-semibold text-xs transition-colors bg-white"
            >
              <Home className="w-4 h-4" />
              <span>Halaman Utama</span>
            </Link>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors pt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar & Masuk dengan Akun Lain</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
