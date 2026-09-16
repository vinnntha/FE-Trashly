"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Layers,
  Wine,
  Fuel,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";

interface CategoryDetail {
  id: string;
  name: string;
  sub: string;
  rate: string;
  points: number;
  rupiah: string;
  icon: typeof Box;
  accepted: string[];
  rejected: string[];
  tips: string;
}

const DEFAULT_CATEGORIES: CategoryDetail[] = [
  {
    id: "plastik",
    name: "Plastik PET & HDPE",
    sub: "Botol air mineral, galon mini, jerigen bersih",
    rate: "40 Poin / kg",
    points: 40,
    rupiah: "Rp 4.000 / kg",
    icon: Box,
    accepted: [
      "Botol plastik bening/biru muda (kode 1)",
      "Botol shampo & detergen HDPE (kode 2)",
      "Gelas plastik minuman kemasan",
    ],
    rejected: [
      "Plastik kresek kotor / sisa makanan",
      "Kemasan sachet multilayer / aluminium foil",
      "Styrofoam dan sedotan",
    ],
    tips: "Remas botol hingga pipih untuk menghemat ruang tampung tas setoranmu.",
  },
  {
    id: "kertas",
    name: "Kertas & Kardus Bekas",
    sub: "Karton boks tebal, arsip, koran, buku lama",
    rate: "25 Poin / kg",
    points: 25,
    rupiah: "Rp 2.500 / kg",
    icon: Layers,
    accepted: [
      "Kardus cokelat boks pengiriman / e-commerce",
      "Kertas HVS bekas & dokumen arsip",
      "Koran dan majalah bekas",
    ],
    rejected: [
      "Kertas struk belanja (thermal)",
      "Kardus berminyak sisa pizza/makanan",
      "Kertas berlaminasi plastik tebal",
    ],
    tips: "Lipat kardus hingga rata dan ikat menggunakan tali rapia agar mudah ditimbang.",
  },
  {
    id: "logam",
    name: "Logam & Aluminium",
    sub: "Kaleng minuman, seng, wajan bekas, tembaga",
    rate: "100 Poin / kg",
    points: 100,
    rupiah: "Rp 10.000 / kg",
    icon: Wine,
    accepted: [
      "Kaleng aluminium minuman ringan",
      "Kaleng susu & biskuit (baja lunak)",
      "Peralatan dapur aluminium yang sudah rusak",
    ],
    rejected: [
      "Kaleng cat atau aerosol bertekanan tinggi",
      "Baterai bekas & limbah B3 (ada jalur khusus)",
      "Logam berkarat lapuk parah",
    ],
    tips: "Bilas kaleng minuman dari sisa cairan manis agar tidak mengundang semut.",
  },
  {
    id: "kaca",
    name: "Kaca & Botol Beling",
    sub: "Botol sirup, kecap, toples utuh",
    rate: "15 Poin / kg",
    points: 15,
    rupiah: "Rp 1.500 / kg",
    icon: Wine,
    accepted: [
      "Botol sirup, kecap, dan saus utuh",
      "Toples kaca selai/kopi bersih",
      "Pecahan kaca tebal yang terbungkus kardus rapi",
    ],
    rejected: [
      "Lampu neon / bohlam bekas (limbah B3)",
      "Kaca cermin berlapis perak",
      "Keramik lantai atau porselen pecah",
    ],
    tips: "Pastikan botol kaca tidak retak berbahaya saat dibawa ke unit bank sampah.",
  },
];

