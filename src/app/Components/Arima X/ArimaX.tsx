"use client"

import React, { useEffect, useState, CSSProperties } from "react"
import { PacmanLoader } from "react-spinners"
import { Header } from "../Header"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

import { GenerateChartModal } from "../Generate Chart Modal/GenerateChartModal"
import { ArimaPosts } from "@/api-client/api-client"
import {  FormControl, MenuItem, Select } from "@mui/material"
import { wells } from "../Well Analysis/mui-style-well-select"
import AcfChart from "../Arima/ChartArima"
import { Checkbox } from "../ui/checkbox"

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
}

interface Parameters {
  name: string
  from: number
  to: number
}
interface ParametersItemProps {
  Parameters: Parameters
}
const ParametersItem: React.FC<ParametersItemProps> = ({ Parameters }) => (
  <div className="flex items-center justify-between space-y-2 mt-3 space-x-10">
    <Label htmlFor={Parameters.name} className="text-sm">
      {Parameters.name}
    </Label>
    <div className="flex items-center space-x-2">
      <span>from</span>
      <Input disabled id={Parameters.name} value={Parameters.from} />
    </div>
    <div className="flex items-center space-x-2">
      <span>to</span>
      <Input disabled id={Parameters.name} value={Parameters.to} />
    </div>
  </div>
)

