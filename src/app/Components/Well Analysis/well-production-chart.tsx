"use client"

import { useRef, useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface WellProductionChartProps {
  data: Array<{
    day: number
    Oil: number
    P10: number
    P50: number
    P90: number
  }>
  title?: string
}

export default function WellProductionChart({
  data,
  title,
}: WellProductionChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(0)

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.offsetWidth)
    }
  }, [])

  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(1)} × 10³`
    // return `${value}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!(active && payload && payload.length)) return null
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md text-xs">
        <p className="font-medium text-gray-700 mb-2 border-b pb-1">
          {`Production Day: ${label}`}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey === "range") return null
            return (
              <div
                key={`item-${index}`}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3"
                    style={{
                      backgroundColor: entry.color,
                      borderRadius: entry.strokeDasharray ? 0 : "50%",
                    }}
                  />
                  <p className="font-medium">{entry.name}:</p>
                </div>
                <p className="font-mono font-bold">{entry.value}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const CustomLegend = (props: any) => {
    const legendItems = [
      { id: "range", name: "P10 - P90 Range", type: "rect", color: "#f0f0f0" },
      {
        id: "P10",
        name: "P10 – Exponential Fit",
        type: "line",
        color: "#0088ff",
        dashed: true,
      },
      { id: "P50", name: "P50 (Median)", type: "line", color: "#0000ff" },
      {
        id: "P90",
        name: "P90 – Exponential Fit",
        type: "line",
        color: "#ff8800",
        dashed: true,
      },
    ]
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-2">
        {legendItems.map((item) => (
          <div key={item.id} className="flex items-center gap-1">
            {item.type === "rect" ? (
              <div
                className="w-4 h-4 bg-gray-300 border border-gray-400"
                style={{ backgroundColor: item.color }}
              />
            ) : (
              <div className="relative w-8 h-4 flex items-center">
                <div
                  className={`absolute w-full h-0.5 ${
                    item.dashed ? "border-t border-dashed" : ""
                  }`}
                  style={{
                    backgroundColor: item.dashed ? "transparent" : item.color,
                    borderColor: item.dashed ? item.color : "transparent",
                  }}
                />
              </div>
            )}
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
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="index"
            label={{
              value: "Production Days",
              position: "insideBottom",
              offset: -5,
            }}
          />

          <YAxis
  
            // domain={[
            //   (dataMin: number) => dataMin * 1.1,
            //   (dataMax: number) => dataMax * 1.1,
            // ]}
            domain={["dataMin", "dataMax"]}


            tickFormatter={formatYAxis}
            label={{
              value: "Production Rate (bbl/day)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* P10-P90 Range Area */}
          <defs>
            <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f0f0f0" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f0f0f0" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          {/* اگر خواستید محدوده ناحیه‌ای هم رسم بشه: */}
          {/* <Area
            type="monotone"
            dataKey="range"
            stroke="none"
            fill="url(#rangeGradient)"
          /> */}

          <Line
            type="monotone"
            dataKey="Oil"
            stroke="green"
            strokeDasharray="3 3"
            dot={false}
            name="Oil"
          />
          <Line
            type="monotone"
            dataKey="P10"
            stroke="red"
            dot={false}
            name="P10"
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey="P50"
            stroke="blue"
            dot={false}
            name="P50 (Median)"
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey="P90"
            stroke="#9200cc"
            // strokeDasharray="3 3"
            dot={false}
            name="P90 (High Case)"
          />

          {/* <Legend content={<CustomLegend />} /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}