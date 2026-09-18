interface SkeletonCardProps {
  variant?: "summary" | "stats" | "card" | "list";
  count?: number;
  className?: string;
}

export default function SkeletonCard({
  variant = "card",
  count = 1,
  className = "",
}: SkeletonCardProps) {
  const items = Array.from({ length: count });

  if (variant === "summary") {
    return (
      <div className={`w-full h-72 rounded-3xl bg-[#0B636B]/20 animate-pulse p-8 flex flex-col justify-between ${className}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20" />
            <div className="space-y-2">
              <div className="w-24 h-3 bg-white/20 rounded" />
              <div className="w-32 h-4 bg-white/20 rounded" />
            </div>
          </div>
          <div className="w-20 h-6 bg-white/20 rounded-full" />
        </div>
        <div className="space-y-3">
          <div className="w-28 h-3 bg-white/20 rounded" />
          <div className="w-48 h-12 bg-white/20 rounded" />
          <div className="w-64 h-3 bg-white/20 rounded" />
        </div>
        <div className="pt-4 border-t border-white/10 flex justify-between">
          <div className="w-32 h-4 bg-white/20 rounded" />
          <div className="w-40 h-8 bg-white/20 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white/70 border border-[#0B636B]/10 animate-pulse space-y-3"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EFF0EB]" />
            <div className="w-24 h-3 bg-[#EFF0EB] rounded" />
            <div className="w-16 h-7 bg-[#EFF0EB] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white/70 border border-[#0B636B]/10 animate-pulse flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF0EB]" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-[#EFF0EB] rounded" />
                <div className="w-24 h-3 bg-[#EFF0EB] rounded" />
              </div>
            </div>
            <div className="w-20 h-6 bg-[#EFF0EB] rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-white border border-[#0B636B]/10 p-3.5 sm:p-4 animate-pulse flex flex-col justify-between space-y-4"
        >
          <div className="w-full aspect-[4/3] rounded-2xl bg-[#EFF0EB]" />
          <div className="space-y-3 px-1 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-3/4 h-5 bg-[#EFF0EB] rounded" />
              <div className="w-1/2 h-4 bg-[#EFF0EB] rounded" />
            </div>
            <div className="pt-3 border-t border-[#0B636B]/10 flex items-center justify-between">
              <div className="w-20 h-5 bg-[#EFF0EB] rounded" />
              <div className="w-24 h-8 bg-[#EFF0EB] rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
