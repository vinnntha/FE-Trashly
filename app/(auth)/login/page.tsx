"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Recycle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !password.trim()) {
      setError("Mohon isi username dan password Anda.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userProfile = await login(username, password);
      setSuccess(`Selamat datang kembali, ${userProfile.nasabah?.namaNasabah || userProfile.adminBank?.namaPengelola || userProfile.username}!`);
      
      // Brief delay for feedback before redirecting
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal masuk. Periksa kembali username dan kata sandi Anda.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#EFF0EB] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden text-[#0B636B]">
      {/* Decorative Orbiting Background Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full border border-[#0B636B]/10 pointer-events-none" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] rounded-full border border-dashed border-[#64B60A]/20 pointer-events-none animate-spin-slow" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Kolom Kiri: Branding & Visual Sirkular (5 cols desktop) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 rounded-3xl bg-[#0B636B] text-[#EFF0EB] min-h-[540px] relative overflow-hidden shadow-[0_24px_60px_-15px_rgba(11,99,107,0.35)]">
          <div className="relative z-10">
            <Link href="/" className="inline-block mb-10">
              <Image
                src="/images/Logo Trashly white.png"
                alt="Trashly Logo"
                width={140}
                height={44}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B6F022]/20 border border-[#B6F022]/30 text-[#B6F022] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal Masuk Resmi</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl text-white tracking-tight leading-snug mb-4">
              Pilah Sampah, Kumpulkan Poin, Dan Ubah Jadi Hadiah.
            </h1>

            <p className="text-sm text-[#EFF0EB]/80 leading-relaxed max-w-xs">
              Masuk ke akun Anda untuk memantau saldo poin, mengajukan setoran sampah, dan melihat riwayat penimbangan terverifikasi.
            </p>
          </div>

          {/* Decorative Features Widget */}
          <div className="relative z-10 pt-6 border-t border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#CFE26C]">
              <ShieldCheck className="w-4 h-4 text-[#B6F022]" />
              <span>Timbangan Digital Real-time & Akurat</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#EFF0EB]/70">
              <Recycle className="w-4 h-4 text-[#CFE26C]" />
              <span>Pemberdayaan 45+ Bank Sampah Unit</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Card Login (7 cols desktop) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#0B636B]/12 shadow-[0_16px_40px_-10px_rgba(11,99,107,0.1)]">
          {/* Logo on Mobile */}
          <div className="flex lg:hidden justify-between items-center mb-6 pb-4 border-b border-[#0B636B]/10">
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
            <Link
              href="/"
              className="text-xs font-semibold text-[#0B636B]/70 hover:text-[#0B636B]"
            >
              ← Beranda
            </Link>
          </div>

          {/* Header Form */}
          <div className="mb-8">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B] tracking-tight">
              Selamat Datang Kembali 👋
            </h2>
            <p className="text-sm text-[#0B636B]/75 mt-1.5">
              Masukkan nama pengguna dan kata sandi Anda untuk mengakses akun.
            </p>
          </div>

          {/* Alert Error */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Gagal Masuk</p>
                <p className="mt-0.5 text-red-600/90">{error}</p>
              </div>
            </div>
          )}

          {/* Alert Success */}
          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-[#CFE26C]/30 border border-[#64B60A]/40 text-[#0B636B] text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#64B60A]" />
              <span className="font-semibold">{success}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B636B]/50">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username Anda"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Field Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B636B]/50">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#0B636B]/50 hover:text-[#0B636B] transition-colors"
                  aria-label="Tampilkan kata sandi"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-base transition-all duration-200 shadow-[0_6px_20px_-4px_rgba(182,240,34,0.6)] hover:shadow-[0_8px_24px_-2px_rgba(182,240,34,0.8)] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0B636B] border-t-transparent rounded-full animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <>
                  <span>Masuk Akun</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="mt-8 pt-6 border-t border-[#0B636B]/10 text-center">
            <p className="text-sm text-[#0B636B]/70">
              Belum memiliki akun Trashly?{" "}
              <Link
                href="/register"
                className="font-bold text-[#0B636B] hover:text-[#64B60A] underline underline-offset-4 decoration-[#B6F022] transition-colors"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
