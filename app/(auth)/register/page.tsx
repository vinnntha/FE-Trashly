"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Lock,
  Phone,
  MapPin,
  Building2,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { registerNasabah, registerAdmin, login } = useAuth();

  // Role selector state: 'NASABAH' | 'ADMIN'
  const [roleTab, setRoleTab] = useState<"NASABAH" | "ADMIN">("NASABAH");

  // Common Form Fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [telp, setTelp] = useState("");

  // Nasabah-specific Fields
  const [namaNasabah, setNamaNasabah] = useState("");
  const [alamat, setAlamat] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // Admin-specific Fields
  const [namaUnit, setNamaUnit] = useState("");
  const [namaPengelola, setNamaPengelola] = useState("");

  // Feedback & Loading State
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran foto maksimal 5MB.");
        return;
      }
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFotoFile(null);
    setFotoPreview(null);
  };

  // Handle Submit Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation checks
    if (username.length < 4) {
      setError("Username minimal 4 karakter.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (!telp.trim()) {
      setError("Nomor telepon wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (roleTab === "NASABAH") {
        if (!namaNasabah.trim()) {
          setError("Nama nasabah tidak boleh kosong.");
          setIsSubmitting(false);
          return;
        }
        if (!alamat.trim()) {
          setError("Alamat tidak boleh kosong.");
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("username", username.trim());
        formData.append("password", password);
        formData.append("namaNasabah", namaNasabah.trim());
        formData.append("alamat", alamat.trim());
        formData.append("telp", telp.trim());
        if (fotoFile) {
          formData.append("foto", fotoFile);
        }

        await registerNasabah(formData);
      } else {
        if (!namaUnit.trim()) {
          setError("Nama Unit Bank Sampah tidak boleh kosong.");
          setIsSubmitting(false);
          return;
        }
        if (!namaPengelola.trim()) {
          setError("Nama pengelola tidak boleh kosong.");
          setIsSubmitting(false);
          return;
        }

        await registerAdmin({
          username: username.trim(),
          password,
          namaUnit: namaUnit.trim(),
          namaPengelola: namaPengelola.trim(),
          telp: telp.trim(),
        });
      }

      setSuccess("Pendaftaran berhasil! Mengalihkan Anda...");

      // Automatically log in the user after registration
      try {
        await login(username.trim(), password);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } catch {
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || "Gagal melakukan pendaftaran. Silakan periksa data Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#EFF0EB] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden text-[#0B636B]">
      {/* Background Orbits */}
      <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full border border-[#0B636B]/10 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full border border-dashed border-[#64B60A]/20 pointer-events-none animate-spin-slow" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Kolom Kiri: Visual Info Brand (5 cols desktop) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 rounded-3xl bg-[#0B636B] text-[#EFF0EB] min-h-[620px] relative overflow-hidden shadow-[0_24px_60px_-15px_rgba(11,99,107,0.35)]">
          <div className="relative z-10">
            <Link href="/" className="inline-block mb-8">
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
              <span>Gabung Ekosistem Sirkular</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl text-white tracking-tight leading-snug mb-4">
              Mulai Langkah Hijaumu Bersama Trashly.
            </h1>

            <p className="text-sm text-[#EFF0EB]/80 leading-relaxed">
              Daftar sebagai <strong className="text-[#B6F022]">Nasabah Warga</strong> untuk menabung sampah terpilah, atau daftarkan <strong className="text-[#B6F022]">Unit Bank Sampah</strong> Anda sebagai mitra resmi digital.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#CFE26C]">
              <ShieldCheck className="w-4 h-4 text-[#B6F022]" />
              <span>Gratis & Langsung Aktif Dalam Hitungan Menit</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#CFE26C]">
              <Users className="w-4 h-4 text-[#B6F022]" />
              <span>Terhubung dengan 12.500+ Nasabah Aktif</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Form Registrasi (7 cols desktop) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#0B636B]/12 shadow-[0_16px_40px_-10px_rgba(11,99,107,0.1)]">
          {/* Logo di Mobile */}
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
            <Link href="/" className="text-xs font-semibold text-[#0B636B]/70">
              ← Beranda
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B] tracking-tight">
              Buat Akun Baru ✨
            </h2>
            <p className="text-sm text-[#0B636B]/75 mt-1">
              Pilih peran Anda dan isi formulir pendaftaran di bawah ini.
            </p>
          </div>

          {/* Role Tab Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#EFF0EB] rounded-2xl mb-6 border border-[#0B636B]/10">
            <button
              type="button"
              onClick={() => {
                setRoleTab("NASABAH");
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                roleTab === "NASABAH"
                  ? "bg-[#0B636B] text-white shadow-sm"
                  : "text-[#0B636B]/70 hover:text-[#0B636B]"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Nasabah (Warga)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab("ADMIN");
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                roleTab === "ADMIN"
                  ? "bg-[#0B636B] text-white shadow-sm"
                  : "text-[#0B636B]/70 hover:text-[#0B636B]"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Unit Bank Sampah</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold">Pendaftaran Gagal</p>
                <p className="mt-0.5 text-red-600/90">{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-[#CFE26C]/30 border border-[#64B60A]/40 text-[#0B636B] text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#64B60A]" />
              <span className="font-semibold">{success}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Grid 2 Kolom untuk Username & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0B636B]/50">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Min 4 karakter"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0B636B]/50">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 karakter"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#0B636B]/50 hover:text-[#0B636B]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* FORM KHUSUS NASABAH */}
            {roleTab === "NASABAH" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-1.5">
                    Nama Lengkap Nasabah
                  </label>
                  <input
                    type="text"
                    required
                    value={namaNasabah}
                    onChange={(e) => setNamaNasabah(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-1.5">
                      Nomor Telepon / WA
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0B636B]/50">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={telp}
                        onChange={(e) => setTelp(e.target.value)}
                        placeholder="Contoh: 08123456789"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-1.5">
                      Alamat Tinggal
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0B636B]/50">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        placeholder="Alamat rumah / RT RW"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Foto Profil Nasabah (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-1.5">
                    Foto Profil <span className="text-[#0B636B]/50 font-normal lowercase">(opsional)</span>
                  </label>
                  {fotoPreview ? (
                    <div className="flex items-center gap-4 p-2 rounded-2xl bg-[#EFF0EB]/80 border border-[#0B636B]/20">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <Image src={fotoPreview} alt="Preview Foto" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0B636B] truncate">{fotoFile?.name}</p>
                        <p className="text-[11px] text-[#0B636B]/60">Terpilih</p>
                      </div>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-[#0B636B]/30 bg-[#EFF0EB]/40 hover:bg-[#EFF0EB] cursor-pointer transition-colors text-xs text-[#0B636B]/70 font-semibold">
                      <UploadCloud className="w-4 h-4 text-[#64B60A]" />
                      <span>Unggah foto profil (JPG/PNG maks 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </>
            )}

            {/* FORM KHUSUS ADMIN BANK SAMPAH */}
            {roleTab === "ADMIN" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-1.5">
                    Nama Unit Bank Sampah / Sekolah
                  </label>
                  <input
                    type="text"
                    required
                    value={namaUnit}
                    onChange={(e) => setNamaUnit(e.target.value)}
                    placeholder="Contoh: Bank Sampah RW 05 Melati / SMAN 1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-1.5">
                      Nama Pengelola / Penanggung Jawab
                    </label>
                    <input
                      type="text"
                      required
                      value={namaPengelola}
                      onChange={(e) => setNamaPengelola(e.target.value)}
                      placeholder="Contoh: Ibu Rina S."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B636B] uppercase tracking-wider mb-1.5">
                      Nomor Telepon Unit
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0B636B]/50">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={telp}
                        onChange={(e) => setTelp(e.target.value)}
                        placeholder="Contoh: 08123456789"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#EFF0EB]/60 border border-[#0B636B]/20 text-[#0B636B] text-sm font-medium placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-base transition-all duration-200 shadow-[0_6px_20px_-4px_rgba(182,240,34,0.6)] hover:shadow-[0_8px_24px_-2px_rgba(182,240,34,0.8)] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none mt-4"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0B636B] border-t-transparent rounded-full animate-spin" />
                  <span>Mendaftarkan...</span>
                </div>
              ) : (
                <>
                  <span>Daftar {roleTab === "NASABAH" ? "Nasabah" : "Unit Mitra"}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

          {/* Footer Login Link */}
          <div className="mt-6 pt-5 border-t border-[#0B636B]/10 text-center">
            <p className="text-sm text-[#0B636B]/70">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-bold text-[#0B636B] hover:text-[#64B60A] underline underline-offset-4 decoration-[#B6F022] transition-colors"
              >
                Masuk di sini
              </Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
