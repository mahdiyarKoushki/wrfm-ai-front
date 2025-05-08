"use client";

import React, { useEffect, useState, CSSProperties } from "react";
import { MoonLoader } from "react-spinners";
import { Header } from "../Header";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { GenerateChartModal } from "../Generate Chart Modal/GenerateChartModal";
import { NewArimaPosts, NewArimaPostsStepTWO, NewArimaXPosts, NewArimaXPostsStepTWO } from "@/api-client/api-client";
import { Slider } from "@mui/material";
import useWellStore from "@/store/zustandState";
import AcfChart from "../Arima/ChartArima";
import { Checkbox } from "../ui/checkbox";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface Parameter {
  name: string;
  from: number;
  to: number;
}

interface ParametersItemProps {
  parameter: Parameter;
  onChange: (name: string, dir: "from" | "to", value: string) => void;
}

const ParametersItem: React.FC<ParametersItemProps> = ({ parameter, onChange }) => (
  <div className="flex items-center justify-between mt-3 space-x-6">
    <Label htmlFor={parameter.name} className="text-sm font-medium">
      {parameter.name}
    </Label>
    <div className="flex items-center space-x-2">
      <span className="text-sm">from</span>
      <Input
        onChange={(e) => onChange(parameter.name, "from", e.target.value)}
        id={`${parameter.name}-from`}
        value={parameter.from}
        className="w-20"
      />
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm">to</span>
      <Input
        onChange={(e) => onChange(parameter.name, "to", e.target.value)}
        id={`${parameter.name}-to`}
        value={parameter.to}
        className="w-20"
      />
    </div>
  </div>
);

interface DataPoint {
  values: number[];
  config: [number, number][];
}

export default function Arima() {
  const [loading, setLoading] = useState<boolean>(false);
  const { well } = useWellStore();
   const [allData, setAllData] = useState<any>({});
  const [rangTrain, setRangTrain] = useState<number>(50); // Changed to number
  const [initialParameters, setInitialParameters] = useState({
    P: { name: "p", from: 0, to: 3 },
    D: { name: "d", from: 0, to: 2 },
    Q: { name: "q", from: 0, to: 3 },
  });
  const [bestModels, setBestModels] = useState<number[]>([0, 0, 0]);
  const [chartACFdata, setChartACFdata] = useState<DataPoint>({ values: [], config: [] });
  const [chartPACFdata, setChartPACFdata] = useState<DataPoint>({ values: [], config: [] });
  const [dataDialogChart, setDataDialogChart] = useState<any>({});
  const [metrics, setMetrics] = useState<any>({});
  const [openChart, setOpenChart] = useState<boolean>(false);
  const [p, setP] = useState<number>(0);
  const [d, setD] = useState<number>(0);
  const [q, setQ] = useState<number>(0);
  const [forecast, setForecast] = useState<number>(20);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const intValue = parseInt(value, 10) || 0;

    switch (id) {
      case "p":
        setP(intValue);
        break;
      case "d":
        setD(intValue);
        break;
      case "q":
        setD(intValue);
        break;
      default:
        break;
    }
  };

  const handleChange = (event: Event, value: number | number[]) => {
    if (typeof value === "number") {
      setRangTrain(value);
    }
  };
  const [selectedModels, setSelectedModels] = useState<any>({
    WHP: true,
    Choke: false,
    // Oil_rate: false,

  })
  const selectedArray = Object.keys(selectedModels).filter(key => selectedModels[key]);

