"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Settings, BarChart2, LineChart } from "lucide-react"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { generateWellData } from "../../libo/generate-data"
import { Button } from "../ui/button"
import WellProductionChart from "../Well Analysis/well-production-chart"
import { Checkbox } from "../ui/checkbox"

import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useRouter } from "next/navigation"
import ModelParametersModal from "./model-parameters-modal"
import { Header } from "../Header"

export default function DeclineCurveAnalysis() {
    const router = useRouter()
      const [well, setwell] = useState<string>('SPH-02');
  
      const [wellData, setWellData] = useState<any[]>([])
      const [selectedModel, setSelectedModel] = useState("exponential")
      const [initialParams, setInitialParams] = useState({
        qi: "0",
        D: "0",
        b: "auto",
      })
      const [optimalParams, setOptimalParams] = useState({
        qi: "200",
      })
      const [projectionDays, setProjectionDays] = useState("180")
      const [metrics, setMetrics] = useState({
        MAE: "0.73",
        RMSE: "0.95",
        MAPE: "0.25",
      })
      const [isModelModalOpen, setIsModelModalOpen] = useState(false)
    
      useEffect(() => {
        // Generate data points for well production
        const data = generateWellData(365)
        setWellData(data)
      }, [])
    
      const handleRunAnalysis = () => {
        // Simulate analysis by updating optimal parameters
        setOptimalParams({
          qi: "200",
        })
      }
    
      const handleCompareModels = () => {
        setIsModelModalOpen(true)
      }
      // const toggleModel = (model: keyof typeof selectedModels) => {
      //   setSelectedModels({
      //     ...selectedModels,
      //     [model]: !selectedModels[model],
      //   })
      // }
    
  return (
    <div className="container mx-auto px-4">

             <Header title={"Decline Curve Analysis"}/>
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium mb-2">Well Name</h2>
            <FormControl sx={{ minWidth: 200 ,mt:"5px" }} size="small">
    
      <Select 
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={well}
        // onChange={handleChange}
      >
       
        <MenuItem value={"SPH-02"}>SPH-02</MenuItem>
        <MenuItem value={"SPH-03"}>SPH-03</MenuItem>
        <MenuItem value={"SPH-04"}>SPH-04</MenuItem>
      </Select>
    </FormControl>
          </div>
          <div>
            <h2 className="text-sm font-medium mb-2">Model Selection</h2>
           
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exponential"
                  checked={selectedModel === "exponential"}
                  onCheckedChange={() => setSelectedModel("exponential")}
                />
                <Label htmlFor="exponential" className="text-sm">
                  ARPS: Exponential
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="Harmonic"
                  checked={selectedModel === "Harmonic"}
                  onCheckedChange={() => setSelectedModel("Harmonic")}
                />
                <Label htmlFor="Harmonic" className="text-sm">
                  ARPS: Harmonic
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="Hyperbolic"
                  checked={selectedModel === "Hyperbolic"}
                  onCheckedChange={() => setSelectedModel("Hyperbolic")}
                />
                <Label htmlFor="Hyperbolic" className="text-sm">
                  ARPS: Hyperbolic
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="extended"
                  checked={selectedModel === "extended"}
                  onCheckedChange={() => setSelectedModel("extended")}
                />
                <Label htmlFor="extended" className="text-sm">
                  Extended Exponential
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="logistic"
                  checked={selectedModel === "logistic"}
                  onCheckedChange={() => setSelectedModel("logistic")}
                />
                <Label htmlFor="logistic" className="text-sm">
                  Logistic Growth Model
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="modified"
                  checked={selectedModel === "modified"}
                  onCheckedChange={() => setSelectedModel("modified")}
                />
                <Label htmlFor="modified" className="text-sm">
                  Modified DCA (Transition Decline Rate)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="power"
                  checked={selectedModel === "power"}
                  onCheckedChange={() => setSelectedModel("power")}
                />
                <Label htmlFor="power" className="text-sm">
                  Power Law
                </Label>
              </div>
            </div>
          
          </div>
          <div>
          <div className="ml-100 flex gap-2">
                  <Button
                  onClick={handleCompareModels}
                    variant="outline"
                    size="sm"
                    className="h-8 bg-green-500 text-white border-green-600 hover:bg-green-600"
                  >
                    <BarChart2 className="h-4 w-4 mr-1" />
                    Compare Models
                    
                  </Button>
                </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="flex w-full justify-between">

              <h2 className="text-sm font-medium text-gray-400 mb-2">Initial Parameters</h2>
              {/* <h2 className="text-sm font-medium text-gray-400 mb-2">Optimal Parameters</h2> */}
              </div>
              <div className="space-y-3 grid grid-cols-4 gap-x-10">
                <div className="space-y-1 ">
                  <Label htmlFor="initial-qi" className="text-sm">
                    qi
                  </Label>
                  <Input
                    id="initial-qi"
                    value={initialParams.qi}
                    onChange={(e) => setInitialParams({ ...initialParams, qi: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="initial-D" className="text-sm">
                    D
                  </Label>
                  <Input
                    id="initial-D"
                    value={initialParams.D}
                    onChange={(e) => setInitialParams({ ...initialParams, D: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="initial-b" className="text-sm">
                    b
                  </Label>
                  <Input
                    id="initial-b"
                    value={initialParams.b}
                    onChange={(e) => setInitialParams({ ...initialParams, b: e.target.value })}
                  />
                </div>
            
              </div>
            </div>

            
          </div>

          <div className="grid grid-cols-12 gap-6">
          
                <div className="w-120 col-span-8 ">
  <h2 className="text-gray-400 font-bold mb-2">Optimal Parameters</h2>
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 text-center">#</th>
          <th className="py-2 px-4 text-center">qi</th>
          <th className="py-2 px-4 text-center">D</th>
          <th className="py-2 px-4 text-center">b</th>
          <th className="py-2 px-4 text-center">K</th>
          <th className="py-2 px-4 text-center">n</th>
          <th className="py-2 px-4 text-center">D_lim</th>
          <th className="py-2 px-4 text-center">beta</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td className="py-2 px-4">P10</td>
          <td className="py-2 px-4">2000</td>
          <td className="py-2 px-4">1</td>
          <td className="py-2 px-4">3</td>
          <td className="py-2 px-4">-</td>
          <td className="py-2 px-4">-</td>
          <td className="py-2 px-4">-</td>
          <td className="py-2 px-4">-</td>
        </tr>
        <tr className="text-center">
          <td className="py-2 px-4">P50</td>
          <td className="py-2 px-4">2000</td>
          <td className="py-2 px-4">1</td>
          <td className="py-2 px-4">3</td>
          <td className="py-2 px-4">-</td>
          <td className="py-2 px-4">-</td>
          <td className="py-2 px-4">-</td>
          <td className="py-2 px-4">-</td>
        </tr>
        <tr className="text-center">
          <td className="py-2 px-4">P90</td>
          <td className="py-2 px-4">2000</td>
          <td className="py-2 px-4">1</td>
          <td className="py-2 px-4">3</td>
          <td className="py-2 px-4">-</td>
          <td className="py-2 px-4">-</td>
          <td className="py-2 px-4">-</td>
          <td className="py-2 px-4">-</td>
        </tr>
      </tbody>
    </table>
  </div>

              </div>
          

            <div className="col-span-4 ml-auto">
              <h2 className=" font-bold text-gray-400 mb-2">Projection Settings</h2>
              <div className="space-y-1">
                <Label htmlFor="projection-days" className="text-sm">
                  days
                </Label>
                <Input
                  id="projection-days"
                  value={projectionDays}
                  onChange={(e) => setProjectionDays(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-5 pt-4 mt-20">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white w-40 " onClick={handleRunAnalysis}>
              Run Analysis
            </Button>
            <Button  className="w-40" variant="outline">Export</Button>
            <Button  className="w-40" variant="outline">Import</Button>
            <Button  className="w-40" variant="outline">Reset</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium mb-2">Plot</h2>
            <div className="flex gap-2 mb-4">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black flex-1">Rate</Button>
              <Button variant="outline" className="flex-1">
                Cumulative
              </Button>
              <Button variant="outline" className="flex-1">
                Probabilistic
              </Button>
            </div>
            <div className="h-[400px]">
              <p className="text-xs text-center mb-1">Type Well Analysis - Exponential Fits</p>
              <WellProductionChart data={wellData} />
            </div>
          </div>

          <div className="w-100 mx-auto mt-20">
            <h2 className="text-gray-400 font-bold mb-2">Analysis</h2>
            <div className="overflow-x-auto ">
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
        </div>
      </div>
      <ModelParametersModal isOpen={isModelModalOpen} onClose={() => setIsModelModalOpen(false)} />
    </div>
  )
}
