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

const sampleData: DataRow[] = [
  { Date: "2023-01-01", Choke: 32, BSTP: 100, WHP: 1500, Oil: 500 },
  { Date: "2023-02-01", Choke: 34, BSTP: 110, WHP: 1450, Oil: 520 },
  { Date: "2023-03-01", Choke: 30, BSTP: 105, WHP: 1480, Oil: 510 },
  { Date: "2024-01-01", Choke: 35, BSTP: 115, WHP: 1400, Oil: 530 },
  // Add more data points up to "2024-12-31" for a full range
];

const formatXAxisMonth = (dateStr: string) => {
  const date = parseISO(dateStr);
  return format(date, "MMM");
};

const formatXAxisYear = (dateStr: string) => {
  const date = parseISO(dateStr);
  return format(date, "yyyy");
};

// Function to generate ticks for the first date of each year
const getYearTicks = (data: DataRow[]) => {
  const years = new Set<string>();
  const ticks: string[] = [];

  data.forEach((item) => {
    const year = format(parseISO(item.Date), "yyyy");
    if (!years.has(year)) {
      years.add(year);
      ticks.push(item.Date);
    }
  });

  return ticks;
};

// Function to generate ticks for the first date of each month
const getMonthTicks = (data: DataRow[]) => {
  const months = new Set<string>();
  const ticks: string[] = [];

  data.forEach((item) => {
    const monthYear = format(parseISO(item.Date), "yyyy-MM");
    if (!months.has(monthYear)) {
      months.add(monthYear);
      ticks.push(item.Date);
    }
  });

  return ticks;
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const [oil, whp, choke] = payload;
    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">
          <strong>Date:</strong> {formatXAxisYear(oil.payload.Date)}
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

  const colors = ["#8A2BE2", "#7DF9FF", "#FFA500", "#FFD700", "#32CD32", "#40E0D0", "#FF33E6", "#FF6F61", "#FF1493", "#7FFF00"];

  // Generate ticks for the year and month axes
  const yearTicks = getYearTicks(filteredData);
  const monthTicks = getMonthTicks(filteredData);

  return (
    <div className="mx-auto h-[600px]">
      {filterData && (
        <div className="flex flex-wrap gap-4 items-center justify-center">
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
            className="bg-[#ac7d0c] hover:bg-amber-200 hover:text-black text-white font-semibold rounded-md transition-colors"
            onClick={handleApply}
          >
            Apply
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-400 hover:bg-gray-200 rounded-md transition-colors"
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
      <div className="h-full w-full flex items-center justify-center py-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#efefef20" />
            <XAxis
              dataKey="Date"
              tickFormatter={formatXAxisMonth}
              ticks={monthTicks} // Use the generated month ticks
              tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
              strokeWidth={2}
              stroke="#ffff"
            />
            <XAxis
              dataKey="Date"
              xAxisId="year"
              tickFormatter={formatXAxisYear}
              ticks={yearTicks}
              tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 600 }}
              stroke="#ffff"
            />
            <YAxis
              yAxisId="oil"
              orientation="left"
              stroke="#4bcf3d"
              tick={{ fill: "#4bcf3d", fontSize: 12, fontWeight: 600 }}
              label={{
                value: "Oil (STBD)",
                angle: -90,
                position: "insideLeft",
                fill: "#4bcf3d",
                fontSize: 14,
                fontWeight: 600,
              }}
            />
            <YAxis
              yAxisId="whp"
              orientation="right"
              stroke={colors[0]}
              tick={{ fill: colors[0], fontSize: 12, fontWeight: 600 }}
              label={{
                value: "FTHP (psig)",
                angle: 90,
                offset: 15,
                position: "insideRight",
                fill: colors[0],
                fontSize: 14,
                fontWeight: 600,
              }}
            />
            <YAxis
              yAxisId="choke"
              orientation="right"
              stroke={colors[1]}
              tick={{ fill: colors[1], fontSize: 12, fontWeight: 600 }}
              domain={([dataMin, dataMax]) => [dataMin * 0.5, dataMax * 1.1]}
              label={{
                value: `Choke (1/64")`,
                angle: 90,
                position: "insideRight",
                fill: colors[1],
                fontSize: 14,
                offset: 20,
                fontWeight: 600,
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
              stroke={colors[0]}
              yAxisId="whp"
              activeDot={{ r: 6, fill: "#641c4e" }}
            />
            <Line
              type="monotone"
              dot={false}
              strokeWidth={2}
              name={`Choke (1/64")`}
              dataKey="Choke"
              stroke={colors[1]}
              yAxisId="choke"
              activeDot={{ r: 6, fill: colors[1] }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OilProductionChart;