const toggleModel = (model: keyof typeof selectedModels) => {
  setSelectedModels({
    ...selectedModels,
    [model]: !selectedModels[model],
  })
}

  const openModalChart = () => setOpenChart(true);
  const closeChart = () => setOpenChart(false);

  const fetchArimaNew = async (wellName = well) => {
    setLoading(true)
    try {
      const params = {
        well_name: wellName,
        start_p: Number(initialParameters.P.from),
        max_p: Number(initialParameters.P.to),
        d: Number(initialParameters.D.from),
        max_d: Number(initialParameters.D.to),
        start_q: Number(initialParameters.Q.from),
        max_q: Number(initialParameters.Q.to),
        input_features:selectedArray
      };
      const res = await NewArimaXPosts(params)
      setBestModels(res.data.recom_order.recommended_order);
      setChartACFdata({
        config: res.data.acf_pacf_data.acf_data.acf_confint ?? [],
        values: res.data.acf_pacf_data.acf_data.acf_values ?? [],
      });
      setChartPACFdata({
        config: res.data.acf_pacf_data.pacf_data.pacf_confint ?? [],
        values: res.data.acf_pacf_data.pacf_data.pacf_values ?? [],
      });
      setAllData(res.data);

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
const fetchArimaNewTWO = async (wellName = well) => {
    setLoading(true);
    try {
      const params = {
        well_name: well,
        all_vars: allData,
        train_ratio: rangTrain / 100,
        order: `${p},${d},${q}`,
        forecast_horizon: forecast,
      };
      const res = await NewArimaXPostsStepTWO(params);
      const dataChart = {
        Forecasted_Rate: JSON.parse(res.data.metrics_and_data.Forecasted_Rate),
        Predicted_Test: JSON.parse(res.data.metrics_and_data.Predicted_Test),
        Measured_Train: JSON.parse(res.data.metrics_and_data.Measured_Train),
        Measured_Test: JSON.parse(res.data.metrics_and_data.Measured_Test),
        Predicted_Train: JSON.parse(res.data.metrics_and_data.Predicted_Train),
      };
      setMetrics(res.data.metrics_and_data.metrics);
      setDataDialogChart(dataChart);
    } catch (err) {
      console.error("Error fetching ARIMA step two:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArimaNew()
  }, [])

  const handleChangeParameters = (name: string, dir: "from" | "to", value: string) => {
    setInitialParameters((prev: any) => ({
      ...prev,
      [name.toUpperCase()]: {
        ...prev[name.toUpperCase()],
        [dir]: parseInt(value, 10) || 0,
      },
    }));
  };

  useEffect(() => {
    fetchArimaNew();
  }, [well]);

  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-100 px-10">
      <div className="mx-auto w-full">
        {/* Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-gray-900/80 flex flex-col items-center justify-center gap-4">
          <MoonLoader color="#AC7D0C" loading={loading} cssOverride={override} size={100} />
            <h2 className="text-lg font-semibold">Processing Data...</h2>
          </div>
        )}

        {/* Header */}
        <Header rout="/Prediction" title="ARIMA X Algorithm" />

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-5 space-y-6 bg-[#262626] p-5 rounded-xl w-full flex flex-col gap-15">
            {/* First Item */}
            <div className="flex gap-15">
              {/* Parameters Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-400 border-b border-gray-700 pb-2">
                  Parameters
                </h2>
                {Object.values(initialParameters).map((param) => (
                  <ParametersItem
                    key={param.name}
                    parameter={param}
                    onChange={handleChangeParameters}
                  />
                ))}
              </div>

              {/* Hyperparameter Tuning */}
              <div className="w-full">
                <h2 className="text-lg font-semibold text-gray-400 border-b border-gray-700 pb-2">
                  Hyperparameter Tuning
                </h2>
                <div className="flex items-center gap-4 mt-4">
                  <p className="flex w-2/3">Train Percentage</p>
                  <Slider
                    aria-label="Train Percentage"
                    onChange={handleChange}
                    value={rangTrain}
                    color="warning"
                    min={0}
                    max={100}
                    step={1}
                  />
                  <span>{rangTrain}%</span>
                </div>

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

                <div className="flex items-center gap-2 mt-5">
                  <span>Forecast Horizon</span>
                  <Input
                    id="forecast"
                    value={forecast}
                    onChange={(e) => setForecast(parseInt(e.target.value, 10) || 0)}
                    className="w-16"
                  />
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-5 items-center justify-between">
              {/* Best Model */}
              <div className="flex gap-6 items-center">
                <div className="border-t border-gray-700 pt-4">
                  <h2 className="text-lg font-semibold text-gray-400">Recommended Parameters</h2>
                  <div className="flex gap-6 py-4">
                    <span>p = {bestModels[0]}</span>
                    <span>d = {bestModels[1]}</span>
                    <span>q = {bestModels[2]}</span>
                  </div>
                </div>
              </div>

              {/* User Select */}
              <div className="border-t border-gray-700 pt-4">
                <h2 className="text-lg font-semibold text-gray-400">User Select</h2>
                <div className="grid grid-cols-3 gap-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>p</span>
                    <Input id="p" value={p} onChange={handleInputChange} className="w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>d</span>
                    <Input id="d" value={d} onChange={handleInputChange} className="w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>q</span>
                    <Input id="q" value={q} onChange={handleInputChange} className="w-16" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between w-full items-center">
              <Button
                onClick={() => fetchArimaNew()}
                className="bg-[#AC7D0C] hover:bg-gray-600 text-white"
              >
                Apply
              </Button>

              <div>
                <Button
                  onClick={() => {
                    openModalChart();
                    fetchArimaNewTWO();
                  }}
                  className="bg-[#AC7D0C] hover:bg-gray-600 text-white"
                >
                  Generate Forecast
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-7 space-y-6 h-full w-full">
            <AcfChart title="Autocorrelation (ACF)" dataChart={chartACFdata} />
            <AcfChart title="Partial Autocorrelation (PACF)" dataChart={chartPACFdata} />
          </div>
        </div>

        {/* Forecast Modal */}
        {!loading && (
          <GenerateChartModal
            data={dataDialogChart}
            metrics={metrics}
            OpenChart={openChart}
            closeChart={closeChart}
          />
        )}
      </div>
    </div>
  );
}