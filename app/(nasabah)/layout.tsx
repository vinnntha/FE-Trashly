"use client";

import React, { ReactNode } from "react";
import { useAuthGuard } from "@/lib/auth";
import Sidebar from "@/components/nasabah/Sidebar";
import BottomNav from "@/components/nasabah/BottomNav";

export default function NasabahLayout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthorized } = useAuthGuard();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#EFF0EB] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0B636B] border-t-[#B6F022] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#0B636B]">Memuat halaman nasabah...</p>
        </div>
      </main>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EFF0EB] text-[#0B636B] flex">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen pb-24 md:pb-12">
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <BottomNav />
    </div>
  );
}
