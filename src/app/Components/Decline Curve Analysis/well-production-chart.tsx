"use client"

import { useRef, useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"

interface WellProductionChartProps {
  data: any[]
  showModelComparison?: boolean
}

export default function WellProductionChart({ data, showModelComparison = false }: WellProductionChartProps) {
  const [chartWidth, setChartWidth] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.offsetWidth)
    }
  }, [])

  // Generate sample data for model comparison if needed
  const chartData = showModelComparison ? generateModelComparisonData() : data

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
              const displayName = entry.name || entry.dataKey

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

  return (
    <div className="w-full h-full" ref={chartRef}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
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

          {!showModelComparison && (
            <>
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
            </>
          )}

          {showModelComparison && (
            <>
              <Line
                type="monotone"
                dataKey="arpsExponential"
                stroke="#0000ff"
                dot={false}
                name="Arps exponential"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="powerLaw"
                stroke="#00aa00"
                dot={false}
                name="Power Law"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="extendedExponential"
                stroke="#ff0000"
                dot={false}
                name="Extended Exponential"
                isAnimationActive={false}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Generate sample data for model comparison
function generateModelComparisonData() {
  const data = []

  // Generate data for each day
  for (let day = 0; day < 365; day++) {
    // Calculate base values for different models
    const arpsExponential = 4000 * Math.exp(-0.0005 * day) + (Math.random() - 0.5) * 200
    const powerLaw = 6000 * Math.pow(1 + 0.0001 * day, -0.5) + (Math.random() - 0.5) * 200
    const extendedExponential = 3500 * Math.exp(-0.0003 * day) + (Math.random() - 0.5) * 150

    data.push({
      day,
      arpsExponential,
      powerLaw,
      extendedExponential,
    })
  }

  return data
}