export default function TrustRow() {
  const [categories, setCategories] = useState<CategoryDetail[]>(DEFAULT_CATEGORIES);
  const [activeId, setActiveId] = useState(DEFAULT_CATEGORIES[0].id);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/kategori-sampah")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil kategori");
        return res.json();
      })
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: CategoryDetail[] = res.data.slice(0, 4).map((item: any) => {
            const poin = Number(item.poinPerKg || 10);
            const harga = Number(item.hargaPerKg || poin * 100);
            let iconComponent = Box;
            let subtext = "Kategori sampah terpilah resmi";
            let acceptedList = [
              "Sampah terpilah dari sumbernya",
              "Kondisi bersih dan dikeringkan",
              "Sesuai standar penimbangan unit",
            ];
            let rejectedList = [
              "Tercampur limbah organik basah",
              "Tercampur bahan kimia berbahaya",
            ];
            let tipsText = "Kemas rapi sebelum disetor ke petugas bank sampah.";

            if (item.jenis === "KERTAS") {
              iconComponent = Layers;
              subtext = "Karton boks tebal, arsip, koran, buku lama";
              acceptedList = [
                "Kardus cokelat boks pengiriman",
                "Kertas HVS bekas & arsip",
                "Koran & majalah bekas",
              ];
              rejectedList = [
                "Kertas thermal struk ATM",
                "Kardus basah berminyak makanan",
              ];
              tipsText = "Lipat kardus hingga rata dan ikat dengan tali rapia.";
            } else if (item.jenis === "LOGAM") {
              iconComponent = Wine;
              subtext = "Kaleng minuman, seng, aluminium, besi";
              acceptedList = [
                "Kaleng aluminium minuman",
                "Kaleng susu & biskuit",
                "Peralatan dapur aluminium rusak",
              ];
              rejectedList = [
                "Kaleng cat / pestisida beracun",
                "Baterai bekas (Limbah B3)",
              ];
              tipsText = "Bilas kaleng dari sisa cairan manis.";
            } else if (item.jenis === "KACA") {
              iconComponent = Wine;
              subtext = "Botol kaca, sirup, toples beling utuh";
              acceptedList = [
                "Botol sirup & kecap utuh",
                "Toples kaca selai bersih",
              ];
              rejectedList = [
                "Bohlam lampu neon (Limbah B3)",
                "Pecahan cermin",
              ];
              tipsText = "Bawa dengan wadah aman agar tidak pecah di jalan.";
            } else {
              iconComponent = Box;
              subtext = "Botol air mineral, jerigen, wadah plastik bersih";
              acceptedList = [
                "Botol plastik PET bening (kode 1)",
                "Botol HDPE shampo/detergen (kode 2)",
                "Gelas plastik air mineral",
              ];
              rejectedList = [
                "Plastik kresek kotor sisa makanan",
                "Styrofoam dan sachet multilayer",
              ];
              tipsText = "Remas botol hingga pipih untuk menghemat tempat.";
            }

            return {
              id: item.id,
              name: item.namaKategori,
              sub: subtext,
              rate: `${poin} Poin / kg`,
              points: poin,
              rupiah: `Rp ${harga.toLocaleString("id-ID")} / kg`,
              icon: iconComponent,
              accepted: acceptedList,
              rejected: rejectedList,
              tips: tipsText,
            };
          });

          setCategories(mapped);
          setActiveId(mapped[0].id);
        }
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  const activeCategory =
    categories.find((c) => c.id === activeId) || categories[0];

  return (
    <section id="kategori" className="py-14 sm:py-18 bg-white/50 border-y border-[#0B636B]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CFE26C]/40 text-[#0B636B] text-xs font-bold mb-3 border border-[#64B60A]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#64B60A]" />
              <span>Standar Penerimaan Bank Sampah</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B636B] tracking-tight">
              Kategori Sampah Terpilah & Ketentuan Penimbangan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 max-w-md">
            Klik tiap kategori untuk melihat syarat penerimaan, hal yang dilarang,
            dan tips pemilahan agar poin setoranmu maksimal.
          </p>
        </div>

        {/* Interactive Category Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`text-left p-5 rounded-2xl transition-all duration-200 border cursor-pointer relative overflow-hidden ${
                  isActive
                    ? "bg-[#0B636B] text-[#EFF0EB] border-[#0B636B] shadow-[0_8px_24px_-6px_rgba(11,99,107,0.35)] translate-y-[-2px]"
                    : "bg-[#EFF0EB]/70 hover:bg-[#EFF0EB] text-[#0B636B] border-[#0B636B]/15 hover:border-[#64B60A]/40"
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#B6F022]" />
                )}

                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#B6F022] text-[#0B636B]"
                        : "bg-white text-[#0B636B] shadow-xs"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/15 text-[#B6F022]"
                        : "bg-[#CFE26C]/40 text-[#0B636B]"
                    }`}
                  >
                    {item.rate}
                  </span>
                </div>

                <h3
                  className={`font-display font-bold text-base ${
                    isActive ? "text-white" : "text-[#0B636B]"
                  }`}
                >
                  {item.name}
                </h3>
                <p
                  className={`text-xs mt-1 line-clamp-2 ${
                    isActive ? "text-[#EFF0EB]/80" : "text-[#0B636B]/70"
                  }`}
                >
                  {item.sub}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Category Details Drawer / Panel */}
        <div className="mt-6 p-6 sm:p-7 rounded-3xl bg-white border border-[#0B636B]/15 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Summary info (4 cols) */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#0B636B]/10 pb-6 md:pb-0 md:pr-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#64B60A] mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Panduan Detail Kategori</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#0B636B]">
                {activeCategory.name}
              </h3>
              <p className="text-xs text-[#0B636B]/70 mt-1 leading-relaxed">
                {activeCategory.sub}
              </p>

              <div className="mt-4 p-3 rounded-xl bg-[#EFF0EB] border border-[#0B636B]/10">
                <div className="text-xs text-[#0B636B]/70">Nilai Konversi:</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-display font-extrabold text-2xl text-[#0B636B]">
                    {activeCategory.rate}
                  </span>
                  <span className="text-xs font-semibold text-[#64B60A]">
                    ({activeCategory.rupiah})
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs text-[#0B636B]/80 bg-[#CFE26C]/25 p-3 rounded-xl border border-[#64B60A]/20">
                <Info className="w-4 h-4 text-[#64B60A] shrink-0 mt-0.5" />
                <span><strong>Tips Praktis:</strong> {activeCategory.tips}</span>
              </div>
            </div>

            {/* Accepted items (4 cols) */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#64B60A] uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Yang Diterima (Layak Poin)</span>
              </div>
              <ul className="space-y-2.5">
                {activeCategory.accepted.map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-[#0B636B]/85 leading-snug"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#64B60A] shrink-0 mt-1.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rejected items (4 cols) */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#b91c1c] uppercase tracking-wider mb-3">
                <XCircle className="w-4 h-4" />
                <span>Yang Tidak Diterima</span>
              </div>
              <ul className="space-y-2.5">
                {activeCategory.rejected.map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-[#0B636B]/75 leading-snug"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-[#0B636B]/10">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0B636B] hover:text-[#64B60A] transition-colors"
                >
                  <span>Setor {activeCategory.name} sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
