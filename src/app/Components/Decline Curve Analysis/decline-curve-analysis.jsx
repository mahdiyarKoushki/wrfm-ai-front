"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Settings, BarChart2, LineChart } from "lucide-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import ModelParametersModal from "./model-parameters-modal";
import { Header } from "../Header";
import { wells } from "../Well Analysis/mui-style-well-select";
import { declineCurveAnalysis } from "@/api-client/api-client";
import WellProductionChart from "./well-production-chart";
import WellProductionChart2 from "../Well Analysis/well-production-chart";
import { generateWellData } from "../../libo/generate-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CustomLineChart from "./CustomLineChart";
import useWellStore from "@/store/zustandState";
import ProbabilisticChart from "./ProbabilisticChart";

export default function DeclineCurveAnalysis() {
  const router = useRouter();

  const { well } = useWellStore();

  const [wellData, setWellData] = useState([]);
  const [selectedModel, setSelectedModel] = useState("Exponential");
  const [initialParams, setInitialParams] = useState({
    qi: "0",
    D: "0",
    b: "auto",
  });
  const [projectionDays, setProjectionDays] = useState("180");
  const [metrics, setMetrics] = useState({
    MAE: 0.00,
    RMSE: 0.00,
    MAPE: 0.00,
  });
  const [Parameters, setParameters] = useState({});
  const [dataRateChart, setdataRateChart] = useState({forecast:{},history:{}});
  const [dataCumulativeChart, setdataCumulativeChart] = useState({forecast:{},history:{}});
  const [dataProbabilisticChart, setdataProbabilisticChart] = useState({});
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [results, setResults] = useState(null);







  const handleCompareModels = () => {
    setIsModelModalOpen(true);
  };

  const handleDeclineAnalysis = async () => {
    const params = {
      forecast_days: Number(projectionDays),
      selected_wells: [well],
      selected_models: [selectedModel],
    };

    try {
      const data = await declineCurveAnalysis(params);
      setResults(data);
      setMetrics(data?.data[well].models[selectedModel].errors_rate_historical)
      setParameters(data?.data[well].models[selectedModel].parameters)
  
      setdataRateChart(
        {
          forecast:data?.data[well].models[selectedModel].forecast_rate,
        history:data?.data[well].historical_data_rate,
        historical_fitted_rate:data?.data[well].models[selectedModel].historical_fitted_rate,
      })
      setdataCumulativeChart(
        {
          forecast:data?.data[well].models[selectedModel].forecast_cumulative,
          history:data?.data[well].historical_data_cumulative,
          historical_fitted_rate: data?.data[well].historical_data_cumulative
        })
      // historical_fitted_rate
      const probabilistic= data?.data[well].models[selectedModel].probabilistic_forecast_rate
  //     const convertProbabilistic = Object.keys(probabilistic.P10)              // ["1.0","2.0",…, "728.0"]
  // .sort((a,b)=>parseFloat(a)-parseFloat(b))        // ensure numeric order
  // .map(k => ({
  //   P10: probabilistic.P10[k],
  //   P50: probabilistic.P50[k],
  //   P90: probabilistic.P90[k]
  // }));
const historical_data_rate= data?.data[well].historical_data_rate
const historical_fitted_rate=data?.data[well].models[selectedModel].historical_fitted_rate

      setdataProbabilisticChart({
          P10:probabilistic.P10,
          P50:probabilistic.P50,
          P90:probabilistic.P90,
          historical_data_rate,
          historical_fitted_rate
      })

    } catch (error) {
      console.error("An error occurred:", error);
      setResults({ error: "Error fetching decline curve analysis" });
    }
  };

  const handleRunAnalysis = () => {
    handleDeclineAnalysis();
  };
// const parameters= results[s].models selectedModel




  return (
    <div className="container mx-auto px-4">
      <Header rout="/Prediction" title="Decline Curve Analysis" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/** Left panel */}
        <div className="space-y-6">
          {/** Well selector */}
          {/* <div>
            <h2 className=" font-bold mb-2">Well Name</h2>
            <FormControl sx={{ minWidth: 200, mt: "5px" }} size="small">
              <Select value={well} onChange={handleWellChange}>
                {wells.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div> */}

          {/** Model selection */}
          <div className="mb-10">
            <h2 className=" font-bold mb-2">Model Selection</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "Exponential", label: "ARPS: Exponential" },
                { id: "Hyperbolic", label: "ARPS: Hyperbolic" },
                { id: "Harmonic", label: "ARPS: Harmonic" },
                { id: "StretchedExp", label: "Extended Exponential" },
                { id: "Logistic", label: "Logistic Growth Model" },
                { id: "ModifiedDCA", label: "Modified DCA (Transition Decline Rate)" },
                { id: "PowerLaw", label: "Power Law" },
              ].map((mdl) => (
                <div key={mdl.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={mdl.id}
                    checked={selectedModel === mdl.id}
                    onCheckedChange={() => setSelectedModel(mdl.id)}
                  />
                  <Label htmlFor={mdl.id} className="text-sm">
                    {mdl.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/** Compare models button */}

          <div className="mb-10">
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

          {/** Initial parameters inputs */}
          {/* <div className="grid grid-cols-1 gap-6">
            <div>
              <h2 className="text-gray-400 font-bold mb-2">
                Initial Parameters
              </h2>
              <div className="grid grid-cols-4 gap-x-10">
                {["qi", "D", "b"].map((key) => (
                  <div key={key} className="space-y-1">
                    <Label  htmlFor={`initial-${key}`} className="text-sm text-gray-300">
                      {key}
                    </Label>
                    <Input 
                    disabled
                      id={`initial-${key}`}
                      value={initialParams[key]}
                      onChange={(e) =>
                        setInitialParams({
                          ...initialParams,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/** Optimal parameters table (static placeholder) */}
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-8">
              <h2 className="text-gray-400 font-bold mb-5">
                Optimal Parameters
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {[
                       
                        "qi",
                        "D",
                        "b",
                        "K",
                        "a",
                        "n",
                        "D_lim",
                        "beta",
                      ].map((h) => (
                        <th key={h} className="py-2 px-4 text-center">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                   
                      <tr className="text-center">
                 
                        <td className="py-2 px-4">{Parameters?.qi ? Parameters.qi.toFixed(3) : "-"}</td>
                        <td className="py-2 px-4">{Parameters?.D ?Parameters?.D.toFixed(3): "-"}</td>
                        <td className="py-2 px-4">{Parameters?.b ?Parameters?.b.toFixed(3): "-"}</td>
                        <td className="py-2 px-4">{Parameters?.K ?Parameters?.K.toFixed(3): "-"}</td>
                        <td className="py-2 px-4">{Parameters?.a ?Parameters?.a.toFixed(3): "-"}</td>
                        <td className="py-2 px-4">{Parameters?.n ?Parameters?.n.toFixed(3) : "-"}</td>
                        <td className="py-2 px-4">{Parameters?.D_lim ?Parameters?.D_lim.toFixed(3): "-"}</td>
                        <td className="py-2 px-4">{Parameters?.beta ? Parameters?.beta.toFixed(3): "-"}</td>
                      
                      </tr>
                   
                  </tbody>
                </table>
              </div>
            </div>

            {/** Projection settings */}
            <div className="col-span-4">
              <h2 className="font-bold text-gray-400 mb-2">
                Projection Settings
              </h2>
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

          {/** Action buttons */}
          <div className="flex gap-5 pt-4 mt-20">
            <Button
              className="bg-gray-800 hover:bg-gray-700 text-white w-40"
              onClick={handleRunAnalysis}
            >
              Run Analysis
            </Button>
            <Button variant="outline" className="w-40">
              Export
            </Button>
            <Button variant="outline" className="w-40">
              Import
            </Button>
            {/* <Button variant="outline" className="w-40">
              Reset
            </Button> */}
          </div>
        </div>

        {/** Right panel */}
        <div className="space-y-6">
          <div>
            <h2 className="text-gray-400 font-bold mb-2">Plot</h2>
             <Tabs defaultValue="Rate">
                          <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value="Rate">Rate</TabsTrigger>
                            <TabsTrigger value="Cumulative">Cumulative</TabsTrigger>
                            <TabsTrigger value="Probabilistic">Probabilistic</TabsTrigger>
                          </TabsList>
                          <TabsContent value="Rate" className="pt-4">
                         
                            <div className="h-[400px]">
                          
                            <CustomLineChart data={dataRateChart} />
            
                            </div>
                          </TabsContent>
                          <TabsContent value="Cumulative" className="pt-4">
                         
                            <div className="h-[400px]">

                            <CustomLineChart data={dataCumulativeChart} />
            
                            </div>
                          </TabsContent>
                          <TabsContent value="Probabilistic" className="pt-4">
                         
                            <div className="h-[400px]">
                             <ProbabilisticChart data={dataProbabilisticChart}  title=""/>
            
                            </div>
                          </TabsContent>
                        
                        </Tabs>

          </div>

          <div className="w-100 mx-auto mt-20">
            <h2 className="text-gray-400 font-bold mb-2">Analysis</h2>
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
                    <td className="py-2 px-4 text-center">
                      {metrics?.MAE?.toFixed(3)}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {metrics?.RMSE?.toFixed(3)}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {metrics?.MAPE?.toFixed(3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ModelParametersModal
        isOpen={isModelModalOpen}
         days={projectionDays}
        onClose={() => setIsModelModalOpen(false)}
      />
    </div>
  );
}