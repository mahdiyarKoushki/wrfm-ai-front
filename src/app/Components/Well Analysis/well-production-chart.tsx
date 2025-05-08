"use client"

import { useRef } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  CartesianGrid,
} from "recharts"

interface DataPoint {
  day: number
  Oil: number
  P10: number
  P50: number
  P90: number
  G10?: number
  G90?: number
  areaArr?: [number, number]
}

interface WellProductionChartProps {
  data: DataPoint[]
  title?: string
  selectedModel: string
}

export default function WellProductionChart({
  data,
  title,
  selectedModel,
}: WellProductionChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  const formatYAxis = (value: number) => `${(value / 1000).toFixed(1)}k`

  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F1C40F",
    "#8E44AD",
    "#E74C3C",
    "#2980B9",
    "#27AE60",
    "#F39C12",
    "#95A5A6",
    "#34495E",
    "#2ECC71",
    "#3498DB",
    "#9B59B6",
    "#F0E68C",
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null
    return (
      <div className="bg-gray-900 p-3 border border-gray-700 shadow-md rounded-md text-xs text-white">
        <p className="font-medium mb-2 border-b border-gray-700 pb-1">
          Production Day: {label}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey === "areaArr") return null
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3"
                    style={{
                      backgroundColor: entry.color,
                      borderRadius: entry.strokeDasharray ? 0 : "50%",
                    }}
                  />
                  <p className="font-medium">{entry.name}</p>
                </div>
                <p className="font-mono font-bold">{entry.value}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const CustomLegend = () => {
    const legendItems = Object.keys(data[0] ?? {})
      .filter((key) => key !== "day" && key !== "areaArr")
      .map((key, index) => ({
        id: key,
        name: key,
        color: colors[index % colors.length],
        dashed: false,
      }))

    return (
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs mt-2">
        {legendItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2" style={{ marginTop: "20px" }}>
            <div className="relative w-8 h-4 flex items-center">
              <div
                className={`absolute w-full h-0.5 ${item.dashed ? "border-t border-dashed" : ""}`}
                style={{
                  backgroundColor: item.dashed ? "transparent" : item.color,
                  borderColor: item.dashed ? item.color : "transparent",
                }}
              />
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full h-full" ref={chartRef}>
      {title && <p className="text-xs text-center mb-1">{title}</p>}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 10 }}>
          <CartesianGrid stroke="#afafaf20" />
          <XAxis
            dataKey=""
            stroke="#ffff"
            strokeWidth={2}
            label={{ value: "Production Days", position: "insideBottom", offset: -5,fill: "#ffffff",fontWeight: 600, }}
            tick={{ fill: "#ffffff", fontSize: 14, fontWeight: 600, }}
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatYAxis}
            stroke="#ffff"
            strokeWidth={3}
            label={{
              value: "Production Rate (STBD)",
              angle: -90,
              fontWeight: 600,
              position: "insideLeft",
              fill: "#ffffff",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area dataKey="areaArr" stroke="#8884d8" fill="#8884d8" />
          {Object.keys(data[0] ?? {})
            .filter((key) => key !== "day" && key !== "areaArr")
            .map((item, index) => (
              <Line
                key={item}
                type="monotone"
                dataKey={item}
                stroke={colors[index % colors.length]}
                dot={false}
              />
            ))}
          <Legend content={<CustomLegend />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}