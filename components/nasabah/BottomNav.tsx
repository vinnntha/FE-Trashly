"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Gift,
  User,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { label: "Setor", href: "/setor", icon: PlusCircle },
  { label: "Riwayat", href: "/riwayat", icon: History },
  { label: "Tukar Poin", href: "/hadiah", icon: Gift },
  { label: "Akun", href: "/akun", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#0B636B]/10 px-3 py-2 shadow-[0_-8px_25px_rgba(11,99,107,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-[#0B636B] font-bold"
                  : "text-[#0B636B]/60 hover:text-[#0B636B]"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#B6F022] text-[#0B636B] shadow-sm scale-105"
                    : "hover:bg-[#EFF0EB]"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
