"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import WellProductionChart from "./well-production-chart";
import MultiChart from "./multiChart";
import MuiStyleWellSelect from "./mui-style-well-select";
import { Header } from "../Header";
import { generateWellData } from "../../libo/generate-data";
import { typeWellAnalysis } from "@/api-client/api-client";
import { Tooltip as ReactTooltip } from "react-tooltip"; // Import react-tooltip

const fields = ["qi", "D","Di", "b", "K", "a", "n", "D_lim", "beta"];
const models = [
  "Exponential",
  "Hyperbolic",
  "Harmonic",
  "StretchedExp",
  "Logistic",
  "ModifiedDCA",
  "PowerLaw",
];

// Define tooltip content for each parameter
const PARAMETER_TOOLTIPS = {
  qi: "Initial Rate",
  D: "Decline Rate",
  Di: "Initial Decline Rate",
  b: "Constant",
  K: "Carrying Capacity",
  a: "Growth Rate Constant",
  n: "Hyperbolic Exponent",
  D_lim: "Minimum Decline Limit",
  beta: "Stretching Exponent",
};

export default function TypeWellAnalysis() {
  const router = useRouter();

  // State Management
  const [wellData, setWellData] = useState([]);
  const [selectedModel, setSelectedModel] = useState("Exponential");
  const [selectedWells, setSelectedWells] = useState([
    { value: "SPH-02", label: "SPH-02" },
    { value: "SPH-03", label: "SPH-03" },
    { value: "SPH-04", label: "SPH-04" },
  ]);
  const [results, setResults] = useState(null);
  const [parameters, setParameters] = useState({});
  const [analysis, setAnalysis] = useState({});
  const [dataResultChart, setDataResultChart] = useState([]);
  const [dataHistoryChart, setDataHistoryChart] = useState([]);

  // Generate dummy well data on mount
  useEffect(() => {
    setWellData(generateWellData(1000));
  }, []);

  // Handle Type Well Analysis API call
  const handleTypeWellAnalysis = async () => {
    const params = {
      selected_wells: selectedWells.map((w) => w.value),
      selected_models: [selectedModel],
    };

    try {
      const data = await typeWellAnalysis(params);
      setResults(data);

      // Update state with API response
      setParameters(data.fitted_parameters[selectedModel]);
      setAnalysis(data.evaluation_metrics[selectedModel]);

      // Transform probabilistic data
      const probabilistic = data.fitted_data_points[selectedModel];
      const percentileCurves = data.percentile_curves;
      const convertProbabilistic = Object.keys(probabilistic.P10)
        .sort((a, b) => parseFloat(a) - parseFloat(b))
        .map((k) => ({
          P10: probabilistic.P10[k],
          P50: probabilistic.P50[k],
          P90: probabilistic.P90[k],
          G10: percentileCurves.P10[k],
          G50: percentileCurves.P50[k],
          G90: percentileCurves.P90[k],
        }));

      setDataResultChart(convertProbabilistic);

      // Transform individual well history
      const individualWellHistory = data.individual_well_history_dict;
      const firstKey = Object.keys(individualWellHistory)[0];
      const numberOfItems = Object.keys(individualWellHistory[firstKey]).length;
      const transformedData = Array.from({ length: numberOfItems }, (_, i) => {
        const entry = {};
        for (const key in individualWellHistory) {
          if (individualWellHistory[key].hasOwnProperty(i.toString())) {
            entry[key] = individualWellHistory[key][i.toString()];
          }
        }
        return entry;
      });

      // Merge with probabilistic data
      const convertProbabilistic2 = Object.keys(probabilistic.P10)
        .sort((a, b) => parseFloat(a) - parseFloat(b))
        .map((k) => ({
          P10: probabilistic.P10[k],
          P50: probabilistic.P50[k],
          P90: probabilistic.P90[k],
        }));

      const maxLength = Math.max(transformedData.length, convertProbabilistic2.length);
      const mergedArray = Array.from({ length: maxLength }, (_, i) => ({
        ...(i < transformedData.length ? transformedData[i] : {}),
        ...(i < convertProbabilistic2.length ? convertProbabilistic2[i] : {}),
      }));

      setDataHistoryChart(mergedArray);
    } catch (err) {
      console.error("Error fetching type well analysis:", err);
      setResults({ error: "Error fetching type well analysis" });
    }
  };

  // Transform percentile Illumina curves for display
  const convertedData = results?.percentile_curves
    ? Array.from(
        {
          length: Math.max(
            Object.keys(results.percentile_curves.P10).length,
            Object.keys(results.percentile_curves.P50).length,
            Object.keys(results.percentile_curves.P90).length
          ),
        },
        (_, i) => ({
          P10: results.percentile_curves.P10[i] ?? null,
          P50: results.percentile_curves.P50[i] ?? null,
  P90: results.percentile_curves.P90[i] ?? null,
        })
      )
    : [];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-gray-100 p-6 ">
      <Header rout="/Prediction" title="Type Well Analysis" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Pane: Controls */}
        <div className=" bg-[#262626] p-5 rounded-xl flex flex-col space-y-15">
          {/* Well Select */}
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-4">Well Select</h2>
            <MuiStyleWellSelect
              selectedWells={selectedWells}
              setSelectedWells={setSelectedWells}
            />
          </div>

          {/* Model Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Model Selection</h2>
            <div className="grid grid-cols-2 gap-2">
              {models.map((model) => (
                <div key={model} className="flex items-center space-x-2">
                  <Checkbox
                    id={model}
                    checked={selectedModel === model}
                    onCheckedChange={() => setSelectedModel(model)}
                    className="border-gray-600"
                  />
                  <Label htmlFor={model} className="text-sm text-gray-400">
                    {model === "StretchedExp"
                      ? "Extended Exponential"
                      : model === "ModifiedDCA"
                      ? "Modified DCA"
                      : model === "Exponential"
                      ? "ARPS: Exponential"
                      : model}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Optimal Parameters Table */}
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-5">Optimal Parameters</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full bg-gray-950">
                <thead>
                  <tr className="bg-[#AC7D0C]">
                    <th className="py-2 px-4 text-center text-gray-300">#</th>
                    {fields.map((field) => (
                      <th
                        key={field}
                        className="py-2 px-4 text-center text-gray-300"
                        data-tooltip-id="param-tooltip"
                        data-tooltip-content={PARAMETER_TOOLTIPS[field] || field}
                      >
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(parameters).map(([percentile, values]) => (
                    <tr key={percentile} className="border-t border-gray-700">
                      <td className="py-2 px-4 text-center text-gray-300">{percentile}</td>
                      {fields.map((field) => (
                        <td key={field} className="py-2 px-4 text-center text-gray-400">
                          {values[field] !== undefined ? values[field].toFixed(3) : "–"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Add ReactTooltip component with brighter background */}
              <ReactTooltip
                id="param-tooltip"
                place="top"
                effect="solid"
                style={{
                  backgroundColor: "#4B4B4B",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              className="bg-[#AC7D0C] text-white w-40"
              onClick={handleTypeWellAnalysis}
            >
              Run Analysis
            </Button>
            <Button className="w-40 bg-gray-950 text-gray-300 border-gray-600">
              Export
            </Button>
            <Button className="w-40 bg-gray-950 text-gray-300 border-gray-600">
              Import
            </Button>
          </div>
        </div>

        {/* Right Pane: Plots & Analysis */}
        <div style={{ boxSizing: "border-box" }} className="space-y-6 bg-[#262626] p-5 box-border rounded-xl">
          {/* Plot Tabs */}
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Plot</h2>
            <Tabs defaultValue="history" className="">
              <TabsList className="w-full grid grid-cols-2 ">
                <TabsTrigger
                  value="history"
                  className="text-gray-400 data-[state=active]:text-[#ac7d0c] data-[state=active]:border-b-2 data-[state=active]:border-[#ac7d0c] rounded-none"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="result"
                  className="text-gray-400 data-[state=active]:text-[#ac7d0c] data-[state=active]:border-b-2 data-[state=active]:border-[#ac7d0c] rounded-none"
                >
                  Result
                </TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="pt-4">
                <div className="h-[390px]">
                  <WellProductionChart
                    data={dataHistoryChart}
                    title="Well Histories with Percentiles"
                  />
                </div>
              </TabsContent>
              <TabsContent value="result" className="pt-4">
                <div className="h-[390px]">
                  <MultiChart selectedModel={selectedModel} data={dataResultChart} title="" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Metrics Table */}
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Analysis</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full bg-gray-950">
                <thead>
                  <tr className="bg-[#AC7D0C] text-white">
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">MAE</th>
                    <th className="py-2 px-4 text-left">RMSE</th>
                    <th className="py-2 px-4 text-left">MAPE</th>
                  </tr>
                </thead>
                <tbody>
                  {["P10", "P50", "P90"].map((percentile) => (
                    <tr key={percentile} className="border-t border-gray-700">
                      <td className="py-2 px-4 text-gray-300">{percentile}</td>
                      <td className="py-2 px-4 text-gray-400">
                        {analysis[percentile]?.MAE?.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-gray-400">
                        {analysis[percentile]?.RMSE?.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-gray-400">
                        {analysis[percentile]?.MAPE?.toFixed(2)}%
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