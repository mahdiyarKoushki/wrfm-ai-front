import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceArea } from 'recharts';

interface Data {
  historical_fitted_rate: Record<number, number>;
  historical_data_rate: Record<number, number>;
  P10: Record<number, number>;
  P50: Record<number, number>;
  P90: Record<number, number>;
}

interface ChartProps {
  data: Data;
}

const ProbabilisticChart: React.FC<ChartProps> = ({ data }) => {
  const { historical_fitted_rate ,historical_data_rate,P10,P50,P90} = data;

  // Combine and transform data for plotting
  const combinedData = Object.keys({...history,...historical_fitted_rate,...historical_data_rate,...P10,...P50,...P90}).map(key => {
   
      return {
        month: `Month ${key}`,
        P10: P10 && P10[parseInt(key)],
        P50:P50 && P50[parseInt(key)],
        P90:P90 && P90[parseInt(key)],
        historical_fitted_rate: historical_fitted_rate && historical_fitted_rate[parseInt(key)],
        historical_data_rate: historical_data_rate && historical_data_rate[parseInt(key)]
      };
    
  });

  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(1)}  K`
    // return `${value}`
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
  const confidenceInterval = 1
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
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="" />
      <YAxis  tickFormatter={formatYAxis}
              domain={["dataMin", "dataMax"]}
        />
      <Tooltip />
      <Legend />
      {Object.keys(data).map((item,index)=> <Line
            type="monotone"
            dataKey={item}
            stroke={colors[index]}
            // width={3}
            // strokeDasharray="5 5"
            dot={false}
            // name="History"
          />)}
     
  
          





    </LineChart>
  );
};

export default ProbabilisticChart;