"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Layers,
  Gift,
  ArrowDownToLine,
  ArrowLeftRight,
  FileText,
  Building2,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isUpcoming?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Data Nasabah",
    href: "/admin/nasabah",
    icon: Users,
  },
  {
    label: "Kategori Sampah",
    href: "/admin/kategori-sampah",
    icon: Layers,
  },
  {
    label: "Hadiah & Voucher",
    href: "/admin/hadiah",
    icon: Gift,
  },
  {
    label: "Data Setoran",
    href: "/admin/setor",
    icon: ArrowDownToLine,
    badge: "Segera",
    isUpcoming: true,
  },
  {
    label: "Data Penukaran",
    href: "/admin/penukaran",
    icon: ArrowLeftRight,
    badge: "Segera",
    isUpcoming: true,
  },
  {
    label: "Rekapitulasi",
    href: "/admin/rekapitulasi",
    icon: FileText,
    badge: "Segera",
    isUpcoming: true,
  },
  {
    label: "Profil Unit",
    href: "/admin/profil",
    icon: Building2,
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#0B636B]/10 p-5 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#0B636B]/10">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5 group"
          onClick={onMobileClose}
        >
          <div className="relative w-9 h-9 rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/logo.png"
              alt="Trashly Logo"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xl text-[#0B636B] tracking-tight">
                Trashly
              </span>
              <span className="text-[10px] font-bold bg-[#B6F022] text-[#0B636B] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-[#0B636B]/60 truncate max-w-[140px]">
              {user?.adminBank?.namaUnit || "Unit Bank Sampah"}
            </p>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-full text-[#0B636B]/50 hover:text-[#0B636B] hover:bg-[#EFF0EB]"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-5 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#0B636B]/40 px-3 pb-1">
          Master Data & Layanan
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#0B636B] text-white shadow-sm shadow-[#0B636B]/20"
                  : "text-[#0B636B]/75 hover:bg-[#EFF0EB] hover:text-[#0B636B]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-[#B6F022]" : "text-[#0B636B]/60"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive
                      ? "bg-white/20 text-[#B6F022]"
                      : "bg-[#EFF0EB] text-[#0B636B]/60"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Logout */}
      <div className="pt-4 border-t border-[#0B636B]/10 space-y-3">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#EFF0EB]/60 border border-[#0B636B]/8">
          <div className="w-9 h-9 rounded-xl bg-[#0B636B] text-[#B6F022] font-display font-bold text-sm flex items-center justify-center shrink-0">
            {user?.adminBank?.namaPengelola?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#0B636B] truncate">
              {user?.adminBank?.namaPengelola || "Pengelola"}
            </p>
            <p className="text-[10px] text-[#0B636B]/60 truncate">
              {user?.adminBank?.telp || user?.username || "Admin Bank"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0B636B]/30 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          {/* Drawer panel */}
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
