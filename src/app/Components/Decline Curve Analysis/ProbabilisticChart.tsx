import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import moment from "moment";

interface Data {
  historical_fitted_rate: Record<string, number>;
  historical_data_rate: Record<string, number>;
  P10: Record<string, number>;
  P50: Record<string, number>;
  P90: Record<string, number>;
}

interface ChartProps {
  data: Data;
}

const ProbabilisticChart: React.FC<ChartProps> = ({ data }) => {
  const { historical_fitted_rate, historical_data_rate, P10, P50, P90 } = data;

  const combinedData = Object.keys({
    ...historical_fitted_rate,
    ...historical_data_rate,
    ...P10,
    ...P50,
    ...P90,
  }).map((key) => ({
    date: key,
    P10: P10[key] !== undefined ? P10[key] : null,
    P50: P50[key] !== undefined ? P50[key] : null,
    P90: P90[key] !== undefined ? P90[key] : null,
    historicalFittedRate: historical_fitted_rate[key] !== undefined ? historical_fitted_rate[key] : null,
    historicalDataRate: historical_data_rate[key] !== undefined ? historical_data_rate[key] : null,
  }));

  const formatYAxis = (value: number) => `${(value / 1000).toFixed(1)} K`;

  const colors = {
    historicalFittedRate: "#FF5733",
    historicalDataRate: "#33FF57",
    P10: "#3357FF",
    P50: "#F1C40F",
    P90: "#8E44AD",
  };

  return (
    <LineChart
      width={800}
      height={500}
      data={combinedData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 20,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="date"
        tickFormatter={(tick) => moment(tick).format('MMM YYYY')}
        label={{ value: "Date", position: "insideBottomRight", offset: -10 }}
      />
      <YAxis
        tickFormatter={formatYAxis}
        domain={["dataMin", "dataMax"]}
        label={{ value: "Value (in K)", angle: -90, position: "insideLeft" }}
      />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="historicalFittedRate" stroke={colors.historicalFittedRate} dot={false} name="Historical Fitted Rate" />
      <Line type="monotone" dataKey="historicalDataRate" stroke={colors.historicalDataRate} dot={false} name="Historical Data Rate" />
      <Line type="monotone" dataKey="P10" stroke={colors.P10} dot={false} name="P10" />
      <Line type="monotone" dataKey="P50" stroke={colors.P50} dot={false} name="P50" />
      <Line type="monotone" dataKey="P90" stroke={colors.P90} dot={false} name="P90" />
    </LineChart>
  );
};

export default ProbabilisticChart;