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

const OilProductionChart: React.FC<RightSectionProps> = ({
  dataTabel,
  filterData,
}) => {
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

      const filtered = dataTabel.filter((item) => {
        return item.Date >= startStr && item.Date <= endStr;
      });

      setFilteredData(filtered.length > 0 ? filtered : dataTabel);
    } else {
      setFilteredData(dataTabel);
    }
  };

  const formatXAxis = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "MM-dd");
  };

  return (
    <div className="space-y-4 h-full ">
      {filterData && (
        <div className="flex flex-wrap gap-4 items-center ml-40">
          <DatePickerValue
            label="Start Date"
            setValue={setStartDate}
            value={startDate}
          />
          <DatePickerValue
            label="End Date"
            setValue={setEndDate}
            value={endDate}
          />

          <Button
            className="bg-gray-800 hover:bg-gray-700 text-white"
            onClick={handleApply}
          >
            Apply
          </Button>

          <Button
            variant="outline"
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

      <div className="h-[500px] w-[900px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 100, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" tickFormatter={formatXAxis} />

            <YAxis
              yAxisId="oil"
              orientation="left"
              stroke="#4bcf3d"
              label={{
                value: "Oil (STBD)",
                angle: -90,
                position: "insideBottom",
                fill: "#4bcf3d",
              }}
            />
            <YAxis
              yAxisId="whp"
              orientation="right"
              stroke="#641c4e"
              offset={0} // Set an initial offset
              label={{
                value: "WHP (psig)",
                angle: 90,
                position: "insideBottom",
                fill: "#641c4e",
              }}
            />
            <YAxis
              yAxisId="choke"
              orientation="right"
              stroke="#342dc8"
              offset={80} // Offset to create space between WHP and Choke axes
              label={{
                value: `Choke (1/64")`,
                angle: 90,
                position: "insideBottom",
                fill: "#342dc8",
              }}
            />

            <Tooltip />
            <Line
              type="monotone"
              dot={false}
              strokeWidth={2}
              name="Oil (STBD)"
              dataKey="Oil"
              stroke="#4bcf3d"
              yAxisId="oil"
            />
            <Line
              dot={false}
              name="WHP (psig)"
              type="monotone"
              dataKey="WHP"
              stroke="#641c4e"
              yAxisId="whp"
            />
            <Line
              dot={false}
              type="monotone"
              name={`Choke (1/64") `}
              dataKey="Choke"
              stroke="#342dc8"
              yAxisId="choke"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OilProductionChart;