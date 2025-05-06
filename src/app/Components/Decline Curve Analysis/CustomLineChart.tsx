import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceArea } from 'recharts';

interface Data {
  forecast: Record<number, number>;
  history: Record<number, number>;
  historical_fitted_rate: Record<number, number>;
  historical_data_rate: Record<number, number>;
  P10: Record<number, number>;
  P50: Record<number, number>;
  P90: Record<number, number>;
}

interface ChartProps {
  data: Data;
}

const CustomLineChart: React.FC<ChartProps> = ({ data }) => {
  const { forecast, history,historical_fitted_rate ,historical_data_rate,P10,P50,P90} = data;

  // Combine and transform data for plotting
  const combinedData = Object.keys({...forecast,...history,historical_fitted_rate,historical_data_rate}).map(key => {
    if (forecast) {
      
      return {
        month: `Month ${key}`,
        Forecast: forecast[parseInt(key)] && forecast[parseInt(key)],
        History:  history[parseInt(key)] && history[parseInt(key)] ,
        historical_fitted_rate: historical_fitted_rate && historical_fitted_rate[parseInt(key)],
        historical_data_rate: historical_data_rate && historical_data_rate[parseInt(key)]
      };
    }else{
      return {
        month: `Month ${key}`,
   
        historical_fitted_rate: historical_fitted_rate && historical_fitted_rate[parseInt(key)],
        historical_data_rate: historical_data_rate && historical_data_rate[parseInt(key)]
      };
    }
  });

  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(1)}  K`
    // return `${value}`
  }


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
      <Line
            type="monotone"
            dataKey="History"
            stroke="green"
            // width={3}
            // strokeDasharray="5 5"
            dot={false}
            name="History"
          />
      <Line
            type="monotone"
            dataKey="historical_fitted_rate"
            stroke="red"
            // width={3}
            // strokeDasharray="5 5"
            dot={false}
            name="History Fitted rate "
          />
      {/* <Line
            type="monotone"
            dataKey="historical_data_rate"
            stroke="yellow"
            // width={3}
            // strokeDasharray="5 5"
            dot={false}
            name="History Fitted rate "
          /> */}
          

{/* Confidence interval band */}
<ReferenceArea y1={-confidenceInterval} y2={confidenceInterval} fill="#90caf9" fillOpacity={0.2} />

       <Line
            type="monotone"
            dataKey="Forecast"
            stroke="blue"
            //  strokeDasharray="5 5"
            dot={false}
            name="Forecast"
          />



    </LineChart>
  );
};

export default CustomLineChart;