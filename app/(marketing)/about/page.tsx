import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Recycle,
  Award,
  ShieldCheck,
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Heart,
  Globe,
  Zap,
  Building2,
  HelpCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Tentang Kami — Trashly Indonesia",
  description:
    "Pelajari lebih lanjut tentang Trashly, platform Bank Sampah Digital yang mendorong ekonomi sirkular, pemilahan sampah transparan, dan pemberdayaan masyarakat.",
};

export default function AboutPage() {
  const stats = [
    { label: "Unit Mitra Terverifikasi", value: "45+", desc: "Sekolah & Kelurahan Binaan" },
    { label: "Nasabah Aktif", value: "12.500+", desc: "Warga & Pelajar Peduli Lingkungan" },
    { label: "Sampah Terdaur Ulang", value: "50+ Ton", desc: "Telah Terhindar dari TPA" },
    { label: "Tingkat Akurasi Poin", value: "100%", desc: "Timbangan Digital Real-time" },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Transparansi Penimbangan",
      desc: "Pencatatan berat dan kategori sampah dilakukan langsung oleh petugas unit dengan timbangan digital tersertifikasi, langsung sinkron ke aplikasi nasabah.",
      color: "bg-[#CFE26C]/30 text-[#0B636B] border-[#64B60A]/20",
    },
    {
      icon: Zap,
      title: "Nilai Ekonomi Sirkular",
      desc: "Sampah anorganik yang terpilah dikonversi menjadi poin berharga yang bisa ditukar saldo e-wallet (GoPay, OVO, DANA), voucher belanja, atau alat tulis.",
      color: "bg-[#B6F022]/30 text-[#0B636B] border-[#64B60A]/20",
    },
    {
      icon: Building2,
      title: "Pemberdayaan Unit Lokal",
      desc: "Kami memperkuat operasional bank sampah unit di sekolah dan RT/RW melalui sistem manajemen digital tanpa kerumitan administrasi manual.",
      color: "bg-[#0B636B]/10 text-[#0B636B] border-[#0B636B]/15",
    },
    {
      icon: Globe,
      title: "Dampak Lingkungan Nyata",
      desc: "Setiap gram sampah yang disetor berkontribusi langsung pada penurunan emisi karbon dan pengurangan beban Tempat Pemrosesan Akhir (TPA).",
      color: "bg-[#64B60A]/20 text-[#0B636B] border-[#64B60A]/30",
    },
  ];

  const faqs = [
    {
      q: "Apa itu Trashly?",
      a: "Trashly adalah platform Bank Sampah Digital berbasis ekonomi sirkular yang memudahkan masyarakat memilah sampah, menyetorkannya ke unit terdekat, dan mendapatkan insentif poin yang bernilai ekonomi.",
    },
    {
      q: "Bagaimana alur menyetor sampah di Trashly?",
      a: "Cukup pilah sampah rumah tangga (plastik, kertas, logam, atau kaca), ajukan setoran via aplikasi atau langsung bawa ke Unit Mitra Trashly terdekat. Petugas akan menimbang dan poin otomatis masuk ke akun Anda.",
    },
    {
      q: "Siapa saja yang bisa bergabung menjadi Nasabah?",
      a: "Seluruh lapisan masyarakat! Baik perorangan, keluarga, siswa sekolah, hingga komunitas dapat mendaftar gratis sebagai nasabah Trashly.",
    },
    {
      q: "Bagaimana cara sekolah atau instansi bergabung jadi Unit Mitra?",
      a: "Instansi atau sekolah dapat mendaftarkan lokasi bank sampahnya melalui form kemitraan di portal Trashly. Tim kami akan melakukan verifikasi dan pendampingan sistem penimbangan digital.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[#EFF0EB] text-[#0B636B]">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-[#EFF0EB] via-white/80 to-[#EFF0EB]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CFE26C]/40 border border-[#64B60A]/30 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>Tentang Trashly Indonesia</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B636B] tracking-tight leading-[1.12] max-w-4xl mx-auto mb-6">
            Mewujudkan Indonesia Bersih Melalui{" "}
            <span className="text-[#64B60A] bg-[#B6F022]/40 px-2 py-0.5 rounded-xl">
              Bank Sampah Digital
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#0B636B]/80 max-w-2xl mx-auto leading-relaxed mb-10">
            Kami percaya bahwa setiap sampah terpilah memiliki nilai. Dengan memadukan teknologi modern, transparansi data, dan kolaborasi komunitas, Trashly membangun ekosistem sirkular yang menguntungkan semua pihak.
          </p>

          {/* Stat Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto pt-6">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-[#0B636B]/10 shadow-[0_8px_24px_-6px_rgba(11,99,107,0.08)] text-left hover:-translate-y-1 transition-transform"
              >
                <p className="font-display font-extrabold text-3xl sm:text-4xl text-[#64B60A] mb-1">
                  {item.value}
                </p>
                <p className="font-bold text-sm text-[#0B636B]">{item.label}</p>
                <p className="text-xs text-[#0B636B]/60 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Visual Showcase Section */}
      <section className="py-16 md:py-24 bg-white/50 border-y border-[#0B636B]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Box (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#0B636B]/15 shadow-2xl group">
                <Image
                  src="/images/about-community.jpg"
                  alt="Aktivitas komunitas memilah sampah di bank sampah mitra Trashly"
                  width={600}
                  height={500}
                  className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B636B]/85 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F022] text-[#0B636B] text-xs font-bold mb-2">
                    <Heart className="w-3.5 h-3.5 fill-current text-[#0B636B]" />
                    Inisiatif Berkelanjutan
                  </div>
                  <p className="text-sm font-semibold leading-snug text-[#EFF0EB]">
                    Aksi gotong royong warga memilah sampah demi lingkungan yang asri dan bernilai tambah.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Text (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-[#CFE26C] text-[#0B636B] text-xs font-bold uppercase tracking-wider">
                Cerita Kami
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B] leading-tight">
                Mengubah Tantangan Sampah Menjadi Peluang Ekonomi Baru
              </h2>
              <p className="text-base text-[#0B636B]/80 leading-relaxed">
                Pengelolaan sampah seringkali menjadi beban karena kurangnya sistem pencatatan yang jelas dan manfaat langsung yang dirasakan oleh warga. Trashly hadir untuk menjembatani celah tersebut.
              </p>
              <p className="text-base text-[#0B636B]/80 leading-relaxed">
                Melalui platform digital kami, nasabah dapat melihat bobot timbangan secara transparan, melacak akumulasi poin reward, serta langsung menukarkannya dengan berbagai kebutuhan harian. Di saat yang sama, pengurus bank sampah unit dibekali tools manajemen terpadu yang mempermudah laporan operasional.
              </p>

              {/* List Highlight */}
              <div className="pt-2 space-y-3">
                {[
                  "Pencatatan setoran digital tanpa nota kertas manual",
                  "Integrasi harga per-kilogram yang adil dan terus terbarui",
                  "Mendukung target pengurangan sampah nasional secara terukur",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#64B60A] flex items-center justify-center text-white shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-[#0B636B]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B] tracking-tight">
              Visi & Misi Utama Kami
            </h2>
            <p className="text-sm sm:text-base text-[#0B636B]/75 mt-3">
              Komitmen Trashly dalam membangun budaya pilah sampah yang adil, transparan, dan berdampak jangka panjang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Visi (Dark Teal) */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0B636B] text-[#EFF0EB] shadow-[0_20px_40px_-10px_rgba(11,99,107,0.4)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Recycle className="w-40 h-40 text-white" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#B6F022] text-[#0B636B] flex items-center justify-center mb-6 font-bold">
                  VISI
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl leading-snug mb-4 text-white">
                  Menjadi Penggerak Utama Ekonomi Sirkular Berbasis Digital di Indonesia.
                </h3>
                <p className="text-sm sm:text-base text-[#EFF0EB]/85 leading-relaxed">
                  Menciptakan ekosistem terpadu di mana setiap rumah tangga dan instansi dapat berpartisipasi aktif menjaga kelestarian lingkungan dengan insentif ekonomi yang transparan dan bermanfaat.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-2 text-xs font-semibold text-[#CFE26C]">
                <Sparkles className="w-4 h-4 text-[#B6F022]" />
                <span>Masa Depan Bebas Sampah TPA</span>
              </div>
            </div>

            {/* Card Misi (Moss Green) */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#64B60A] text-[#EFF0EB] shadow-[0_20px_40px_-10px_rgba(100,182,10,0.4)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award className="w-40 h-40 text-white" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#0B636B] flex items-center justify-center mb-6 font-bold">
                  MISI
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl leading-snug mb-4 text-white">
                  Empat Misi Strategis Trashly
                </h3>
                <ul className="space-y-3 text-sm text-[#EFF0EB]/90">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B6F022] mt-1.5 shrink-0" />
                    <span>Mengembangkan sistem penimbangan digital yang akurat dan terintegrasi real-time.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B6F022] mt-1.5 shrink-0" />
                    <span>Memperluas jaringan Unit Bank Sampah di sekolah, kelurahan, dan perkantoran.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B6F022] mt-1.5 shrink-0" />
                    <span>Memberikan reward menarik yang dapat ditukarkan secara fleksibel oleh nasabah.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#B6F022] mt-1.5 shrink-0" />
                    <span>Mengedukasi pentingnya pemilahan sampah organik & anorganik sejak dini.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20 flex items-center gap-2 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-[#B6F022]" />
                <span>Terus Berinovasi Demi Komunitas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-16 md:py-24 bg-white/60 border-t border-[#0B636B]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-[#CFE26C] text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-3">
              Pilar Keunggulan
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B]">
              Mengapa Memilih Platform Trashly?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-[#EFF0EB]/90 border border-[#0B636B]/10 hover:border-[#64B60A]/40 hover:-translate-y-1 transition-all duration-300 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color} mb-6`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#0B636B] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0B636B]/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-4 h-4 text-[#64B60A]" />
              <span>Pertanyaan Umum</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B]">
              Hal yang Sering Ditanyakan
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#0B636B]/10 shadow-sm hover:border-[#64B60A]/40 transition-colors"
              >
                <h3 className="font-display font-bold text-lg text-[#0B636B] mb-2 flex items-start gap-3">
                  <span className="text-[#64B60A] font-extrabold">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-[#0B636B]/80 pl-7 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="py-16 md:py-20 bg-[#0B636B] text-[#EFF0EB] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-6">
            Siap Menjadi Bagian dari Gerakan Hijau Trashly?
          </h2>
          <p className="text-base sm:text-lg text-[#EFF0EB]/80 max-w-2xl mx-auto leading-relaxed mb-10">
            Daftarkan diri Anda sebagai nasabah atau daftarkan lokasi bank sampah Anda sebagai Unit Mitra resmi kami hari ini.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#B6F022] hover:bg-[#a9e419] text-[#0B636B] font-bold text-base transition-all shadow-lg active:scale-95"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/30 hover:border-white text-white font-semibold text-sm transition-all hover:bg-white/10"
            >
              <span>Masuk Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
