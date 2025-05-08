"use client"
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea } from 'recharts';
import moment from 'moment';

interface ChartData {
  forecast: Record<string, number>;
  history: Record<string, number>;
  historicalFittedRate: Record<string, number>;
  historicalDataRate: Record<string, number>;
  p10: Record<string, number>;
  p50: Record<string, number>;
  p90: Record<string, number>;
}

interface ChartProps {
  data: ChartData;
}

const CustomLineChart: React.FC<ChartProps> = ({ data }) => {
  const { forecast, history, historicalFittedRate, historicalDataRate } = data;

  const combinedData = Object.keys({
    ...forecast,
    ...history,
    ...historicalFittedRate,
    ...historicalDataRate,
  }).map((dateKey) => {
    return {
      date: dateKey,
      forecast: forecast[dateKey] ?? null,
      history: history[dateKey] ?? null,
      historicalFittedRate: historicalFittedRate ? (historicalFittedRate[dateKey] ?? null) : null,
      historicalDataRate: historicalDataRate ? (historicalDataRate[dateKey] ?? null) : null,
    };
  });

  const formatYAxis = (value: number) => `${(value / 1000).toFixed(1)} K`;

  const confidenceInterval = 1;

  return (
    <LineChart
      width={800}
      height={500}
      data={combinedData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid stroke='#afafaf20' />
        <XAxis
            dataKey="date"
            tickFormatter={(tick) => moment(tick).format('MMM YYYY')}
           stroke='#fff'
           strokeWidth={2}
            label={{ value: "Date", position: "insideBottomRight", offset: -10 ,fill:"#fff"}}
          />
          <YAxis
            tickFormatter={formatYAxis}
            stroke='#fff'
            strokeWidth={2}
            label={{ value: "Value (in K)", fill:"#fff"  ,angle: -90 , offset: -15 , position: "insideLeft" }}
            domain={["dataMin", "dataMax"]}
          />
     <Tooltip
  contentStyle={{
    backgroundColor: '#333', // Dark background
    color: '#fff', // White text
    border: '1px solid #555', // Optional: dark border
    borderRadius: '4px', // Optional: rounded corners
  }}
  // itemStyle={{ color: '#fff' }} // Ensure legend items in tooltip are also white
/>
      <Legend />
      <Line type="monotone" dataKey="history" stroke="green" dot={false} name="History" />
      <Line type="monotone" dataKey="historicalFittedRate" stroke="red" dot={false} name="History Fitted Rate" />
      <ReferenceArea y1={-confidenceInterval} y2={confidenceInterval} fill="#90caf9" fillOpacity={0.2} />
      <Line type="monotone" dataKey="forecast" stroke="blue" dot={false} name="Forecast" />
    </LineChart>
  );
};

export default CustomLineChart;