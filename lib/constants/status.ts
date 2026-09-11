export interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  dotColor: string;
}

export const STATUS_SETOR_CONFIG: Record<string, StatusConfig> = {
  menunggu_konfirmasi: {
    label: "Menunggu Konfirmasi",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
  },
  diverifikasi: {
    label: "Diverifikasi",
    bg: "bg-sky-50",
    text: "text-sky-800",
    border: "border-sky-200",
    dotColor: "bg-sky-500",
  },
  selesai: {
    label: "Selesai",
    bg: "bg-[#CFE26C]/30",
    text: "text-[#0B636B]",
    border: "border-[#64B60A]/30",
    dotColor: "bg-[#64B60A]",
  },
  ditolak: {
    label: "Ditolak",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dotColor: "bg-red-500",
  },
};

export const STATUS_PENUKARAN_CONFIG: Record<string, StatusConfig> = {
  diproses: {
    label: "Sedang Diproses",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
  },
  selesai: {
    label: "Selesai / Diambil",
    bg: "bg-[#CFE26C]/30",
    text: "text-[#0B636B]",
    border: "border-[#64B60A]/30",
    dotColor: "bg-[#64B60A]",
  },
};

export function getStatusSetorConfig(status: string): StatusConfig {
  const key = (status || "").toLowerCase();
  return (
    STATUS_SETOR_CONFIG[key] || {
      label: status || "Tidak Diketahui",
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
      dotColor: "bg-gray-400",
    }
  );
}

export function getStatusPenukaranConfig(status: string): StatusConfig {
  const key = (status || "").toLowerCase();
  return (
    STATUS_PENUKARAN_CONFIG[key] || {
      label: status || "Tidak Diketahui",
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
      dotColor: "bg-gray-400",
    }
  );
}
