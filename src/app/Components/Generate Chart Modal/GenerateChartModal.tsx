import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
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

// Custom styles for the modal
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

// Define the types for your data structure
type RawSeries = {
  name: string;
  index: number[];
  data: number[];
 
};

export type RawData = Record<string, RawSeries>;

interface PropsModal {
  OpenChart: boolean;
  closeChart: () => void;
  data: RawData;
  metrics:any;
}

const analysisData = {
  Forecast: {
      MAE: 63.394493668513974,
      RMSE: 72.32762037680735,
      MAPE: 0.030920776632563346 * 100, // Convert to percentage
  },
  Test: {
      MAE: 28.590381320495275,
      RMSE: 45.50207297636724,
      MAPE: 0.01160290088231474 * 100, // Convert to percentage
  },
  Train: {
      MAE: 67.97819686819378,
      RMSE: 105.37960996072846,
      MAPE: 0.01963757318466132 * 100, // Convert to percentage
  },
};

export const GenerateChartModal: React.FC<PropsModal> = ({
  OpenChart,
  metrics,
  closeChart,
  data: rawData,
}) => {
  const [chartData, setChartData] = React.useState<
    Array<Record<string, number | string | null>>
  >([]);

  // Process the raw data and convert it to a format suitable for Recharts
  React.useEffect(() => {
    if (!rawData) {
      setChartData([]);
      return;
    }

    // 1. Collect all unique timestamps
    const allTss = new Set<number>();
    Object.values(rawData).forEach((series) =>
      series.index.forEach((ts) => allTss.add(ts))
    );
    const sortedTs = Array.from(allTss).sort((a, b) => a - b);

    // 2. Create an object for each timestamp
    const rows = sortedTs.map((ts) => {
      const date = format(new Date(ts), "yyyy-MM-dd");
      const row: Record<string, number | string | null> = { date };
      // Fill in values for each series or assign null
      Object.entries(rawData).forEach(([key, series]) => {
        const idx = series.index.indexOf(ts);
        row[key] = idx >= 0 ? series.data[idx] : null;
      });
      return row;
    });
    setChartData(rows);
  }, [rawData]);
  const categories = ['Forecast', 'Test', 'Train'];

  const DataTabel = categories.map(category => ({
    category,
    MAE: metrics[`MAE_${category}`],
    RMSE: metrics[`RMSE_${category}`],
    MAPE: metrics[`MAPE_${category}`] * 100 // Convert to percentage
  }));
  

  // Format the X-axis labels
  const formatXAxis = (dateStr: string) => {
    const d = parseISO(dateStr);
    return chartData.length > 60 ? format(d, "MMM") : format(d, "MM-dd");
  };

  return (
    <Modal open={OpenChart} onClose={closeChart}>
      <Box sx={{ ...style, width: "80%", height: "80%" }}>
      <div className="flex w-full justify-between">
      <h2 className="text-xl font-bold mb-4">Well Production Chart</h2>
      <div className="w-100 ml-20">
      <h2 className="text-gray-400 font-bold mb-2">Analysis</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">MAE</th>
              <th className="py-2 px-4 text-left">RMSE</th>
              <th className="py-2 px-4 text-left">MAPE</th>
            </tr>
          </thead>
          <tbody>
            {DataTabel.map(({category, MAE, RMSE, MAPE}) => (
              <tr key={category} className="border-b">
                <td className="py-2 px-4">{category}</td>
                <td className="py-2 px-4">{MAE?.toFixed(2)}</td>
                <td className="py-2 px-4">{RMSE?.toFixed(2)}</td>
                <td className="py-2 px-4">{MAPE?.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      </div>

        <div className="h-[calc(100%_-_200px)] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                minTickGap={30}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                domain={[0, "auto"]}
                tickCount={8}
                label={{
                  value: "Value",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                labelFormatter={(lbl) => lbl}
                formatter={(val, name) => [val, name]}
              />
              <Legend />

              {/** Define lines for each series */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="train"
                stroke="#22c55e"
                // name="Measured Train"
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="train_forecast"
                stroke="#9333ea"
                // name="Predicted Train"
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="valid"
                stroke="#3366cc"
                // name="Measured Validation"
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pred_test"
                stroke="#ff8800"
                // name="Predicted Validation"
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="blind"
                stroke="#ff0000"
                // name="Blind"
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="predict_df"
                stroke="#008080"
                // name="Predicted Future"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Box>
    </Modal>
  );
};