import React from "react";
import Link from "next/link";
import { LucideIcon, Inbox, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-[#0B636B]/10 shadow-sm ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#EFF0EB] text-[#64B60A] flex items-center justify-center mb-4 border border-[#0B636B]/10 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="font-display font-bold text-lg text-[#0B636B] mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#0B636B]/70 max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-xs transition-all shadow-sm active:scale-95"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {actionLabel && !actionHref && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B6F022] hover:bg-[#a6df1e] text-[#0B636B] font-bold text-xs transition-all shadow-sm active:scale-95"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
