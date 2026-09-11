import { getJenisSampahConfig } from "@/lib/constants/jenis-sampah";

interface JenisSampahBadgeProps {
  jenis: string;
  showIcon?: boolean;
  className?: string;
}

export default function JenisSampahBadge({
  jenis,
  showIcon = true,
  className = "",
}: JenisSampahBadgeProps) {
  const config = getJenisSampahConfig(jenis);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}
