import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { format, parseISO, addDays } from "date-fns"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
 borderRadios:"10px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
interface MonthlyData {
    oil: number;
    fthp: number;
  }

type MonthlyPatterns = {
    [key: number]: MonthlyData;
  }
const generateYearlyData = () => {
  const data = []
  const startDate = new Date("2024-01-01")
  const endDate = new Date("2024-12-31")

  let currentDate = new Date(startDate)

  let chokeValue = 35
  let oilValue = 1500
  let fthpValue = 800


  const monthlyPatterns: MonthlyPatterns = {
    0: { oil: 100, fthp: 50 },
    1: { oil: 200, fthp: 100 },
    2: { oil: -300, fthp: -150 },
    3: { oil: -200, fthp: -100 },
    4: { oil: 500, fthp: 250 },
    5: { oil: 300, fthp: 150 },
    6: { oil: 100, fthp: 50 },
    7: { oil: -100, fthp: -50 },
    8: { oil: -300, fthp: -150 },
    9: { oil: 700, fthp: 350 },
    10: { oil: 200, fthp: 100 },
    11: { oil: -200, fthp: -100 },
  };

  while (currentDate <= endDate) {
    const month = currentDate.getMonth()
    const day = currentDate.getDate()

    if (day === 1) {
      oilValue = Math.max(500, oilValue + monthlyPatterns[month].oil)
      fthpValue = Math.max(300, fthpValue + monthlyPatterns[month].fthp)
    } else {
      oilValue = Math.max(500, oilValue + (Math.random() * 40 - 20))
      fthpValue = Math.max(300, fthpValue + (Math.random() * 20 - 10))
    }

    if (month === 4 && day >= 10 && day <= 20) {
      oilValue = Math.max(2800, oilValue + Math.random() * 100)
      fthpValue = Math.max(1300, fthpValue + Math.random() * 50)
    }

    if (month === 9 && day >= 5 && day <= 15) {
      oilValue = Math.max(3000, oilValue + Math.random() * 100)
      fthpValue = Math.max(1400, fthpValue + Math.random() * 50)
    }

    if (day % 30 === 0) {
      chokeValue = Math.max(30, Math.min(40, chokeValue + (Math.random() * 2 - 1)))
    }

    data.push({
      date: format(currentDate, "yyyy-MM-dd"),
      choke: Number.parseFloat(chokeValue.toFixed(1)),
      oil: Math.round(oilValue),
      fthp: Math.round(fthpValue),
    })

  
    currentDate = addDays(currentDate, 1)
  }

  return data
}


const yearlyData = generateYearlyData()


interface PropsModal {
    OpenChart:boolean,
    setOpenChart: React.Dispatch<React.SetStateAction<boolean>>
    closeChart:() => void
}


export const GenerateChartModal:React.FC<PropsModal>=({OpenChart,setOpenChart,closeChart})=> {
 

  const [filteredData, setFilteredData] = React.useState(yearlyData)
        const [metrics, setMetrics] = React.useState({
          MAE: "0.73",
          RMSE: "0.95",
          MAPE: "0.25",
        })


  React.useEffect(() => {
    setFilteredData(yearlyData)
  }, [])



  const formatXAxis = (dateStr: string) => {
    const date = parseISO(dateStr)
 
    return filteredData.length > 60 ? format(date, "MMM") : format(date, "MM-dd")
  }

  return (
    <div>
   
      <Modal
        open={OpenChart}
        onClose={closeChart}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "80%" ,height:"80%"}}>
            <h1 className='text-2xl font-bold absolute top-10'>Generate out of sample forecasts for</h1>
        <div className="h-[calc(100%_-_160px)] w-full p-4">
        <div className='w-1/3 ml-auto mb-10 '>
            <h2 className="  my-6 font-bold text-gray-400">Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="py-2 px-4 text-center">MAE</th>
                    <th className="py-2 px-4 text-center">RMSE</th>
                    <th className="py-2 px-4 text-center">MAPE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 text-center">{metrics.MAE}</td>
                    <td className="py-2 px-4 text-center">{metrics.RMSE}</td>
                    <td className="py-2 px-4 text-center">{metrics.MAPE}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart
                   data={filteredData}
                   margin={{
                     top: 20,
                     right: 30,
                     left: 20,
                     bottom: 10,
                   }}
                 >
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="date" tickFormatter={formatXAxis} minTickGap={30} padding={{ left: 10, right: 10 }} />
                   <YAxis
                     yAxisId="left"
                     orientation="left"
                     domain={[0, "auto"]}
                     tickCount={8}
                     label={{ value: "Oil/FTHP", angle: -90, position: "insideLeft" }}
                   />
                   <YAxis
                     yAxisId="right"
                     orientation="right"
                     domain={[0, 50]}
                     tickCount={6}
                     label={{ value: "Choke", angle: 90, position: "insideRight" }}
                   />
                   <Tooltip
                     labelFormatter={(value) => format(parseISO(value), "yyyy-MM-dd")}
                     formatter={(value, name) => {
                       if (name === "choke") return [value, "Choke"]
                       if (name === "oil") return [value, "Oil Connected by Seafloor"]
                       if (name === "fthp") return [value, "FTHP"]
                       return [value, name]
                     }}
                   />
                   <Legend />
                   <Line
                     yAxisId="right"
                     type="monotone"
                     dataKey="choke"
                     stroke="#3366cc"
                     name="Choke"
                     dot={false}
                     strokeWidth={2}
                   />
                   <Line
                     yAxisId="left"
                     type="monotone"
                     dataKey="oil"
                     stroke="#22c55e"
                     name="Oil Connected by Seafloor"
                     dot={false}
                     strokeWidth={2}
                   />
                   <Line
                     yAxisId="left"
                     type="monotone"
                     dataKey="fthp"
                     stroke="#9333ea"
                     name="FTHP"
                     dot={false}
                     strokeWidth={2}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
        </Box>
      </Modal>
    </div>
  );
}
