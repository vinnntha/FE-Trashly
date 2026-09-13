"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  colorScheme?: "teal" | "moss" | "sprout" | "lime";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorScheme = "teal",
}: StatCardProps) {
  const schemeStyles = {
    teal: {
      bgIcon: "bg-[#0B636B]/10 text-[#0B636B]",
      border: "border-[#0B636B]/12",
      badge: "bg-[#0B636B]/10 text-[#0B636B]",
    },
    moss: {
      bgIcon: "bg-[#64B60A]/15 text-[#64B60A]",
      border: "border-[#64B60A]/20",
      badge: "bg-[#64B60A]/15 text-[#64B60A]",
    },
    sprout: {
      bgIcon: "bg-[#CFE26C]/30 text-[#0B636B]",
      border: "border-[#CFE26C]/40",
      badge: "bg-[#CFE26C]/30 text-[#0B636B]",
    },
    lime: {
      bgIcon: "bg-[#B6F022]/30 text-[#0B636B]",
      border: "border-[#B6F022]/40",
      badge: "bg-[#B6F022]/30 text-[#0B636B]",
    },
  };

  const current = schemeStyles[colorScheme];

  return (
    <div
      className={`bg-white rounded-3xl border ${current.border} p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-[#0B636B]/70 tracking-wide">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${current.bgIcon}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0B636B]">
          {value}
        </h3>
        {(description || trend) && (
          <div className="flex items-center gap-2 pt-1">
            {trend && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${current.badge}`}
              >
                {trend}
              </span>
            )}
            {description && (
              <p className="text-[11px] text-[#0B636B]/60 leading-tight">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
