"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthPickerProps {
  value: string; // Format: "YYYY-MM"
  onChange: (value: string) => void;
  className?: string;
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function MonthPicker({ value, onChange, className = "" }: MonthPickerProps) {
  // Parse current year and month
  const [yearStr, monthStr] = value ? value.split("-") : [];
  const currentYear = parseInt(yearStr || new Date().getFullYear().toString(), 10);
  const currentMonth = parseInt(monthStr || (new Date().getMonth() + 1).toString(), 10);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      const newYear = currentYear - 1;
      onChange(`${newYear}-12`);
    } else {
      const newMonth = String(currentMonth - 1).padStart(2, "0");
      onChange(`${currentYear}-${newMonth}`);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      const newYear = currentYear + 1;
      onChange(`${newYear}-01`);
    } else {
      const newMonth = String(currentMonth + 1).padStart(2, "0");
      onChange(`${currentYear}-${newMonth}`);
    }
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(e.target.value);
    }
  };

  const displayMonthName = MONTH_NAMES[currentMonth - 1] || "Bulan";

  return (
    <div
      className={`inline-flex items-center bg-white rounded-full border border-[#0B636B]/15 shadow-sm p-1 text-xs text-[#0B636B] ${className}`}
    >
      <button
        type="button"
        onClick={handlePrevMonth}
        className="p-1.5 rounded-full hover:bg-[#EFF0EB] text-[#0B636B]/70 hover:text-[#0B636B] transition-colors"
        title="Bulan Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="relative flex items-center gap-1.5 px-3 font-semibold select-none cursor-pointer">
        <Calendar className="w-3.5 h-3.5 text-[#64B60A]" />
        <span>
          {displayMonthName} {currentYear}
        </span>

        {/* Hidden native month input overlay for direct date picker selection */}
        <input
          type="month"
          value={value}
          onChange={handleNativeChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title="Klik untuk memilih bulan"
        />
      </div>

      <button
        type="button"
        onClick={handleNextMonth}
        className="p-1.5 rounded-full hover:bg-[#EFF0EB] text-[#0B636B]/70 hover:text-[#0B636B] transition-colors"
        title="Bulan Selanjutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
