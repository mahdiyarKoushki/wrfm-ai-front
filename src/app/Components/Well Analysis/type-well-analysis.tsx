"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import WellProductionChart from "./well-production-chart"
import { generateWellData } from "../../libo/generate-data"
import MuiStyleWellSelect from "./mui-style-well-select"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { Header } from "../Header"
import { Checkbox } from "../ui/checkbox"
import OilProductionChart from "../Production/oli-chart/OilProductionChart"
import { declineCurveAnalysis, DeclineCurveParams, typeWellAnalysis, TypeWellParams } from "@/api-client/api-client"

export default function TypeWellAnalysis() {
  const router = useRouter()
  const [wellData, setWellData] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState("exponential")


  // const toggleModel = (model: keyof typeof selectedModels) => {
  //   setSelectedModels({
  //     ...selectedModels,
  //     [model]: !selectedModels[model],
  //   })
  // }
  const [initialParams, setInitialParams] = useState({
    qi: "0",
    D: "0",
    b: "auto",
  })
  const [optimalParams, setOptimalParams] = useState({
    qi: "0.1",
    D: "0",
    b: "3",
  })
  const [metrics, setMetrics] = useState({
    P10: { MAE: "0.73", RMSE: "0.95", MAPE: "0.25" },
    P50: { MAE: "0.73", RMSE: "0.95", MAPE: "0.25" },
    P90: { MAE: "0.73", RMSE: "0.95", MAPE: "0.25" },
  })

  useEffect(() => {
    // Generate 1000 data points for well production
    const data = generateWellData(1000)
    setWellData(data)
  }, [])


  const [results, setResults] = useState<any>(null);

  const handleDeclineCurveAnalysis = async () => {
    const params: DeclineCurveParams = {
      excel_file: `D:\wrfm-api\Models\Well_Production_Data.xlsx`, // Replace with your actual file path
      selected_wells: ['SPH-02', 'SPH-03'], // Example well list
      forecast_days: 180,
      selected_models: ['Exponential', 'Hyperbolic']
    };

    try {
      const data = await declineCurveAnalysis(params);
      setResults(data);
    } catch (error) {
      console.error('An error occurred:', error);
      setResults('Error fetching decline curve analysis');
    }
  };

  const handleTypeWellAnalysis = async () => {
    const params: TypeWellParams = {
      // excel_file: 'D:\\wrfm-api\\Models\\Well_Production_Data.xlsx', // Replace with your actual file path
      selected_wells: ['SPH-02', 'SPH-03','SPH-04'],
      selected_models: ['Exponential', 'Hyperbolic']
    };

    try {
      const data = await typeWellAnalysis(params);
      setResults(data);
    } catch (error) {
      console.error('An error occurred:', error);
      setResults('Error fetching type well analysis');
    }
  };
useEffect(() => {
  handleTypeWellAnalysis()
}, [])
console.log({results});



  const handleRunAnalysis = () => {
    // Simulate analysis by updating optimal parameters
    setOptimalParams({
      qi: "0.1",
      D: "0",
      b: "3",
    })
  }

  return (
    <div className="container mx-auto  px-4">
     
       <Header title={"Type Well Analysis"}/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium mb-2">Well Select</h2>
            <MuiStyleWellSelect />
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
            <h2 className="text-sm font-medium mb-2">Initial Parameters</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="qi" className="text-sm">
                  qi
                </Label>
                <Input
                  id="qi"
                  value={initialParams.qi}
                  onChange={(e) => setInitialParams({ ...initialParams, qi: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="D" className="text-sm">
                  D
                </Label>
                <Input
                  id="D"
                  value={initialParams.D}
                  onChange={(e) => setInitialParams({ ...initialParams, D: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="b" className="text-sm">
                  b
                </Label>
                <Input
                  id="b"
                  value={initialParams.b}
                  onChange={(e) => setInitialParams({ ...initialParams, b: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
          
            <div className="mb-2">
              <p className="text-sm font-medium">Optimal Parameters</p>
            </div>
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

          <div className="flex gap-5 pt-4 mt-20">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white w-40" onClick={handleRunAnalysis}>
              Run Analysis
            </Button>
            <Button className="w-40" variant="outline">Export</Button>
            <Button  className="w-40" variant="outline">Import</Button>
            <Button  className="w-40" variant="outline">Reset</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium mb-2">Plot</h2>
            <Tabs defaultValue="history">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="result">Result</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="pt-4">
             
                <div className="h-[400px]">
                <WellProductionChart data={wellData}  title="Well Histories with Percentiles"/>

                </div>
              </TabsContent>
              <TabsContent value="result" className="pt-4">
                <div className="h-[400px] ">
                <OilProductionChart  dataTabel={[]} filterData={false}/>


                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-100 ml-20">
            <h2 className="text-gray-400 font-bold mb-2  ">Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">MAE</th>
                    <th className="py-2 px-4 text-left">RMSE</th>
                    <th className="py-2 px-4 text-left">MAPE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">P10</td>
                    <td className="py-2 px-4">{metrics.P10.MAE}</td>
                    <td className="py-2 px-4">{metrics.P10.RMSE}</td>
                    <td className="py-2 px-4">{metrics.P10.MAPE}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">P50</td>
                    <td className="py-2 px-4">{metrics.P50.MAE}</td>
                    <td className="py-2 px-4">{metrics.P50.RMSE}</td>
                    <td className="py-2 px-4">{metrics.P50.MAPE}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">P90</td>
                    <td className="py-2 px-4">{metrics.P90.MAE}</td>
                    <td className="py-2 px-4">{metrics.P90.RMSE}</td>
                    <td className="py-2 px-4">{metrics.P90.MAPE}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
