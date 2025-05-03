"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import WellProductionChart from "./well-production-chart";
import OilProductionChart from "../Production/oli-chart/OilProductionChart";
import MuiStyleWellSelect from "./mui-style-well-select";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Header } from "../Header";
import { generateWellData } from "../../libo/generate-data";
import { declineCurveAnalysis, typeWellAnalysis } from "@/api-client/api-client";

export default function TypeWellAnalysis() {
  const router = useRouter();

  // raw well history
  const [wellData, setWellData] = useState([]);

  // selected ARPS model
  const [selectedModel, setSelectedModel] = useState("Exponential");

  // table data persisted in localStorage
  const [dataTabel, setdataTabel] = useState(() => {
    const stored = localStorage.getItem("dataTabel");
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem("dataTabel", JSON.stringify(dataTabel));
  }, [dataTabel]);

  // initial params (qi, D, b)
  const [initialParams, setInitialParams] = useState({
    qi: "0",
    D: "0",
    b: "auto",
  });

  // metrics for P10/P50/P90
  const [metrics, setMetrics] = useState({
    P10: { MAE: "0.73", RMSE: "0.95", MAPE: "0.25" },
    P50: { MAE: "0.73", RMSE: "0.95", MAPE: "0.25" },
    P90: { MAE: "0.73", RMSE: "0.95", MAPE: "0.25" },
  });

    const [Parameters, setParameters] = useState({});
    const [Analysis, setAnalysis] = useState({});
    const fields = ["qi","D","b","K","a","n","D_lim","beta"];
  

  // generate dummy well history on mount
  useEffect(() => {
    const data = generateWellData(1000);
    setWellData(data);
  }, []);

  // results from the type‐well API call
  const [results, setResults] = useState(null);

  // selected wells in the MUI selector
  const [selectedWells, setSelectedWells] = useState([
    { value: "SPH-02", label: "SPH-02" },
    { value: "SPH-03", label: "SPH-03" },
    { value: "SPH-04", label: "SPH-04" },
  ]);

  // call your typeWellAnalysis endpoint
  const handleTypeWellAnalysis = async () => {
    const params = {
      selected_wells: selectedWells.map((w) => w.value),
      selected_models: [selectedModel],
    };

    try {
      const data = await typeWellAnalysis(params);
      setResults(data);
      const parameters=data.fitted_parameters[selectedModel]
      const analysis=data.evaluation_metrics[selectedModel]
      setAnalysis(analysis)
      setParameters(parameters)


    } catch (err) {
      console.error("Error fetching type well analysis:", err);
      setResults({ error: "Error fetching type well analysis" });
    }
  };

  // transform percentile curves into an array
  const costData = results?.percentile_curves;
  const convertedData = [];
  if (costData) {
    const maxIndex = Math.max(
      Object.keys(costData.P10).length,
      Object.keys(costData.P50).length,
      Object.keys(costData.P90).length
    );
    for (let i = 0; i < maxIndex; i++) {
      convertedData.push({
        P10: costData.P10[i] ?? null,
        P50: costData.P50[i] ?? null,
        P90: costData.P90[i] ?? null,
      });
    }
  }

  // combine with your persisted table
  const minLen = Math.min(convertedData.length, dataTabel.length);
  const combinedData = [];
  for (let i = 0; i < minLen; i++) {
    combinedData.push({
      ...convertedData[i],
      ...dataTabel[i],
    });
  }

  console.log('====================================');
  console.log(Analysis);
  console.log('====================================');

  const handleRunAnalysis = () => {
    handleTypeWellAnalysis();
  };

  return (
    <div className="container mx-auto px-4">
      <Header title="Type Well Analysis" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-6">
          {/* Well Select */}
          <div>
            <h2 className="text-sm font-medium mb-2">Well Select</h2>
            <MuiStyleWellSelect
              selectedWells={selectedWells}
              setSelectedWells={setSelectedWells}
            />
          </div>

          {/* Model Selection */}
          <div>
            <h2 className="text-sm font-medium mb-2">Model Selection</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Exponential",
                "Hyperbolic",
                "Harmonic",
                "StretchedExp",
                "Logistic",
                "ModifiedDCA",
                "PowerLaw",
              ].map((m) => (
                <div key={m} className="flex items-center space-x-2">
                  <Checkbox
                    id={m}
                    checked={selectedModel === m}
                    onCheckedChange={() => setSelectedModel(m)}
                  />
                  <Label htmlFor={m} className="text-sm">
                    {m === "StretchedExp"
                      ? "Extended Exponential"
                      : m === "ModifiedDCA"
                      ? "Modified DCA (Transition Decline Rate)"
                      : m === "Exponential"
                      ? "ARPS: Exponential"
                      : m}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Initial Parameters */}
          <div>
            <h2 className="text-sm font-medium mb-2">Initial Parameters</h2>
            <div className="grid grid-cols-3 gap-4">
              {["qi", "D", "b"].map((key) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key} className="text-sm">
                    {key}
                  </Label>
                  <Input
                    id={key}
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

          {/* Optimal Parameters Table */}
          <div>
            <p className="text-sm font-medium mb-2">Optimal Parameters</p>
            <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-center">#</th>
            {fields.map(f => (
              <th key={f} className="py-2 px-4 text-center">{f}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(Parameters).map(([pct, vals]) => (
            <tr key={pct} className="text-center border-b">
              {/* first column: P10, P50, P90 */}
              <td className="py-2 px-4 font-medium">{pct}</td>
              {/* data columns */}
              {fields.map(f => (
                <td key={f} className="py-2 px-4">
                  {vals[f] !== undefined 
                    ? vals[f].toFixed(3) 
                    : "–" }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-5 pt-4 mt-20">
            <Button
              className="bg-gray-800 hover:bg-gray-700 text-white w-40"
              onClick={handleRunAnalysis}
            >
              Run Analysis
            </Button>
            <Button className="w-40" variant="outline">
              Export
            </Button>
            <Button className="w-40" variant="outline">
              Import
            </Button>
            <Button className="w-40" variant="outline">
              Reset
            </Button>
          </div>
        </div>

        {/* Right Pane: Plots & Analysis */}
        <div className="space-y-6">
          {/* Tabs for History / Result */}
          <div>
            <h2 className="text-sm font-medium mb-2">Plot</h2>
            <Tabs defaultValue="history">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="result">Result</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="pt-4">
                <div className="h-[400px]">
                  <WellProductionChart
                    data={combinedData}
                    title="Well Histories with Percentiles"
                  />
                </div>
              </TabsContent>
              <TabsContent value="result" className="pt-4">
                <div className="h-[400px]">
                  <OilProductionChart dataTabel={[]} filterData={false} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Metrics Table */}
          <div className="w-100 ml-20">
            <h2 className="text-gray-400 font-bold mb-2">Analysis</h2>
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
          {["P10", "P50", "P90"].map((p) => (
            <tr key={p} className="border-b">
              <td className="py-2 px-4">{p}</td>
              <td className="py-2 px-4">
                {Analysis[p]?.MAE?.toFixed(2)}
              </td>
              <td className="py-2 px-4">
                {Analysis[p]?.RMSE?.toFixed(2)}
              </td>
              <td className="py-2 px-4">
                {Analysis[p]?.MAPE?.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
}