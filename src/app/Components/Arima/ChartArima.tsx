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
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

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

// Type definitions
interface DataPoint {
  values: number[];
  config: [number, number][];
}

interface AcfChartProps {
  title: string;
  dataChart?: DataPoint;
}

// Constants for chart configuration
const CHART_LABELS = Array.from({ length: 18 }, (_, i) => i.toString());
const DARK_THEME = {
  background: '#1f2937',
  gridColor: 'rgba(255, 255, 255, 0.1)',
  textColor: '#e5e7eb',
  barColor: '#7DF9FF',
  lineColor: '#FEE685',
  boundColor: 'rgba(209, 213, 219, 0.5)',
  boundFill: 'rgba(209, 213, 219, 0.3)',
};

const AcfChart: React.FC<AcfChartProps> = ({ title, dataChart }) => {
  const values = dataChart?.values ?? [];
  const configLowerBound = dataChart?.config?.map(([lower]) => lower) ?? [];
  const configUpperBound = dataChart?.config?.map(([, upper]) => upper) ?? [];

  const data: ChartData<'bar' | 'line'> = {
    labels: CHART_LABELS,
    datasets: [
      {
        type: 'line' as const,
        data: values,
        borderColor: DARK_THEME.lineColor,
        pointRadius: 4,
        pointBackgroundColor: DARK_THEME.lineColor,
        showLine: false,
      },
      {
        type: 'bar' as const,
        data: values,
        backgroundColor: DARK_THEME.barColor,
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
      {
        type: 'line' as const,
        data: configLowerBound,
        borderColor: DARK_THEME.boundColor,
        backgroundColor: DARK_THEME.boundFill,
        fill: '+1',
      },
      {
        type: 'line' as const,
        data: configUpperBound,
        borderColor: DARK_THEME.boundColor,
      },
    ],
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to allow full height
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        color: DARK_THEME.textColor,
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: DARK_THEME.background,
        titleColor: DARK_THEME.textColor,
        bodyColor: DARK_THEME.textColor,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: DARK_THEME.textColor,
        },
        title: {
          display: true,
          text: 'Lag',
          color: DARK_THEME.textColor,
        },
      },
      y: {
        grid: {
          color: DARK_THEME.gridColor,
        },
        ticks: {
          color: DARK_THEME.textColor,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: '370px', width: '100%' }}>
      <Chart
        style={{
          height: '100%',
          width: '100%',
          background: '#262626',
          borderRadius: '10px',
          padding: '10px',
          boxSizing: 'border-box',
        }}
        type="bar"
        data={data}
        options={options}
      />
    </div>
  );
};

export default AcfChart;