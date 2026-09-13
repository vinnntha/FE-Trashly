"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  placeholder = "Cari data...",
  onSearch,
  className = "",
  debounceMs = 300,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-[#0B636B]/50 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9.5 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#0B636B]/15 rounded-full text-[#0B636B] placeholder-[#0B636B]/40 focus:outline-none focus:ring-2 focus:ring-[#64B60A]/30 focus:border-[#64B60A] transition-all shadow-sm"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 p-0.5 rounded-full text-[#0B636B]/40 hover:text-[#0B636B] hover:bg-[#EFF0EB] transition-colors"
          aria-label="Hapus Pencarian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
