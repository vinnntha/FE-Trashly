"use client";

import React from "react";
import { AlertTriangle, AlertCircle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  error?: string | null;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Hapus Data",
  cancelLabel = "Batal",
  isLoading = false,
  error = null,
  variant = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B636B]/30 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Dialog Card */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border border-[#0B636B]/15 shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === "danger"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-[#0B636B]">
              {title}
            </h3>
            <p className="text-xs text-[#0B636B]/70 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Backend Specific Error Box (e.g. 400 Business Validation) */}
        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-full border border-[#0B636B]/20 text-xs font-semibold text-[#0B636B] hover:bg-[#EFF0EB] transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 ${
              variant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-red-600/20"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
