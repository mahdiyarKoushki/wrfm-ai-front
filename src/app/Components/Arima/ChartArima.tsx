import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

interface Tprop {
  title: string,
  dataChart?: any
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AcfChart: React.FC<Tprop> = ({ title, dataChart }) => {
  const { values, config } = dataChart;

  const configLowerBound = config?.map((point: [number, number]) => point[0]);
  const configUpperBound = config?.map((point: [number, number]) => point[1]);

  const data: ChartData<'bar' | 'line'> = {
    labels: Array.from({ length: 18 }, (_, i) => i.toString()),
    datasets: [
      {
        type: 'line',
        data: values,
        borderColor: 'green',
        pointRadius: 6,
        pointBackgroundColor: 'green',
        showLine: false,
   
      },
      {
        type: 'bar',
        data: values,
        borderColor: 'black',
        backgroundColor: '#000',
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
      {
        type: 'line',
        data: configLowerBound,
        borderColor: 'rgba(128, 128, 128, 0.5)', // Line color for lower bound (gray)
        backgroundColor: 'rgba(128, 128, 128, 0.3)', // Gray area fill color
        fill: '+1' // Fill area between this line and the next
      },
      {
        type: 'line',
        data: configUpperBound,
        borderColor: 'rgba(128, 128, 128, 0.5)', // Line color for upper bound (gray)
      },
     
    ]
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'lag', // Add your x-axis title text here
        }
      },
      y: {
        grid: {
          display: true,
        },
        beginAtZero: true,
      }
    }
  };

  return <Chart type='bar' data={data} options={options} />;
};

export default AcfChart;