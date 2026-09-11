"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import StatusBadge from "@/components/nasabah/StatusBadge";
import SkeletonCard from "@/components/nasabah/SkeletonCard";
import EmptyState from "@/components/nasabah/EmptyState";
import {
  History,
  Gift,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface PenukaranItem {
  id: string;
  kodePenukaran: string;
  tanggal: string;
  poinTerpakai: number;
  status: string;
  hadiah: {
    id: string;
    namaHadiah: string;
    poinDibutuhkan: number;
    foto?: string | null;
  };
}

export default function HistoriPenukaranPage() {
  const {
    data: resData,
    isLoading,
    isError,
    refetch,
  } = useQuery<{ message: string; data: PenukaranItem[] }>({
    queryKey: ["penukaran-list"],
    queryFn: () => apiClient<{ message: string; data: PenukaranItem[] }>("/penukaran-poin/my-penukaran"),
  });

  const list = resData?.data || [];

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/hadiah"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B636B] hover:text-[#64B60A] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Hadiah</span>
          </Link>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B636B] tracking-tight">
            Histori Penukaran Poin
          </h1>
          <p className="text-xs sm:text-sm text-[#0B636B]/75 mt-1">
            Daftar klaim reward yang telah Anda ajukan ke bank sampah unit.
          </p>
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <SkeletonCard variant="list" count={5} />
      ) : isError ? (
        <EmptyState
          title="Gagal Memuat Histori"
          description="Terjadi kendala saat mengambil histori penukaran poin. Silakan coba lagi."
          actionLabel="Muat Ulang"
          onAction={() => refetch()}
        />
      ) : list.length === 0 ? (
        <EmptyState
          title="Belum Ada Penukaran Hadiah"
          description="Anda belum pernah menukarkan poin dengan hadiah. Tukarkan poin Anda sekarang!"
          actionLabel="Buka Katalog Hadiah"
          actionHref="/hadiah"
        />
      ) : (
        <div className="space-y-3.5">
          {list.map((item) => (
            <Link
              key={item.id}
              href={`/nota/tukar/${item.id}`}
              className="block p-4 sm:p-5 rounded-3xl bg-white border border-[#0B636B]/10 shadow-sm hover:shadow-md hover:border-[#0B636B]/30 transition-all duration-200 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Photo & Title */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-2xl bg-[#EFF0EB] overflow-hidden shrink-0 border border-[#0B636B]/10 flex items-center justify-center">
                    {item.hadiah.foto ? (
                      <Image
                        src={
                          item.hadiah.foto.startsWith("http")
                            ? item.hadiah.foto
                            : `http://localhost:5000${item.hadiah.foto}`
                        }
                        alt={item.hadiah.namaHadiah}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Gift className="w-7 h-7 text-[#0B636B]/40" />
                    )}
                  </div>

                  <div>
                    <span className="font-mono text-[11px] font-bold text-[#0B636B]/60">
                      {item.kodePenukaran}
                    </span>
                    <h3 className="font-display font-bold text-base text-[#0B636B] group-hover:text-[#64B60A] transition-colors">
                      {item.hadiah.namaHadiah}
                    </h3>
                    <p className="text-xs text-[#0B636B]/60 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.tanggal)}
                    </p>
                  </div>
                </div>

                {/* Right: Status & Points */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#0B636B]/10">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-[#0B636B]/60">
                      Poin Digunakan
                    </p>
                    <p className="font-display font-bold text-sm sm:text-base text-amber-700">
                      -{item.poinTerpakai} Poin
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} type="penukaran" />
                    <ChevronRight className="w-5 h-5 text-[#0B636B]/40 group-hover:text-[#0B636B] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
