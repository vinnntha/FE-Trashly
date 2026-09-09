"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#EFF0EB]/85 backdrop-blur-md border-b border-[#0B636B]/10 shadow-[0_4px_20px_-8px_rgba(11,99,107,0.08)]"
          : "bg-[#EFF0EB]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo Trashly */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#0B636B] flex items-center justify-center text-[#B6F022] shadow-sm transition-transform duration-300 group-hover:scale-105">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
              <path d="m14 16-3 3 3 3" />
              <path d="M8.293 13.596 5.196 9.5 7.196 6" />
              <path d="m17.5 4-3 3 3 3" />
              <path d="M15.5 7h4.815a1.83 1.83 0 0 1 1.57.882 1.785 1.785 0 0 1 .004 1.784l-1.465 2.534" />
            </svg>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-[#0B636B]">
            Trashly<span className="text-[#64B60A]">.</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#0B636B]/80">
          <a
            href="#fitur"
            className="hover:text-[#0B636B] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#64B60A] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Fitur
          </a>
          <a
            href="#cara-kerja"
            className="hover:text-[#0B636B] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#64B60A] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Cara Kerja
          </a>
          <a
            href="#kategori"
            className="hover:text-[#0B636B] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#64B60A] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Kategori Sampah
          </a>
          <a
            href="#tentang"
            className="hover:text-[#0B636B] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#64B60A] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Tentang
          </a>
        </nav>

        {/* Right Auth CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#0B636B] hover:text-[#64B60A] transition-colors px-3 py-2"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-semibold text-sm transition-all duration-200 shadow-[0_4px_16px_-4px_rgba(182,240,34,0.6)] hover:shadow-[0_6px_20px_-2px_rgba(182,240,34,0.8)] active:scale-95"
          >
            <span>Daftar Sekarang</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href="/register"
            className="px-4 py-2 rounded-full bg-[#B6F022] text-[#0B636B] text-xs font-semibold"
          >
            Daftar
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0B636B] rounded-lg focus:outline-none"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EFF0EB] border-b border-[#0B636B]/10 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3.5 text-base font-medium text-[#0B636B]">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#64B60A]"
            >
              Fitur
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#64B60A]"
            >
              Cara Kerja
            </a>
            <a
              href="#kategori"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#64B60A]"
            >
              Kategori Sampah
            </a>
            <a
              href="#tentang"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#64B60A]"
            >
              Tentang
            </a>
          </nav>
          <div className="pt-4 border-t border-[#0B636B]/10 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full text-center py-2.5 rounded-full border border-[#0B636B]/30 text-sm font-semibold text-[#0B636B]"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-2.5 rounded-full bg-[#B6F022] text-[#0B636B] text-sm font-semibold shadow-sm"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
