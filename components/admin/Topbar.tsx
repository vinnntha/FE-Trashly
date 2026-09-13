"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, ChevronRight, Building2, User } from "lucide-react";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/nasabah": "Data Nasabah",
  "/admin/kategori-sampah": "Kategori Sampah",
  "/admin/hadiah": "Hadiah & Voucher",
  "/admin/profil": "Profil Unit Bank",
  "/admin/setor": "Data Setoran",
  "/admin/setoran": "Data Setoran",
  "/admin/penukaran": "Data Penukaran",
  "/admin/rekapitulasi": "Rekapitulasi",
};

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const currentPageTitle = BREADCRUMB_MAP[pathname] || "Admin Panel";

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#EFF0EB]/80 backdrop-blur-md border-b border-[#0B636B]/10 px-4 sm:px-6 lg:px-10 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-2xl bg-white border border-[#0B636B]/12 text-[#0B636B] hover:bg-[#EFF0EB] transition-colors shadow-sm"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-[#0B636B]/60 font-medium">
          <Link
            href="/admin/dashboard"
            className="hover:text-[#0B636B] transition-colors flex items-center gap-1"
          >
            <span>Admin</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#0B636B]/30" />
          <span className="font-bold text-[#0B636B]">{currentPageTitle}</span>
        </nav>
      </div>

      {/* Right: Unit Bank Name & Manager Info */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="font-display font-bold text-xs text-[#0B636B] leading-tight">
            {user?.adminBank?.namaUnit || "Unit Bank Sampah"}
          </span>
          <span className="text-[11px] text-[#0B636B]/60">
            {user?.adminBank?.namaPengelola || user?.username || "Admin"}
          </span>
        </div>

        <Link
          href="/admin/profil"
          className="w-9 h-9 rounded-2xl bg-white border border-[#0B636B]/15 text-[#0B636B] flex items-center justify-center hover:bg-[#B6F022]/20 hover:border-[#0B636B]/30 transition-all shadow-sm group"
          title="Lihat Profil Unit"
        >
          <Building2 className="w-4 h-4 text-[#0B636B] group-hover:scale-110 transition-transform" />
        </Link>
      </div>
    </header>
  );
}
