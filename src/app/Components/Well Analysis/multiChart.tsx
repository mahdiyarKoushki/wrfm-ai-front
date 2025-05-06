"use client"

import { useEffect, useRef, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { CardContent,Card } from "../ui/card"
// import { Card, CardContent } from "@/components/ui/card"


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// Define the data type
interface DataPoint {
  P10: number
  P50: number
  P90: number
  G10: number
  G50: number
  G90: number
}

interface ProductionChartProps {
  data: DataPoint[],
  selectedModel:string
}

export default function ProductionAnalysisChart({ data ,selectedModel}: ProductionChartProps) {
  const chartRef = useRef<any>(null)
  const [chartData, setChartData] = useState<ChartData<"line">>({ datasets: [] })
  const [chartOptions, setChartOptions] = useState<ChartOptions<"line">>({})

  useEffect(() => {
    if (!data || data.length === 0) return

    // Create labels (indices)
    const labels = Array.from({ length: data.length }, (_, i) => i)

    setChartData({
      labels,
      datasets: [
        // Area dataset for G10-G90 range
        {
          label: "P10-P90 Range",
          data: data.map((item) => item.G10),
          borderColor: "transparent",
          backgroundColor: "rgba(200, 200, 200, 0.5)",
          pointRadius: 0,
          fill: false,
          order: 7,
        },
        // G10 line
        {
          label: "P10",
          data: data.map((item) => item.G10),
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.1,
          fill: false,
          order: 5,
        },
        // G50 line
        {
          label: "P50",
          data: data.map((item) => item.G50),
          borderColor: "rgba(0, 128, 0, 1)",
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.1,
          fill: false,
          order: 4,
        },
        // G90 line
        {
          label: "P90",
          data: data.map((item) => item.G90),
          borderColor: "rgba(0, 0, 255, 1)",
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.1,
          fill: "-3", // This fills between G90 and G10 lines
          backgroundColor: "rgba(200, 200, 200, 0.5)",
          order: 3,
        },
        // P10 line
        {
          label: `P10 ${selectedModel} fit`,
          data: data.map((item) => item.P10),
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1,
          fill: false,
          order: 2,
        },
        // P50 line
        {
            label: `P50 ${selectedModel} fit`,
          data: data.map((item) => item.P50),
          borderColor: "rgba(0, 128, 0, 1)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1,
          fill: false,
          order: 1,
        },
        // P90 line
        {
            label: `P90 ${selectedModel} fit`,
          data: data.map((item) => item.P90),
          borderColor: "rgba(0, 0, 255, 1)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1,
          fill: false,
          order: 0,
        },
      ],
    })

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Index",
          },
          grid: {
            display: true,
            color: "rgba(200, 200, 200, 0.3)",
          },
        },
        y: {
          min: 2000,
          max: 7000,
          title: {
            display: true,
            text: "Value",
          },
          ticks: {
            callback: (value) => `${(Number(value)).toFixed(0)}`,
          },
          grid: {
            display: true,
            color: "rgba(200, 200, 200, 0.3)",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom" as const,
          align: "end" as const,
          labels: {
            usePointStyle: false,
            boxWidth: 16,
            boxHeight: 16,
            padding: 15,
            font: {
              size: 10,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#000",
          bodyColor: "#000",
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || ""
              const value = context.parsed.y
              return `${label}: ${value.toFixed(2)}`
            },
            title: (tooltipItems) => `Index: ${tooltipItems[0].label}`,
          },
        },
     
      },
    })
  }, [data])

  return (
    <Card className="w-full border-0 shadow-amber-50 ">
      <CardContent className="pt-6 border-0">
        <div className="h-[400px] ">
          <Line style={{border:"none"}} ref={chartRef} options={chartOptions} data={chartData} />
        </div>
      </CardContent>
    </Card>
  )
}
