import moment from 'moment';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ForecastData {
  [key: string]: number;
}

interface ModelData {
  forecast_rate: ForecastData;
  historical_fitted_rate: ForecastData;
}

interface ForecastChartProps {
  data: {
    [key: string]: ModelData;
  };
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  // Collect all unique day keys for the x-axis
  const allDateKeys = new Set<string>();
  Object.keys(data).forEach((modelKey) => {
    const modelData = data[modelKey];
    Object.keys(modelData.forecast_rate).forEach((key) => allDateKeys.add(key));
    Object.keys(modelData.historical_fitted_rate).forEach((key) => allDateKeys.add(key));
  });

  // Format date function to convert '2024-01-18T00:00:00' to '2024-01-18'
  const formatDate = (dateStr: string) => {
    return dateStr.split('T')[0]; // Extract only the date part
  };

  // Prepare data for recharts
  const formattedData = Array.from(allDateKeys).map((day) => {
    const formattedDay = formatDate(day); // Apply formatDate here
    const dataPoint: any = { day: formattedDay };

    Object.keys(data).forEach((modelKey) => {
      const modelData = data[modelKey];

      // Only add forecast if the value is not null
      if (modelData?.forecast_rate[day] != null) {
        dataPoint[`${modelKey}_forecast`] = modelData.forecast_rate[day];
      }

      // Only add historical if the value is not null
      if (modelData?.historical_fitted_rate[day] != null) {
        dataPoint[`${modelKey}_historical`] = modelData.historical_fitted_rate[day];
      }
    });

    return dataPoint;
  });

  const colors = [
    '#03fc1c',
    '#cfd606',
    '#0004ff',
    '#73beff',
    '#ff2a2a',
    '#9b59b6',
    '#e67e22',
    '#2ecc71',
    '#3498db',
    '#f1c40f',
    '#e84393',
    '#1abc9c',
  ];

  const formatYAxis = (value: number) => `${(value / 1000).toFixed(1)} K`;

  return (
  <div className='p-5'> 
      <ResponsiveContainer style={{marginBottom:"10px",padding:"10px"}} width="100%" height={550}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="day" // Changed from "date" to "day"
          tickFormatter={(tick) => moment(tick).format('MMM YYYY')}
          label={{ value: 'Date', position: 'insideBottom', offset: -5}}
        />
        <YAxis
          tickFormatter={formatYAxis}
          domain={['dataMin', 'dataMax']}
          label={{ value: 'Value (in K)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        {Object.keys(data).map((modelKey, index) => (
          <Line
            key={`${modelKey}_forecast`}
            type="monotone"
            dataKey={`${modelKey}_forecast`}
            name={`Forecast Rate (${modelKey})`}
            stroke={colors[index % colors.length]} // Ensure color cycling
            activeDot={{ r: 8 }}
            dot={false}
          />
        ))}
        {Object.keys(data).map((modelKey, index) => (
          <Line
            key={`${modelKey}_historical`}
            type="monotone"
            dataKey={`${modelKey}_historical`}
            name={`Historical Fitted Rate (${modelKey})`}
            stroke={colors[index % colors.length]} // Ensure color cycling
            dot={true}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
  
  );
};

export default ForecastChart;