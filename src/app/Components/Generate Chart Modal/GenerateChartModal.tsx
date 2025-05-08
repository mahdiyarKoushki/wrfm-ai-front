import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";

// Types
interface RawSeries {
  name: string;
  index: number[];
  data: number[];
}

type RawData = Record<string, RawSeries>;

interface Metrics {
  [key: `MAE_${string}` | `RMSE_${string}` | `MAPE_${string}`]: number | undefined;
}

interface PropsModal {
  OpenChart: boolean;
  closeChart: () => void;
  data: RawData;
  metrics: Metrics;
}

// Constants
const DARK_THEME = {
  modalBg: "#1f2937",
  textPrimary: "#e5e7eb",
  textSecondary: "#9ca3af",
  tableHeaderBg: "#374151",
  tableRowBg: "#2d3748",
  tableBorder: "#4b5563",
  chartGrid: "#4b556320",
  chartText: "#d1d5db",
  legendBg: "rgba(55, 65, 81, 0.8)",
};

const MODAL_STYLE = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: DARK_THEME.modalBg,
  borderRadius: "10px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  width: "80%",
  height: "80%",
};

const CHART_LINES = [
  { key: "Forecasted_Rate", color: "#22c55e", name: "Forecasted Rate" },
  { key: "Measured_Test", color: "#9333ea", name: "Measured Test" },
  { key: "Measured_Train", color: "#3366cc", name: "Measured Train" },
  { key: "Predicted_Test", color: "#ff8800", name: "Predicted Test" },
  { key: "Predicted_Train", color: "#ff0000", name: "Predicted Train" },
];

const CATEGORIES = ["Test", "Train"];

// Component
export const GenerateChartModal: React.FC<PropsModal> = ({
  OpenChart,
  closeChart,
  data: rawData,
  metrics,
}) => {
  const [chartData, setChartData] = useState<
    Array<Record<string, number | string | null>>
  >([]);

  // Process raw data for chart
  useEffect(() => {
    if (!rawData) {
      setChartData([]);
      return;
    }

    const allTimestamps = new Set<number>();
    Object.values(rawData).forEach((series) =>
      series.index.forEach((ts) => allTimestamps.add(ts))
    );
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    const processedData = sortedTimestamps.map((ts) => {
      const date = format(new Date(ts), "yyyy-MM-dd");
      const year = format(new Date(ts), "yyyy"); // Extract year for second X-axis
      const row: Record<string, number | string | null> = { date, year };
      Object.entries(rawData).forEach(([key, series]) => {
        const idx = series.index.indexOf(ts);
        row[key] = idx >= 0 ? series.data[idx] : null;
      });
      return row;
    });

    setChartData(processedData);
  }, [rawData]);

  // Compute unique years for the second X-axis ticks
  const uniqueYears = Array.from(new Set(chartData.map((d) => d.year as string)));
  const uniqueMon = Array.from(new Set(chartData.map((d) => d.mon as string)));

  // Prepare table data
  const tableData = CATEGORIES.map((category) => {
    const mapeValue = metrics[`MAPE_${category}`];
    return {
      category,
      MAE: metrics[`MAE_${category}`] ?? undefined,
      RMSE: metrics[`RMSE_${category}`] ?? undefined,
      MAPE: mapeValue != null ? mapeValue * 100 : undefined,
    };
  });

  // Format X-axis labels
  const formatXAxis = (dateStr: string) => {
    const date = parseISO(dateStr);
    return chartData.length > 60 ? format(date, "MMM") : format(date, "MM-dd");
  };

  // Format year for second X-axis and Y-axis (right)
  const formatYearAxis = (year: string) => year;

  return (
    <Modal open={OpenChart} onClose={closeChart}>
      <Box sx={MODAL_STYLE}>
        <div className="flex w-full justify-between">
          <h2 className="text-xl font-bold mb-4" style={{ color: DARK_THEME.textPrimary }}>
            Well Production Chart
          </h2>
          <div className="w-1/2 ml-8">
            <h3 className="text-lg font-bold mb-2" style={{ color: DARK_THEME.textSecondary }}>
              Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ backgroundColor: DARK_THEME.tableHeaderBg, color: DARK_THEME.textPrimary }}>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">MAE</th>
                    <th className="py-2 px-4 text-left">RMSE</th>
                    <th className="py-2 px-4 text-left">MAPE</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map(({ category, MAE, RMSE, MAPE }) => (
                    <tr
                      key={category}
                      className="border-b"
                      style={{
                        borderColor: DARK_THEME.tableBorder,
                        backgroundColor: DARK_THEME.tableRowBg,
                        color: DARK_THEME.textPrimary,
                      }}
                    >
                      <td className="py-2 px-4">{category}</td>
                      <td className="py-2 px-4">{MAE?.toFixed(2) ?? "N/A"}</td>
                      <td className="py-2 px-4">{RMSE?.toFixed(2) ?? "N/A"}</td>
                      <td className="py-2 px-4">{MAPE?.toFixed(2) ?? "N/A"}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="h-[calc(100%_-_150px)] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid stroke={DARK_THEME.chartGrid} />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                minTickGap={30}
                padding={{ left: 10, right: 10 }}
                tick={{ fill: DARK_THEME.chartText }}
                strokeWidth={3}
                stroke="#fff"
              />
              <XAxis
                dataKey="year"
                xAxisId="year"
                tickFormatter={formatYearAxis}
                ticks={uniqueYears} // Use unique years to avoid duplicates
                tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
                stroke="#ffff"
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                domain={[0, "auto"]}
                tickCount={8}
                strokeWidth={3}
                stroke="#fff"
                label={{
                  value: "Oil Rate (STBD)",
                  angle: -90,
                  position: "insideLeft",
                  fill: DARK_THEME.chartText,
                }}
                tick={{ fill: DARK_THEME.chartText }}
              />
            
              <Tooltip
                contentStyle={{
                  backgroundColor: DARK_THEME.modalBg,
                  color: DARK_THEME.textPrimary,
                  border: `1px solid ${DARK_THEME.tableBorder}`,
                }}
                labelFormatter={(lbl) => lbl}
                formatter={(val, name) => [val, name]}
              />
              <Legend
                wrapperStyle={{
                  width: "100%", // Match chart width
                  color: DARK_THEME.chartText,
                  // backgroundColor: DARK_THEME.legendBg,
                  padding: "4px 100px",
                  borderRadius: "4px",
                }}
              />
              {CHART_LINES.map(({ key, color, name }) => (
                <Line
                  key={key}
                  yAxisId="left"
                  type="monotone"
                  strokeWidth={2}
                  dataKey={key}
                  stroke={color}
                  name={name}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Box>
    </Modal>
  );
};