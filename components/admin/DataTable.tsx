"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  itemsPerPage?: number;
  searchFilter?: (item: T) => boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = "Belum ada data",
  emptyDescription = "Data tidak ditemukan atau belum pernah ditambahkan.",
  emptyAction,
  itemsPerPage = 10,
  searchFilter,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Apply optional search filter
  const filteredData = useMemo(() => {
    if (!searchFilter) return data;
    return data.filter(searchFilter);
  }, [data, searchFilter]);

  // Reset page if filtered results shrink below currentPage
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, safePage, itemsPerPage]);

  return (
    <div className="bg-white rounded-3xl border border-[#0B636B]/12 shadow-sm overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#EFF0EB]/80 border-b border-[#0B636B]/10">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 font-semibold text-xs text-[#0B636B]/70 tracking-wider uppercase ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B636B]/8 text-[#0B636B]">
            {isLoading ? (
              // Skeleton rows loading
              Array.from({ length: itemsPerPage > 5 ? 5 : itemsPerPage }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <div className="h-4 bg-[#0B636B]/10 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="py-12 px-4 text-center">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF0EB] flex items-center justify-center text-[#0B636B]/40 mb-3">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-[#0B636B] text-base mb-1">
                      {emptyTitle}
                    </h4>
                    <p className="text-xs text-[#0B636B]/60 mb-4">
                      {emptyDescription}
                    </p>
                    {emptyAction}
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              paginatedData.map((item, idx) => (
                <tr
                  key={keyExtractor(item, idx)}
                  className="hover:bg-[#EFF0EB]/40 transition-colors"
                >
                  {columns.map((col, cIdx) => {
                    const cellContent = col.cell
                      ? col.cell(item, (safePage - 1) * itemsPerPage + idx)
                      : col.accessorKey
                      ? (item[col.accessorKey] as React.ReactNode)
                      : null;

                    return (
                      <td
                        key={cIdx}
                        className={`py-3.5 px-4 align-middle ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left"
                        } ${col.className || ""}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-[#EFF0EB]/40 border-t border-[#0B636B]/10 text-xs text-[#0B636B]/70">
          <div>
            Menampilkan{" "}
            <span className="font-semibold text-[#0B636B]">
              {(safePage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-[#0B636B]">
              {Math.min(safePage * itemsPerPage, filteredData.length)}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-[#0B636B]">
              {filteredData.length}
            </span>{" "}
            data
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-xl border border-[#0B636B]/15 text-[#0B636B] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2.5 py-1 font-semibold text-[#0B636B]">
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-xl border border-[#0B636B]/15 text-[#0B636B] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
