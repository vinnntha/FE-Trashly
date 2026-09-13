"use client";

import React, { useState } from "react";
import { useAdminAuthGuard } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized } = useAdminAuthGuard();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#EFF0EB] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0B636B] border-t-[#B6F022] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#0B636B]">
            Memverifikasi hak akses admin...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EFF0EB] text-[#0B636B] flex">
      {/* Sidebar: Desktop fixed & Mobile Drawer */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <Topbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
