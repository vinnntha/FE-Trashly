"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/image";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Gift,
  User,
  Layers,
  LogOut,
  Sparkles,
  ChevronRight,
  Leaf,
  ArrowLeftRight,
  X,
} from "lucide-react";

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badgeKey?: "pendingSetoran";
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Ringkasan",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Aktivitas & Setoran",
    items: [
      {
        label: "Ajukan Setoran",
        href: "/setor",
        icon: PlusCircle,
      },
      {
        label: "Riwayat Setor",
        href: "/riwayat",
        icon: History,
        badgeKey: "pendingSetoran",
      },
      {
        label: "Riwayat Penukaran",
        href: "/hadiah/riwayat",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    title: "Katalog & Hadiah",
    items: [
      {
        label: "Katalog Hadiah",
        href: "/hadiah",
        icon: Gift,
      },
      {
        label: "Daftar Sampah",
        href: "/kategori-sampah",
        icon: Layers,
      },
    ],
  },
  {
    title: "Pengaturan Akun",
    items: [
      {
        label: "Akun Saya",
        href: "/akun",
        icon: User,
      },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Query pending deposits count for live badge
  const { data: mySetoranRes } = useQuery<{ data: Array<{ status?: string }> }>({
    queryKey: ["my-setoran-sidebar-badge"],
    queryFn: async () => {
      const res = await apiClient<{ data: Array<{ status?: string }> }>("/setor-sampah/my-setor");
      return res || { data: [] };
    },
    staleTime: 30000,
  });

  const pendingCount = (mySetoranRes?.data || []).filter(
    (item) => (item.status || "").toLowerCase() === "menunggu_konfirmasi"
  ).length;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const nasabahName = user?.nasabah?.namaNasabah || user?.username || "Nasabah";
  const userInitial = (nasabahName[0] || "N").toUpperCase();

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#0B636B]/10 p-4 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#0B636B]/10">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group w-full"
          onClick={onMobileClose}
        >
          <div className="flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Image src="/images/Full Logo Trashly.png" alt="Logo" width={90} height={50} />
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-full text-[#0B636B]/50 hover:text-[#0B636B] hover:bg-[#EFF0EB]"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 py-3 space-y-4 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B636B]/40 px-3 py-1">
              {section.title}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(`${item.href}/`) &&
                  (item.href !== "/hadiah" || !pathname.startsWith("/hadiah/riwayat")));

              const badgeValue =
                item.badgeKey === "pendingSetoran" && pendingCount > 0
                  ? pendingCount
                  : null;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#0B636B] text-white shadow-md shadow-[#0B636B]/20"
                      : "text-[#0B636B]/75 hover:bg-[#EFF0EB] hover:text-[#0B636B]"
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#B6F022]" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-[#B6F022]" : "text-[#0B636B]/60"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {badgeValue ? (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 animate-pulse ${
                        isActive
                          ? "bg-[#B6F022] text-[#0B636B]"
                          : "bg-[#B6F022]/80 text-[#0B636B] border border-[#64B60A]/40"
                      }`}
                    >
                      {badgeValue}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-[#B6F022]/70 shrink-0" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Profile & Status Identity */}
      <div className="pt-3 border-t border-[#0B636B]/10 space-y-2.5">
        {/* Status indicator */}
        <div className="px-2.5 py-1.5 rounded-xl bg-[#EFF0EB]/50 border border-[#0B636B]/10 flex items-center justify-between text-[10px] text-[#0B636B]/70">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#64B60A] animate-ping" />
            Nasabah Aktif
          </span>
          <span className="font-mono font-bold text-[#64B60A] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{user?.nasabah?.saldoPoin ?? 0} Poin</span>
          </span>
        </div>

        {/* User Card */}
        <Link
          href="/akun"
          onClick={onMobileClose}
          className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#EFF0EB]/60 hover:bg-[#EFF0EB] border border-[#0B636B]/8 transition-colors group"
        >
          {user?.nasabah?.foto ? (
            <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-[#0B636B]/20">
              <Image
                src={getImageUrl(user.nasabah.foto)}
                alt="Foto Profil"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-[#0B636B] text-[#B6F022] font-display font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              {userInitial}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#0B636B] truncate group-hover:text-[#64B60A] transition-colors">
              {nasabahName}
            </p>
            <p className="text-[10px] text-[#0B636B]/60 truncate font-mono">
              {user?.nasabah?.telp || user?.username || "Nasabah"}
            </p>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer (if triggered) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
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
