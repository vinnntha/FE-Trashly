import {
  getStatusSetorConfig,
  getStatusPenukaranConfig,
} from "@/lib/constants/status";

interface StatusBadgeProps {
  status: string;
  type?: "setor" | "penukaran";
  className?: string;
}

export default function StatusBadge({
  status,
  type = "setor",
  className = "",
}: StatusBadgeProps) {
  const config =
    type === "setor"
      ? getStatusSetorConfig(status)
      : getStatusPenukaranConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
}
