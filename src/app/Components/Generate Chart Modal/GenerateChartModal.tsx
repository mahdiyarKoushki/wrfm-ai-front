import React from "react"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import { 
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis 
} from "recharts"
import { format, parseISO } from "date-fns"

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
}

type RawSeries = {
  name: string
  index: number[]
  data: number[]
}
export type RawData = Record<string, RawSeries>

interface PropsModal {
  OpenChart: boolean
  closeChart: () => void
  data: RawData
}

export const GenerateChartModal: React.FC<PropsModal> = ({
  OpenChart,
  closeChart,
  data: rawData,
}) => {
  const [chartData, setChartData] = React.useState<
    Array<Record<string, number | string | null>>
  >([])

  // تبدیل تمامی timestamp‌ها به یک آرایه مرتب و بعد تولید یک row برای هر timestamp
  React.useEffect(() => {
    if (!rawData) {
      setChartData([])
      return
    }
    // 1. جمع‌آوری همه‌ی timestampها
    const allTss = new Set<number>()
    Object.values(rawData).forEach(series =>
      series.index.forEach(ts => allTss.add(ts))
    )
    const sortedTs = Array.from(allTss).sort((a, b) => a - b)
    // 2. برای هر timestamp یک آبجکت می‌سازیم
    const rows = sortedTs.map(ts => {
      const date = format(new Date(ts), "yyyy-MM-dd")
      const row: Record<string, number | string | null> = { date }
      // پر کردن مقادیر هر سری یا دادن null
      Object.entries(rawData).forEach(([key, series]) => {
        const idx = series.index.indexOf(ts)
        row[key] = idx >= 0 ? series.data[idx] : null
      })
      return row
    })
    setChartData(rows)
  }, [rawData])

  // فرمت نمایش محور X
  const formatXAxis = (dateStr: string) => {
    const d = parseISO(dateStr)
    return chartData.length > 60 ? format(d, "MMM") : format(d, "MM-dd")
  }

  return (
    <Modal open={OpenChart} onClose={closeChart}>
      <Box sx={{ ...style, width: "80%", height: "80%" }}>
        <h2 className="text-xl font-bold mb-4">Well Production Chart</h2>
        <div className="h-[calc(100%_-_64px)] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                minTickGap={30}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                domain={[0, "auto"]}
                tickCount={8}
                label={{
                  value: "Value",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                labelFormatter={lbl => lbl}
                formatter={(val, name) => [val, name]}
              />
              <Legend />

              {/** برای هر سری یک خط مجزا می‌کشیم */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Measured_train"
                stroke="#22c55e"
                name="Measured Train"
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Predicted_train"
                stroke="#9333ea"
                name="Predicted Train"
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Measured_Validation"
                stroke="#3366cc"
                name="Measured Validation"
                dot={false}
                connectNulls
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Predicted_Validation"
                stroke="#ff8800"
                name="Predicted Validation"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Box>
    </Modal>
  )
}