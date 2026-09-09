import Link from "next/link";
import { Recycle, Heart, MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0B636B] text-[#EFF0EB] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            {/* Logo Trashly */}
            <Link href="/" className="flex items-center group py-1">
              <Image
                src="/images/Logo Trashly white.png"
                alt="Trashly Logo"
                width={136}
                height={42}
                priority
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-sm text-[#EFF0EB]/75 leading-relaxed max-w-sm">
              Solusi bank sampah digital yang mendorong budaya pilah sampah berbasis ekonomi
              sirkular. Mengubah sampah jadi poin, memberdayakan masyarakat, dan menjaga bumi tetap lestari.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#CFE26C] pt-2">
              <Heart className="w-3.5 h-3.5 fill-current text-[#B6F022]" />
              <span>Inisiatif Daur Ulang Mandiri untuk Lingkungan Bersih</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-[#EFF0EB]/70">
              <li>
                <a href="#fitur" className="hover:text-[#B6F022] transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-[#B6F022] transition-colors">
                  Cara Kerja & 3 Langkah
                </a>
              </li>
              <li>
                <a href="#kategori" className="hover:text-[#B6F022] transition-colors">
                  Kategori Sampah
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#B6F022] transition-colors">
                  Portal Nasabah & Mitra
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Unit Mitra Info (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display font-semibold text-sm text-white uppercase tracking-wider">
              Pusat Informasi
            </h4>
            <ul className="space-y-2.5 text-sm text-[#EFF0EB]/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#CFE26C] shrink-0 mt-0.5" />
                <span>Tersebar di 45+ Unit Mitra Sekolah & Kelurahan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#CFE26C] shrink-0" />
                <span>halo@trashly.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#CFE26C] shrink-0" />
                <span>+62 812-3456-7890 (Layanan Warga)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EFF0EB]/60">
          <p>© {new Date().getFullYear()} Trashly Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Panduan Pemilahan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
