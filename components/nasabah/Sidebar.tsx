"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Gift,
  User,
  Layers,
  LogOut,
  Sparkles,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { label: "Ajukan Setoran", href: "/setor", icon: PlusCircle },
  { label: "Riwayat Setor", href: "/riwayat", icon: History },
  { label: "Katalog Hadiah", href: "/hadiah", icon: Gift },
  { label: "Daftar Sampah", href: "/kategori-sampah", icon: Layers },
  { label: "Akun Saya", href: "/akun", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const nasabahName = user?.nasabah?.namaNasabah || user?.username || "Nasabah";
  const userInitial = (nasabahName[0] || "N").toUpperCase();

  return (
    <aside
      aria-label="Sidebar Navigasi Desktop"
      className="hidden md:flex flex-col justify-between w-64 lg:w-72 bg-white border-r border-[#0B636B]/10 p-6 h-screen sticky top-0 shrink-0 select-none shadow-[4px_0_24px_rgba(11,99,107,0.03)]"
    >
      <div>
        {/* Logo Trashly */}
        <div className="pb-6 mb-6 border-b border-[#0B636B]/10">
          <Link href="/dashboard" className="inline-block">
            <Image
              src="/images/Full Logo Trashly.png"
              alt="Trashly Logo"
              width={140}
              height={44}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF0EB] border border-[#0B636B]/10 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#64B60A] animate-pulse" />
            <span className="text-[11px] font-bold text-[#0B636B] tracking-wide uppercase">
              Portal Nasabah
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#0B636B] text-[#EFF0EB] shadow-[0_8px_20px_-6px_rgba(11,99,107,0.4)] translate-x-1"
                    : "text-[#0B636B]/75 hover:text-[#0B636B] hover:bg-[#EFF0EB]/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-[#B6F022]" : "text-[#64B60A]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B6F022]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Logout */}
      <div className="pt-6 border-t border-[#0B636B]/10 space-y-3">
        {/* User Card */}
        <Link
          href="/akun"
          className="flex items-center gap-3 p-3 rounded-2xl bg-[#EFF0EB]/70 hover:bg-[#EFF0EB] border border-[#0B636B]/10 transition-colors"
        >
          {user?.nasabah?.foto ? (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#0B636B]/20">
              <Image
                src={
                  user.nasabah.foto.startsWith("http")
                    ? user.nasabah.foto
                    : `http://localhost:5000${user.nasabah.foto}`
                }
                alt="Foto Profil"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#0B636B] text-[#B6F022] font-bold text-base flex items-center justify-center shrink-0">
              {userInitial}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs text-[#0B636B] truncate">
              {nasabahName}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#64B60A] font-semibold mt-0.5">
              <Sparkles className="w-3 h-3" />
              <span>{user?.nasabah?.saldoPoin ?? 0} Poin</span>
            </div>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
