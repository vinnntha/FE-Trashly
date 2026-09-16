"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Apakah ada biaya pendaftaran untuk menjadi nasabah Trashly?",
    answer:
      "Tidak ada biaya sama sekali (100% gratis). Siapa pun dapat mendaftar langsung secara online dalam hitungan menit dan langsung bisa menyetorkan sampah ke unit mitra terdekat.",
  },
  {
    question: "Bagaimana cara kerja penimbangan dan perhitungan poin?",
    answer:
      "Sampah yang kamu bawa ke unit bank sampah akan ditimbang langsung di depanmu menggunakan timbangan digital. Petugas menginput berat ke aplikasi, dan poin akan otomatis dikalkulasikan sesuai tarif kategori (misal: Plastik PET 100 poin/kg). Poin langsung muncul di akun seketika.",
  },
  {
    question: "Apakah sampah harus dibersihkan terlebih dahulu sebelum disetor?",
    answer:
      "Ya, demi higienitas dan menjaga kualitas daur ulang, botol plastik harus dikosongkan dari cairan dan kaleng dibilas singkat. Sampah kardus dan kertas harus dalam keadaan kering.",
  },
  {
    question: "Bagaimana cara menukarkan poin menjadi hadiah atau uang?",
    answer:
      "Di dalam menu 'Hadiah', kamu bisa memilih katalog reward yang tersedia, seperti saldo e-wallet (DANA, GoPay, OVO), paket sembako, atau voucher pulsa. Petugas unit akan memverifikasi dan menyalurkan reward sesuai pilihanmu.",
  },
  {
    question: "Bisakah sekolah atau RT/RW mendaftar sebagai unit mitra Trashly?",
    answer:
      "Bisa! Trashly membuka kemitraan bagi sekolah, lingkungan perumahan (RT/RW), maupun instansi yang ingin mengaktifkan bank sampah mandiri dengan dukungan sistem digital dan pencatatan terstandar.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-24 bg-white/60 border-t border-[#0B636B]/10">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#CFE26C]/40 border border-[#64B60A]/20 text-[#0B636B] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#64B60A]" />
            <span>Tanya Jawab</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B636B] tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs sm:text-sm text-[#0B636B]/70 mt-2 max-w-lg mx-auto">
            Pelajari lebih lanjut seputar alur penyetoran, perhitungan poin, dan penukaran hadiah di Trashly.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#EFF0EB] border-[#0B636B]/25 shadow-xs"
                    : "bg-white border-[#0B636B]/10 hover:border-[#0B636B]/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-[#0B636B]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#0B636B] text-[#B6F022] rotate-180"
                        : "bg-[#EFF0EB] text-[#0B636B]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#0B636B]/80 leading-relaxed border-t border-[#0B636B]/10 mt-1 animate-in fade-in duration-200">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
