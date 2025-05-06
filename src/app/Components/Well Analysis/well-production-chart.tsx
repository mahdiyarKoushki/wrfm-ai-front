"use client"

import { useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";

interface WellProductionChartProps {
  data: Array<{
    day: number;
    Oil: number;
    P10: number;
    P50: number;
    P90: number;
    G10?: number;
    G90?: number;
    areaArr?: [number, number];
  }>
  title?: string;
  selectedModel: string;
}
//forecast_rate
export default function WellProductionChart({
  data,
  title,
  selectedModel,
}: WellProductionChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(1)} × 10³`;
  }

  

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!(active && payload && payload.length)) return null;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md text-xs">
        <p className="font-medium text-gray-700 mb-2 border-b pb-1">
          {`Production Day: ${label}`}
        </p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey === "range") return null;
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

  const CustomLegend = () => {
    const legendItems = [
      // {
      //   id: "P10",
      //   name: `P10 ${selectedModel} fit`,
      //   type: "line",
      //   color: "#f20509",
      //   dashed: false,
      // },
      {
        id: "P10",
        name: `P10 `,
        type: "line",
        color: "#f20509",
        dashed: false,
      },
      // {
      //   id: "P50",
      //   name: `P50 ${selectedModel} fit`,
      //   type: "line",
      //   color: "#033dfc",
      //   dashed: false,
      // },
      {
        id: "P50",
        name: `P50 `,
        type: "line",
        color: "#033dfc",
        dashed: false,
      },
      // {
      //   id: "P90",
      //   name: `P90 ${selectedModel} fit`,
      //   type: "line",
      //   color: "#05f209",
      //   dashed: false,
      // },
      {
        id: "P90",
        name: `P90 `,
        type: "line",
        color: "#05f209",
        dashed: false,
      },
    ]
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-2">
        {legendItems.map((item) => (
          <div key={item.id} className="flex items-center gap-1">
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
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    )
  }
  const colors = [
    "#FF5733", // A shade of orange
    "#33FF57", // A shade of green
    "#3357FF", // A shade of blue
    "#F1C40F", // A shade of yellow
    "#8E44AD", // A shade of purple
    "#E74C3C", // A shade of red
    "#2980B9", // A shade of blue
    "#27AE60", // A shade of green
    "#F39C12", // A shade of orange
    "#95A5A6", // A shade of gray
    "#34495E", // A shade of navy blue
    "#2ECC71", // A shade of green
    "#3498DB", // A shade of light blue
    "#9B59B6", // A shade of violet
    "#F0E68C"  // A shade of khaki
  ];
  return (
    <div className="w-full h-full" ref={chartRef}>
      {title && <p className="text-xs text-center mb-1">{title}</p>}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 10 }}
        >
          <XAxis
            dataKey=""
            label={{
              value: "Production Days",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatYAxis}
            label={{
              value: "Production Rate (STBD)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* P10-P90 Range Area */}
          <Area dataKey="areaArr" stroke="#8884d8" fill="#8884d8" />
          {Object.keys(data[0] ?? []).map((item,index)=> <Line
            type="monotone"
            dataKey={item}
            stroke={colors[index]}
            // strokeDasharray="3 3"
            dot={false}
            // name={`P10 ${selectedModel} fit`}
          />)}
         
          {/* <Line
            type="monotone"
            dataKey="G50"
            stroke="#033dfc"
            strokeDasharray="3 3"
            dot={false}
            name={`P50 ${selectedModel} fit`}
          />
          <Line
            type="monotone"
            dataKey="G90"
            stroke="#05f209"
            strokeDasharray="3 3"
            dot={false}
            name={`P90 ${selectedModel} fit`}
          />
          <Line
            type="monotone"
            dataKey="P10"
            stroke="#f20509"
            dot={false}
            name="P10"
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey="P50"
            stroke="#033dfc"
            dot={false}
            name="P50"
            strokeWidth={1.5}
          />
          <Line
            type="monotone"
            dataKey="P90"
            stroke="#05f209"
            dot={false}
            name="P90"
          /> */}
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}