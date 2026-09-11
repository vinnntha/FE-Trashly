import { LucideIcon, Layers, FileText, Wrench, Wine } from "lucide-react";

export type JenisSampahType = "PLASTIK" | "KERTAS" | "LOGAM" | "KACA";

export interface JenisSampahConfig {
  key: JenisSampahType;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBorder: string;
  icon: LucideIcon;
  description: string;
}

export const JENIS_SAMPAH_CONFIG: Record<JenisSampahType, JenisSampahConfig> = {
  PLASTIK: {
    key: "PLASTIK",
    label: "Plastik",
    badgeBg: "bg-teal-50",
    badgeText: "text-[#0B636B]",
    badgeBorder: "border-[#0B636B]/20",
    cardBorder: "border-teal-100 hover:border-[#0B636B]/40",
    icon: Layers,
    description: "Botol PET, wadah HDPE, kemasan plastik bersih",
  },
  KERTAS: {
    key: "KERTAS",
    label: "Kertas",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    cardBorder: "border-amber-100 hover:border-amber-300",
    icon: FileText,
    description: "Kardus, kertas HVS, koran, majalah kering",
  },
  LOGAM: {
    key: "LOGAM",
    label: "Logam",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    badgeBorder: "border-slate-300",
    cardBorder: "border-slate-200 hover:border-slate-400",
    icon: Wrench,
    description: "Kaleng minuman, besi, tembaga, aluminium bersih",
  },
  KACA: {
    key: "KACA",
    label: "Kaca",
    badgeBg: "bg-[#CFE26C]/30",
    badgeText: "text-[#0B636B]",
    badgeBorder: "border-[#64B60A]/30",
    cardBorder: "border-[#64B60A]/20 hover:border-[#64B60A]/50",
    icon: Wine,
    description: "Botol sirup, botol kaca kecap, toples kaca utuh",
  },
};

export function getJenisSampahConfig(jenis: string): JenisSampahConfig {
  const normalized = (jenis || "").toUpperCase() as JenisSampahType;
  return JENIS_SAMPAH_CONFIG[normalized] || JENIS_SAMPAH_CONFIG.PLASTIK;
}
