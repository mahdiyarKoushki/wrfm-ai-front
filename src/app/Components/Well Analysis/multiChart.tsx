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
  Filler
)

// Define data types
interface DataPoint {
  P10: number
  P50: number
  P90: number
  G10: number
  G50: number
  G90: number
}

interface ProductionChartProps {
  data: DataPoint[]
  selectedModel: string
}

export default function ProductionAnalysisChart({ data, selectedModel }: ProductionChartProps) {
  const chartRef = useRef<any>(null)
  const [chartData, setChartData] = useState<ChartData<"line">>({ datasets: [], labels: [] })
  const [chartOptions, setChartOptions] = useState<ChartOptions<"line">>({})

  useEffect(() => {
    if (!data || data.length === 0) return

    const labels = Array.from({ length: data.length }, (_, i) => i)

    setChartData({
      labels,
      datasets: [
        {
          label: "P10-P90 Range",
          data: data.map((item) => item.G10),
          borderColor: "transparent",
          backgroundColor: "rgba(200, 200, 200, 0.5)",
          pointRadius: 0,
          fill: false,
          order: 7,
        },
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
        {
          label: "P90",
          data: data.map((item) => item.G90),
          borderColor: "rgba(0, 0, 255, 1)",
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.1,
          fill: "-3",
          backgroundColor: "rgba(200, 200, 200, 0.5)",
          order: 3,
        },
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
            color: "#ffffff", // Color labels white
         
            text: "Index",
            font: {
              weight: "bold", // Bold axis title
            },
          },
          grid: {
            display: true,
            color: "rgba(200, 200, 200, 0.1)",
          },
          ticks: {
            color: "#ffffff", // Color labels white
            font: {
              weight: "bold", // Bold axis labels
            },
          },
        },
        y: {
         
          title: {
            display: true,
            text: "Value",
            color: "#ffffff", // Color labels white
          
            font: {
              weight: "bold", // Bold axis title
            },
          },
          ticks: {
            callback: (value) => `${Number(value).toFixed(0)}`,

            color: "#ffffff", // Color labels white
            font: {
              weight: "bold", // Bold axis labels
            },
          },
          grid: {
            display: true,
            color: "rgba(200, 200, 200, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          align: "end",
          labels: {
            usePointStyle: false,
            boxWidth: 16,
            boxHeight: 16,
            padding: 15,
            font: { size: 10 },
          },
        },
        tooltip: {
          backgroundColor: "rgba(30, 30, 30, 0.9)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ${value.toFixed(2)}`;
            },
            title: (tooltipItems) => `Index: ${tooltipItems[0].label}`,
          },
        },
      },
    });
  }, [data, selectedModel])

  return (
    <div className="h-[400px]">
      <Line ref={chartRef} options={chartOptions} data={chartData} />
    </div>
  )
}