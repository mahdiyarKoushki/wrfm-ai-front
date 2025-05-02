"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

interface WellProductionChartProps {
  // یک آبجکت string→number می‌گیریم
  data: Record<string, number>;
}

export default function WellProductionChart({ data }: WellProductionChartProps) {
  // با useMemo آبجکت را به آرایه‌ای از { day, production } تبدیل می‌کنیم
  const chartData = useMemo(
    () =>
      Object.entries(data)
        .map(([day, prod]) => ({
          day: Number(day),
          production: prod,
        }))
        .sort((a, b) => a.day - b.day),
    [data]
  );

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" label={{ value: "Day", position: "insideBottom" }} />
          <YAxis label={{ value: "bbl/day", angle: -90, position: "insideLeft" }} />
          <Tooltip
            labelFormatter={(l) => `Day ${l}`}
            formatter={(v: number) => v.toFixed(0) + " bbl/day"}
          />
          <Line
            type="monotone"
            dataKey="production"
            name="Production"
            stroke="#007ACC"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}