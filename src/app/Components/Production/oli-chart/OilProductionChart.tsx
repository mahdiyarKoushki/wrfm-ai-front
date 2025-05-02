"use client"

import React, { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "../../ui/button"
import { DatePickerValue } from "../../ui/DatePickerValue"

interface DataRow {
  Date: string;
  Choke: number;
  BSTP: string;
  WHP: number;
  Oil: string | number;
}

interface RightSectionProps {
  dataTabel: DataRow[],
  filterData:boolean

}

const OilProductionChart: React.FC<RightSectionProps> = ({ dataTabel ,filterData}) => {
  
  
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [filteredData, setFilteredData] = useState<DataRow[]>(dataTabel)

  useEffect(() => {
    setFilteredData(dataTabel)
  }, [dataTabel])


  const handleApply = () => {
    if (startDate && endDate) {
      const startStr = format(startDate, "yyyy-MM-dd")
      const endStr = format(endDate, "yyyy-MM-dd")
  
      console.log('Start:', startStr, 'End:', endStr);  // لاگ برای بررسی تاریخ‌ها
  
      const filtered = dataTabel.filter((item) => {
        console.log('Checking item:', item.Date);  // لاگ برای بررسی دیتا آیتم
        return item.Date >= startStr && item.Date <= endStr
      })
  
      setFilteredData(filtered.length > 0 ? filtered : dataTabel)
  
    } else {
      setFilteredData(dataTabel)
    }
  }

  const formatXAxis = (dateStr: string) => {
    const date = parseISO(dateStr)
    return format(date, "MM-dd")
  }


  return (
    <div className="space-y-4">
      {filterData ? <div className="flex flex-wrap gap-4 items-center">
        <DatePickerValue label="Start Date" setValue={setStartDate} value={startDate} />
        <DatePickerValue label="End Date" setValue={setEndDate} value={endDate} />

        <Button className="bg-gray-800 hover:bg-gray-700 text-white" onClick={handleApply}>
          Apply
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setStartDate(null)
            setEndDate(null)
            setFilteredData(dataTabel)
          }}
        >
          Reset
        </Button>
      </div> :""
      }

      <div className="h-[400px] w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line   
              type="monotone"
             
              dot={false}
              strokeWidth={2}  dataKey="Oil" stroke="#4bcf3d" />
            <Line   dot={false} type="monotone" dataKey="WHP" stroke="#641c4e" />
            <Line   dot={false} type="monotone" dataKey="Choke" stroke="#342dc8" />
            <Line  name="FTHP"  dot={false} type="monotone" dataKey="BSTP" stroke="#641c4e" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default OilProductionChart