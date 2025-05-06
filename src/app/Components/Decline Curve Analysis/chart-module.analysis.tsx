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

  // Prepare data for recharts
  const formattedData = Array.from(allDateKeys).map((day) => {
    const dayNumber = Number(day);
    const dataPoint: Record<string, number | null> = { day: dayNumber };
    
    Object.keys(data).forEach((modelKey) => {
      const modelData = data[modelKey];
      dataPoint[`${modelKey}_forecast`] = modelData.forecast_rate[day] || null;
      dataPoint[`${modelKey}_historical`] = modelData.historical_fitted_rate[day] || null;
    });

    return dataPoint;
  });

  // Log formatted data to debug
  console.log('Formatted Data:', formattedData);

  const colors=["#03fc1c","#cfd606","#0004ff","#73beff"]

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" type="number" domain={['dataMin', 'dataMax']} />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        {Object.keys(data).map((modelKey,index) => (
     
            <Line
              type="monotone"
              dataKey={`${modelKey}_forecast`}
              name={`Forecast Rate (${modelKey})`}
              stroke={colors[index]}
              activeDot={{ r: 8 }}
            />
            // <Line
            //   type="monotone"
            //   dataKey={`${modelKey}_historical`}
            //   name={`Historical Fitted Rate (${modelKey})`}
            //   stroke="#82ca9d"
            //   dot={false}
            // />
        
        ))}
        {Object.keys(data).map((modelKey,index) => (
     
            // <Line
            //   type="monotone"
            //   dataKey={`${modelKey}_forecast`}
            //   name={`Forecast Rate (${modelKey})`}
            //   stroke="#8884d8"
            //   activeDot={{ r: 8 }}
            // />
            <Line
              type="monotone"
              dataKey={`${modelKey}_historical`}
              name={`Historical Fitted Rate (${modelKey})`}
              stroke={colors[index]}
              dot={false}
            />
        
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ForecastChart;