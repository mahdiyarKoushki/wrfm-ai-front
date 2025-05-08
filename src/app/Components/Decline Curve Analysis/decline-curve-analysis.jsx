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
import { Tooltip as ReactTooltip } from "react-tooltip"; // Import react-tooltip

const MODELS = [
  { id: "Exponential", label: "ARPS: Exponential" },
  { id: "Hyperbolic", label: "ARPS: Hyperbolic" },
  { id: "Harmonic", label: "ARPS: Harmonic" },
  { id: "StretchedExp", label: "Extended Exponential" },
  { id: "Logistic", label: "Logistic Growth Model" },
  { id: "ModifiedDCA", label: "Modified DCA (Transition Decline Rate)" },
  { id: "PowerLaw", label: "Power Law" },
];

const OPTIMAL_PARAMETERS = ["qi", "D","Di", "b", "K", "a", "n", "D_lim", "beta"];

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

export default function DeclineCurveAnalysis() {
  const router = useRouter();
  const { well } = useWellStore();

  // State management
  const [selectedModel, setSelectedModel] = useState("Exponential");
  const [projectionDays, setProjectionDays] = useState("180");
  const [metrics, setMetrics] = useState({ MAE: 0, RMSE: 0, MAPE: 0 });
  const [parameters, setParameters] = useState({});
  const [dataRateChart, setDataRateChart] = useState({ forecast: {}, history: {} });
  const [dataCumulativeChart, setDataCumulativeChart] = useState({ forecast: {}, history: {} });
  const [dataProbabilisticChart, setDataProbabilisticChart] = useState({});
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  // Fetch and process decline curve analysis
  const handleDeclineAnalysis = async () => {
    const params = {
      forecast_days: Number(projectionDays),
      selected_wells: [well],
      selected_models: [selectedModel],
    };

    try {
      const data = await declineCurveAnalysis(params);
      setMetrics(data?.data[well].models[selectedModel].errors_rate_historical);
      setParameters(data?.data[well].models[selectedModel].parameters);

      setDataRateChart({
        forecast: data?.data[well].models[selectedModel].forecast_rate,
        history: data?.data[well].historical_data_rate,
        historicalFittedRate: data?.data[well].models[selectedModel].historical_fitted_rate,
      });

      setDataCumulativeChart({
        forecast: data?.data[well].models[selectedModel].forecast_cumulative,
        history: data?.data[well].historical_data_cumulative,
        historicalFittedRate: data?.data[well].historical_data_cumulative,
      });

      const probabilistic = data?.data[well].models[selectedModel].probabilistic_forecast_rate;
      setDataProbabilisticChart({
        P10: probabilistic.P10,
        P50: probabilistic.P50,
        P90: probabilistic.P90,
        historical_data_rate: data?.data[well].historical_data_rate,
        historical_fitted_rate: data?.data[well].models[selectedModel].historical_fitted_rate,
      });
    } catch (error) {
      console.error("Error fetching decline curve analysis:", error);
    }
  };

  return (
    <div className="mx-auto px-10 bg-[#0F0F0F] min-h-screen text-gray-100">
      <Header rout="/Prediction" title="Decline Curve Analysis" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel */}
        <div className="space-y-15 bg-[#262626] p-5 rounded-xl">
          {/* Model Selection */}
          <div>
            <h2 className="font-bold text-gray-300 mb-2">Model Selection</h2>
            <div className="grid grid-cols-2 gap-2">
              {MODELS.map((model) => (
                <div key={model.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={model.id}
                    checked={selectedModel === model.id}
                    onCheckedChange={() => setSelectedModel(model.id)}
                    className="border-gray-600"
                  />
                  <Label htmlFor={model.id} className="text-sm text-gray-300">
                    {model.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Compare Models Button */}
          <Button
            onClick={() => setIsModelModalOpen(true)}
            variant="outline"
            size="sm"
            className="h-8 bg-[#AC7D0C] border-0 hover:bg-[#0f0f0f]"
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            Compare Models
          </Button>

          {/* Optimal Parameters Table */}
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-8">
              <h2 className="font-bold text-gray-300 mb-5">Optimal Parameters</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-[#0f0f0f]">
                  <thead>
                    <tr className="bg-[#AC7D0C]">
                      {OPTIMAL_PARAMETERS.map((param) => (
                        <th
                          key={param}
                          className="py-2 px-4 text-center text-gray-200"
                          data-tooltip-id="param-tooltip"
                          data-tooltip-content={PARAMETER_TOOLTIPS[param] || param}
                        >
                          {param}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      {OPTIMAL_PARAMETERS.map((param) => (
                        <td key={param} className="py-2 px-4 text-gray-300">
                          {parameters?.[param] ? parameters[param].toFixed(3) : "-"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                {/* Add ReactTooltip component */}
                <ReactTooltip
  id="param-tooltip"
  place="top"
  effect="solid"
  style={{ backgroundColor: "#4B4B4B", color: "#fff", fontSize: "12px", padding: "8px", borderRadius: "4px" }}
/>
              </div>
            </div>

            {/* Projection Settings */}
            <div className="col-span-4">
              <h2 className="font-bold text-gray-300 mb-2">Projection Settings</h2>
              <div className="space-y-1">
                <Label htmlFor="projection-days" className="text-sm text-gray-300">
                  Days
                </Label>
                <Input
                  id="projection-days"
                  value={projectionDays}
                  onChange={(e) => setProjectionDays(e.target.value)}
                  className="bg-[#0F0F0F] border-gray-600 text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-5 pt-4">
            <Button
              onClick={handleDeclineAnalysis}
              className="bg-[#AC7D0C] hover:bg-gray-600 text-white w-40"
            >
              Run Analysis
            </Button>
            <Button
              variant="outline"
              className="w-40 bg-[#0F0F0F] border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Export
            </Button>
            <Button
              variant="outline"
              className="w-40 bg-[#0F0F0F] border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Import
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6 bg-[#262626] p-5">
          {/* Plot Section */}
          <div>
            <h2 className="font-bold text-gray-300 mb-2">Plot</h2>
            <Tabs defaultValue="Rate" className="rounded-md">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger
                  value="Rate"
                  className="text-gray-400 data-[state=active]:text-[#ac7d0c] data-[state=active]:border-b-2 data-[state=active]:border-[#ac7d0c] rounded-none"
                >
                  Rate
                </TabsTrigger>
                <TabsTrigger
                  value="Cumulative"
                  className="text-gray-400 data-[state=active]:text-[#ac7d0c] data-[state=active]:border-b-2 data-[state=active]:border-[#ac7d0c] rounded-none"
                >
                  Cumulative
                </TabsTrigger>
                <TabsTrigger
                  value="Probabilistic"
                  className="text-gray-400 data-[state=active]:text-[#ac7d0c] data-[state=active]:border-b-2 data-[state=active]:border-[#ac7d0c] rounded-none"
                >
                  Probabilistic
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Rate" className="pt-4">
                <div className="h-[380px]">
                  <CustomLineChart data={dataRateChart} />
                </div>
              </TabsContent>
              <TabsContent value="Cumulative" className="pt-4">
                <div className="h-[380px]">
                  <CustomLineChart data={dataCumulativeChart} />
                </div>
              </TabsContent>
              <TabsContent value="Probabilistic" className="pt-4">
                <div className="h-[380px]">
                  <ProbabilisticChart data={dataProbabilisticChart} title="" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Analysis Metrics */}
          <div className="mt-30">
            <h2 className="font-bold text-gray-300 mb-2">Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-gray-800">
                <thead>
                  <tr className="bg-[#AC7D0C] text-white">
                    <th className="py-2 px-4 text-center">MAE</th>
                    <th className="py-2 px-4 text-center">RMSE</th>
                    <th className="py-2 px-4 text-center">MAPE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td className="py-2 px-4 text-gray-300">{metrics?.MAE?.toFixed(3)}</td>
                    <td className="py-2 px-4 text-gray-300">{metrics?.RMSE?.toFixed(3)}</td>
                    <td className="py-2 px-4 text-gray-300">{metrics?.MAPE?.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Model Parameters Modal */}
      <ModelParametersModal
        isOpen={isModelModalOpen}
        days={projectionDays}
        onClose={() => setIsModelModalOpen(false)}
      />
    </div>
  );
}