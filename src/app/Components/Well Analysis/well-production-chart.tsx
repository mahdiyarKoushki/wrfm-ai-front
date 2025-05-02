"use client"

import { useRef, useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from "recharts"

interface WellProductionChartProps {
  data: any[]
  title?:string
}

export default function WellProductionChart({ data ,title}: WellProductionChartProps) {
  const [chartWidth, setChartWidth] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.offsetWidth)
    }
  }, [])

  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(1)} × 10³`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md text-xs">
          <p className="font-medium text-gray-700 mb-2 border-b pb-1">{`Production Day: ${label}`}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
              // Skip the range entry which is used for the area
              if (entry.dataKey === "range") return null

              // Format the display name based on the data key
              const displayName = entry.name

              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3"
                      style={{
                        backgroundColor: entry.color,
                        borderRadius: entry.strokeDasharray ? "0" : "50%",
                      }}
                    />
                    <p className="font-medium">{displayName}:</p>
                  </div>
                  <p className="font-mono font-bold">{`${entry.value.toFixed(0)} bbl/day`}</p>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }

  // Custom legend that matches the screenshot
  const CustomLegend = (props: any) => {
    const { payload } = props

    // Group items for better organization
    const legendItems = [
      { id: "range", name: "P10 - P90 Range", type: "rect", color: "#f0f0f0" },
      { id: "p10Fit", name: "P10 - Exponential Fit", type: "line", color: "#0088ff", dashed: true },
      { id: "p50", name: "P50 (Median)", type: "line", color: "#0000ff" },
      { id: "p50Fit", name: "P50 - Exponential Fit", type: "line", color: "#ff8800", dashed: true },
      { id: "p10", name: "P10 (Low Case)", type: "line", color: "#ff0000", dashed: true },
      { id: "p90Fit", name: "P90 - Exponential Fit", type: "line", color: "#00cc00", dashed: true },
      { id: "p90", name: "P90 (High Case)", type: "line", color: "#00aa00", dashed: true },
    ]

    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-2">
        {legendItems.map((item) => (
          <div key={item.id} className="flex items-center gap-1">
            {item.type === "rect" ? (
              <div className="w-4 h-4 bg-gray-300 border border-gray-400" />
            ) : (
              <div className="relative w-8 h-4 flex items-center">
                <div
                  className={`absolute w-full h-0.5 ${item.dashed ? "border-t border-dashed" : ""}`}
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
      <p className="text-xs text-center mb-1">{title}</p>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            label={{
              value: "Production Days",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            label={{
              value: "Production Rate (bbl/day)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
            domain={[2500, 6500]}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* P10-P90 Range Area */}
          <defs>
            <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f0f0f0" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f0f0f0" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="range"
            stroke="none"
            fill="url(#rangeGradient)"
            fillOpacity={0.5}
            activeDot={false}
            isAnimationActive={false}
          />

          {/* Lines */}
          <Line
            type="monotone"
            dataKey="p10"
            stroke="#ff0000"
            strokeDasharray="3 3"
            dot={false}
            name="P10 (Low Case)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="p50"
            stroke="#0000ff"
            dot={false}
            name="P50 (Median)"
            strokeWidth={1.5}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="p90"
            stroke="#00aa00"
            strokeDasharray="3 3"
            dot={false}
            name="P90 (High Case)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="p10Fit"
            stroke="#0088ff"
            strokeDasharray="2 2"
            dot={false}
            name="P10 - Exponential Fit"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="p50Fit"
            stroke="#ff8800"
            strokeDasharray="2 2"
            dot={false}
            name="P50 - Exponential Fit"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="p90Fit"
            stroke="#00cc00"
            strokeDasharray="2 2"
            dot={false}
            name="P90 - Exponential Fit"
            isAnimationActive={false}
          />

          <Legend content={<CustomLegend />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
