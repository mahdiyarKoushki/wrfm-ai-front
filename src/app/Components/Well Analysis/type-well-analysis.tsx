"use client"

interface CostData {
  P10: { [key: string]: number };
  P50: { [key: string]: number };
  P90: { [key: string]: number };
}

interface ConvertedEntry {
  P10: number | null;
  P50: number | null;
  P90: number | null;
}

interface ConvertedDataEntry {
  P10: number | null;
  P50: number | null;
  P90: number | null;
}

interface DataTabelEntry {
  Date: string;
  Choke: number | string;
  BSTP: number | string;
  WHP: number | string | null;
  Oil: number | string;
}

type CombinedEntry = ConvertedDataEntry & DataTabelEntry;


import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import WellProductionChart from "./well-production-chart"
import { generateWellData } from "../../libo/generate-data"
import MuiStyleWellSelect, { Well } from "./mui-style-well-select"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { Header } from "../Header"
import { Checkbox } from "../ui/checkbox"
import OilProductionChart from "../Production/oli-chart/OilProductionChart"
import { declineCurveAnalysis, DeclineCurveParams, typeWellAnalysis, TypeWellParams } from "@/api-client/api-client"

export default function TypeWellAnalysis() {
  const router = useRouter()
  const [wellData, setWellData] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState("Exponential")
  const [dataTabel, setdataTabel] = useState<any[]>(() => {
    const storedTableData = localStorage.getItem("dataTabel");
    return storedTableData ? JSON.parse(storedTableData) : [];
  });
  useEffect(() => {
    localStorage.setItem("dataTabel", JSON.stringify(dataTabel));
  }, [dataTabel]);


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

 
  const [selectedWells, setSelectedWells] = useState<Well[]>([
    { value: "SPH-02", label: "SPH-02" },
    { value: "SPH-03", label: "SPH-03" },
    { value: "SPH-04", label: "SPH-04" },
  ])

  const handleTypeWellAnalysis = async () => {
    const params: TypeWellParams = {
      selected_wells: selectedWells.map(item=>item.value),
      selected_models: [selectedModel]
    };

    try {
      const data = await typeWellAnalysis(params);
      setResults(data);
    } catch (error) {
      console.error('An error occurred:', error);
      setResults('Error fetching type well analysis');
    }
  };

console.log(results?.percentile_curves );
const costData: CostData =results?.percentile_curves
const convertedData: ConvertedEntry[] = [];


if (costData) {
  const maxIndex = Math.max(
    Object.keys(costData?.P10).length,
    Object.keys(costData?.P50).length,
    Object.keys(costData?.P90).length
  );
  
  // Loop through each index to create an entry
  for (let i = 0; i < maxIndex; i++) {
    const entry: ConvertedEntry = {
      P10: costData?.P10[String(i)] ?? null,
      P50: costData?.P50[String(i)] ?? null,
      P90: costData?.P90[String(i)] ?? null,
    };
    convertedData.push(entry);
  }
  
  
}




const minLength = Math.min(convertedData.length, dataTabel.length);

// Combine the arrays using the minimum length to avoid index out of bounds
const combinedData: CombinedEntry[] = [];

for (let i = 0; i < minLength; i++) {
  combinedData.push({
    ...convertedData[i],
    ...dataTabel[i],
  });
}

console.log(combinedData);


  const handleRunAnalysis = () => {
    // Simulate analysis by updating optimal parameters
    // setOptimalParams({
    //   qi: "0.1",
    //   D: "0",
    //   b: "3",
    // })
    handleTypeWellAnalysis()
  }
  

  return (
    <div className="container mx-auto  px-4">
     
       <Header title={"Type Well Analysis"}/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium mb-2">Well Select</h2>
            <MuiStyleWellSelect selectedWells={selectedWells} setSelectedWells={setSelectedWells} />
          </div>

          <div>
            <h2 className="text-sm font-medium mb-2">Model Selection</h2>
  
          
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="Exponential"
                  checked={selectedModel === "Exponential"}
                  onCheckedChange={() => setSelectedModel("Exponential")}
                />
                <Label htmlFor="Exponential" className="text-sm">
                  ARPS: Exponential
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
                  id="StretchedExp"
                  checked={selectedModel === "StretchedExp"}
                  onCheckedChange={() => setSelectedModel("StretchedExp")}
                />
                <Label htmlFor="StretchedExp" className="text-sm">
                Extended Exponential
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="Logistic"
                  checked={selectedModel === "Logistic"}
                  onCheckedChange={() => setSelectedModel("Logistic")}
                />
                <Label htmlFor="Logistic" className="text-sm">
                  Logistic Growth Model
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="modified"
                  checked={selectedModel === "ModifiedDCA"}
                  onCheckedChange={() => setSelectedModel("ModifiedDCA")}
                />
                <Label htmlFor="ModifiedDCA" className="text-sm">
                  Modified DCA (Transition Decline Rate)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PowerLaw"
                  checked={selectedModel === "PowerLaw"}
                  onCheckedChange={() => setSelectedModel("PowerLaw")}
                />
                <Label htmlFor="PowerLaw" className="text-sm">
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
                <WellProductionChart data={combinedData}  title="Well Histories with Percentiles"/>

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
