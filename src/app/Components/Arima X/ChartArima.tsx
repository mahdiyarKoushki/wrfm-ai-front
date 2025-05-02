"use client" 
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AcfChart: React.FC = () => {
  const data: ChartData<'bar' | 'line'> = {
    labels: Array.from({ length: 18 }, (_, i) => i.toString()),
    datasets: [
      {
        type: 'bar',
        label: 'ACF Bars',
        data: [1, 0.8, 0.6, 0.4, 0.2, -0.2, -0.4, -0.6, -0.8, -1, 0.7, 0.6, -0.3, -0.6, -1, 0.9, 0.5, 0.3],
        borderColor: 'black',
        backgroundColor: '#000',
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
        
      },
      {
        type: 'line',
        label: 'ACF Points',
        data: [1, 0.8, 0.6, 0.4, 0.2, -0.2, -0.4, -0.6, -0.8, -1, 0.7, 0.6, -0.3, -0.6, -1, 0.9, 0.5, 0.3],
        borderColor: 'green',
        pointRadius: 6,
        pointBackgroundColor: 'green',
        showLine: false
      }
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
        text: 'Autocorrelation (ACF)',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
        beginAtZero: true,
        max: 1.5,
        min: -1.5
      }
    }
  };

  return <Chart type='bar' data={data} options={options} />;
};

export default AcfChart;