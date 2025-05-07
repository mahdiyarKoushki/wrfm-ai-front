"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Button } from "../../ui/button";
import { DatePickerValue } from "../../ui/DatePickerValue";

interface DataRow {
  Date: string;
  Choke: number;
  BSTP: string | number;
  WHP: number;
  Oil: string | number;
}

interface RightSectionProps {
  dataTabel: DataRow[];
  filterData: boolean;
}

// Sample data for testing (replace with your actual data)
const sampleData: DataRow[] = [
  { Date: "2023-01-01", Choke: 32, BSTP: 100, WHP: 1500, Oil: 500 },
  { Date: "2023-02-01", Choke: 34, BSTP: 110, WHP: 1450, Oil: 520 },
  { Date: "2023-03-01", Choke: 30, BSTP: 105, WHP: 1480, Oil: 510 },
  // Add more data points up to "2024-12-31" for a full range
];

// Formatting functions
const formatXAxis = (dateStr: string) => {
  const date = parseISO(dateStr);
  return format(date, "MMM yyyy");
};

const formatXAxisTooltip = (dateStr: string) => {
  const date = parseISO(dateStr);
  return format(date, "yyyy-MM-dd");
};

// Custom Tooltip with enhanced styling
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const [oil, whp, choke] = payload;
    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">
          <strong>Date:</strong> {formatXAxisTooltip(oil.payload.Date)}
        </p>
        <p className="text-sm text-[#4bcf3d]">
          <strong>Oil (STBD):</strong> {Number(oil.value).toFixed(0)}
        </p>
        <p className="text-sm text-[#641c4e]">
          <strong>FTHP (psig):</strong> {whp.value}
        </p>
        <p className="text-sm text-[#342dc8]">
          <strong>Choke (1/64"):</strong> {choke.value}
        </p>
      </div>
    );
  }
  return null;
};

const OilProductionChart: React.FC<RightSectionProps> = ({ dataTabel, filterData }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<DataRow[]>(dataTabel);

  useEffect(() => {
    setFilteredData(dataTabel);
  }, [dataTabel]);

  const handleApply = () => {
    if (startDate && endDate) {
      const startStr = format(startDate, "yyyy-MM-dd");
      const endStr = format(endDate, "yyyy-MM-dd");

      const filtered = dataTabel.filter(
        (item) => item.Date >= startStr && item.Date <= endStr
      );

      setFilteredData(filtered.length > 0 ? filtered : dataTabel);
    } else {
      setFilteredData(dataTabel);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md max-w-4xl mx-auto">
      {filterData && (
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <DatePickerValue
            label="Start Date"
            setValue={setStartDate}
            value={startDate}
            // className="bg-white rounded-md shadow-sm"
          />
          <DatePickerValue
            label="End Date"
            setValue={setEndDate}
            value={endDate}
            // className="bg-white rounded-md shadow-sm"
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
            onClick={handleApply}
          >
            Apply
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setFilteredData(dataTabel);
            }}
          >
            Reset
          </Button>
        </div>
      )}
      <div className="h-[500px] w-full bg-white rounded-lg shadow-inner p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="Date"
              tickFormatter={formatXAxis}
              tick={{ fill: "#374151", fontSize: 12 }}
              stroke="#374151"
            />
            <YAxis
              yAxisId="oil"
              orientation="left"
              stroke="#4bcf3d"
              tick={{ fill: "#4bcf3d", fontSize: 12 }}
              label={{
                value: "Oil (STBD)",
                angle: -90,
                position: "insideLeft",
                fill: "#4bcf3d",
                fontSize: 14,
              }}
            />
            <YAxis
              yAxisId="whp"
              orientation="right"
              stroke="#641c4e"
              tick={{ fill: "#641c4e", fontSize: 12 }}
              label={{
                value: "FTHP (psig)",
                angle: 90,
                offset:15,
                position: "insideRight",
                fill: "#641c4e",
                fontSize: 14,
              }}
            />
            <YAxis
              yAxisId="choke"
              orientation="right"
              stroke="#342dc8"
              tick={{ fill: "#342dc8", fontSize: 12 }}
              domain={([dataMin, dataMax]) => [dataMin * 0.5, dataMax * 1.1]}
              label={{
                value: `Choke (1/64")`,
                angle: 90,
                position: "insideRight",
                fill: "#342dc8",
                fontSize: 14,
                offset: 20,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dot={false}
              strokeWidth={2}
              name="Oil (STBD)"
              dataKey="Oil"
              stroke="#4bcf3d"
              yAxisId="oil"
              activeDot={{ r: 6, fill: "#4bcf3d" }}
            />
            <Line
              type="monotone"
              dot={false}
              strokeWidth={2}
              name="FTHP (psig)"
              dataKey="WHP"
              stroke="#641c4e"
              yAxisId="whp"
              activeDot={{ r: 6, fill: "#641c4e" }}
            />
            <Line
              type="monotone"
              dot={false}
              strokeWidth={2}
              name={`Choke (1/64")`}
              dataKey="Choke"
              stroke="#342dc8"
              yAxisId="choke"
              activeDot={{ r: 6, fill: "#342dc8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OilProductionChart;