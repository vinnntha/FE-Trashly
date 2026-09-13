"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export interface BreakdownData {
  plastik: { tonaseKg: number; rupiah: number; poin: number };
  kertas: { tonaseKg: number; rupiah: number; poin: number };
  logam: { tonaseKg: number; rupiah: number; poin: number };
  kaca: { tonaseKg: number; rupiah: number; poin: number };
}

interface JenisBreakdownChartProps {
  data: BreakdownData;
}

const CATEGORY_CONFIG: Record<
  string,
  { name: string; color: string; bg: string; border: string }
> = {
  plastik: {
    name: "Plastik",
    color: "#2563EB", // Blue
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  kertas: {
    name: "Kertas",
    color: "#D97706", // Amber
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  logam: {
    name: "Logam",
    color: "#475569", // Slate
    bg: "bg-slate-100",
    border: "border-slate-300",
  },
  kaca: {
    name: "Kaca",
    color: "#0D9488", // Teal
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
};

export function JenisBreakdownChart({ data }: JenisBreakdownChartProps) {
  // Map breakdown object into an array for Recharts
  const chartData = ["plastik", "kertas", "logam", "kaca"].map((key) => {
    const item = data[key as keyof BreakdownData] || {
      tonaseKg: 0,
      rupiah: 0,
      poin: 0,
    };
    const config = CATEGORY_CONFIG[key];

    return {
      key,
      name: config.name,
      tonaseKg: item.tonaseKg,
      rupiah: item.rupiah,
      poin: item.poin,
      color: config.color,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-2xl border border-[#0B636B]/15 shadow-xl text-xs space-y-1.5 z-50">
          <div className="flex items-center gap-2 font-bold text-[#0B636B] pb-1 border-b border-[#0B636B]/10">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span>{d.name}</span>
          </div>
          <div className="text-[11px] space-y-1">
            <div className="flex justify-between gap-4 text-[#0B636B]/70">
              <span>Berat Total:</span>
              <span className="font-bold text-[#0B636B]">{d.tonaseKg} kg</span>
            </div>
            <div className="flex justify-between gap-4 text-[#0B636B]/70">
              <span>Estimasi Nilai:</span>
              <span className="font-bold text-[#0B636B]">
                Rp {d.rupiah.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-[#0B636B]/70">
              <span>Poin Diterbitkan:</span>
              <span className="font-bold text-[#64B60A]">{d.poin} poin</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-56 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#0B636B", opacity: 0.6 }}
            unit=" kg"
          />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fontWeight: 600, fill: "#0B636B" }}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#EFF0EB", opacity: 0.5 }} />
          <Bar
            dataKey="tonaseKg"
            radius={[0, 12, 12, 0]}
            barSize={20}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