export default function Arima() {
  const [loading, setLoading] = useState<boolean>(false)
  const [well, setWell] = useState("SPH-04")
  const [rangTrain, setRangTrain] = useState<string | number>("50")
  const [initialParameters] = useState<Parameters[]>([
    { name: "p", from: 0, to: 0 },
    { name: "d", from: 0, to: 0 },
    { name: "q", from: 0, to: 0 },
  ])
  const [bestModels, setBestModels] = useState<number[]>([0, 0, 0])
  const [chartACFdata, setChartACFdata] = useState<number[]>([])
  const [chartPACFdata, setChartPACFdata] = useState<number[]>([])
  const [dataDialogChart, setDataDialogChart] = useState<any>({})
  const [OpenChart, setOpenChart] = useState<boolean>(false)

  const handleWellChange = (e: any) => {
    setWell(e.target.value)
    fetchArima(e.target.value)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangTrain(e.target.value)
  }
  const openModalChart = () => setOpenChart(true)
  const closeChart = () => setOpenChart(false)
  const [selectedModels, setSelectedModels] = useState({
    WHP: true,
    Choke: false,
    // Oil_rate: false,

  })
  const selectedModelsArr = Object
  .entries(selectedModels)
  .filter(([_, isOn]) => isOn)
  .map(([key]) => key.replace(/_/g, " "))

  const toggleModel = (model: keyof typeof selectedModels) => {
    setSelectedModels({
      ...selectedModels,
      [model]: !selectedModels[model],
    })
  }
 

  const fetchArima = async (wellName = well) => {
    setLoading(true)
    try {
      const params = {
        well_name: wellName,
        model: "ARIMAX",
        input_features: selectedModelsArr,
      }
      const res = await ArimaPosts(params)

      setChartACFdata(res.data.acf_pacf_data.acf_data.acf_values)
      setChartPACFdata(res.data.acf_pacf_data.pacf_data.pacf_values)
      setBestModels(res.data.recom_order.recommended_order)

      const Measured_train = JSON.parse(res.data.metrics_and_data.train)
      const Predicted_train = JSON.parse(
        res.data.metrics_and_data.train_forecast
      )
      const Predicted_Validation = JSON.parse(
        res.data.metrics_and_data.predict_df
      )
      const Measured_Validation = JSON.parse(res.data.metrics_and_data.valid)

      setDataDialogChart({
        Measured_train,
        Predicted_train,
        Predicted_Validation,
        Measured_Validation,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArima()
  }, [])

  return (
    <div className="container mx-auto px-4 relative overflow-hidden">
      {/* === Loader Overlay === */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-white bg-opacity-80 flex items-center justify-center">
          <PacmanLoader
            color="#365ad8"
            loading={loading}
            cssOverride={override}
            size={150}
          />
        </div>
      )}

      {/* === Header === */}
      <Header title={"ARIMA X Algorithm"} />

      {/* === Main Grid === */}
      <div className="w-80 mb-5" >
            <h2 className=" font-bold text-gray-400 my-3">Input Feature</h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="WHP"
                  checked={selectedModels.WHP}
                  onCheckedChange={() => toggleModel("WHP")}
                />
                <Label htmlFor="exponential" className="text-sm">
                WHP
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="harmonic"
                  checked={selectedModels.Choke}
                  onCheckedChange={() => toggleModel("Choke")}
                />
                <Label htmlFor="Choke" className="text-sm">
                  Choke
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="Oil_rate"
                  disabled
                  checked={true}
                  // onCheckedChange={() => toggleModel("Oil_rate")}
                />
                <Label htmlFor="Oil_rate" className="text-sm">
                  Oil rate
                </Label>
              </div>
            
             
            
              
            </div>
          </div>
      <div className="h-200 grid grid-cols-6 lg:grid-cols-12 space-x-5">
        {/* Left Panel */}
        <div className="col-span-6 lg:col-span-7">
          {/* Well selector */}
          <div className="mb-5">
            <h2 className="font-bold mb-2">Well Name</h2>
            <FormControl sx={{ minWidth: 200, mt: "5px" }} size="small">
              <Select onChange={handleWellChange} value={well}>
                {wells.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

           
          <div className="grid grid-cols-12 space-x-10">
            {/* Parameters */}
            <div className="col-span-5">
              <h2 className="border-b border-gray-300 pb-2 text-gray-400 font-bold">
                Parameters
              </h2>
              {initialParameters.map((p) => (
                <ParametersItem key={p.name} Parameters={p} />
              ))}
            </div>

            {/* Tuning & Best Model */}
            <div className="col-span-7 h-10">
              <h2 className="text-gray-400 font-bold">Hyperparameter Tuning</h2>
              <div className="flex space-x-3 mt-7">
                <h2>Train Percentage</h2>
                <input
                  onChange={handleChange}
                  className="w-2/4"
                  type="range"
                />{" "}
                <span>{rangTrain} %</span>
              </div>

              <div className="space-x-3 mt-5">
                <h2 className="text-gray-400 font-bold">Best Model</h2>
                <div className="flex space-x-5 py-5">
                  <span> p = {bestModels[0]}</span>
                  <span> d = {bestModels[1]}</span>
                  <span> q = {bestModels[2]}</span>
                </div>
              </div>

              <div className="space-x-3 mt-6">
                <h2 className="text-gray-400 font-bold">User Select</h2>
                <div className="grid grid-cols-4 space-x-5 py-3">
                  <div className="flex items-center space-x-2">
                    <span> p </span> <Input disabled id="p" value={0} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span> d </span> <Input disabled id="d" value={0} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span> q </span> <Input disabled id="q" value={0} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Forecast */}
          <div className="mt-30 ml-11">
            <h2 className="p-2 border w-60 text-center rounded-t-2xl font-bold border-b-0">
              Generate Forecast
            </h2>
            <div className="border w-110 py-3 px-10 rounded-tr-2xl">
              <h2 className="border-b border-gray-300 pb-2 text-gray-400 font-bold">
                Projection Settings
              </h2>
              <Button
                onClick={openModalChart}
                className="bg-gray-800 hover:bg-gray-700 cursor-pointer my-5 text-white w-43"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-6 lg:col-span-5 space-y-20">
          <AcfChart title="Autocorrelation (ACF)" dataChart={chartACFdata} />
          <AcfChart
            title="Autocorrelation (PACF)"
            dataChart={chartPACFdata}
          />
        </div>
      </div>

      {/* Forecast Modal */}
      <GenerateChartModal
        data={dataDialogChart}
        OpenChart={OpenChart}
        closeChart={closeChart}
      />
    </div>
  )
}