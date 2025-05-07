import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { declineCurveAnalysis } from "@/api-client/api-client";
import useWellStore from "@/store/zustandState";
import { MoonLoader } from "react-spinners";
import WellProductionChart from "../Well Analysis/well-production-chart"; // Make sure this is the correct path
import ChartModuleAnalysis from "./chart-module.analysis";

interface ModelComparisonChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: string[];
  days: string;
}

interface ErrorsRateHistorical {
  MAE: number;
  MAPE: number;
  RMSE: number;
}

interface ModelData {
  errors_rate_historical: ErrorsRateHistorical;
}

type AllData = Record<string, ModelData>;

const ModelComparisonChartsModal: React.FC<ModelComparisonChartsModalProps> = ({
  isOpen,
  onClose,
  models,
  days,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allData, setallData] = useState<any>({});
  const { well } = useWellStore();

  const handleDeclineAnalysis = async () => {
    setLoading(true);
    try {
      const params = {
        forecast_days: Number(days),
        selected_wells: [well],
        selected_models: models,
      };
      const data = await declineCurveAnalysis(params);
      setallData(data.data[well].models);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleDeclineAnalysis();
    }
  }, [isOpen]);


  return (
    <div>
      {loading && (
        <div className="absolute inset-0 z-50 bg-white bg-opacity-80 flex items-center justify-center flex-col gap-5">
          <MoonLoader color="#365ad8" loading={loading} size={150} />
          <h2 className="font-bold">Data Loading, Please Wait...</h2>
        </div>
      )}
      {!loading && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-[calc(100%_-_100px)] h-[700px] p-0 gap-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Model Comparison Charts</DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-2 grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Chart Section */}
              <div className="h-full col-span-2">
                <p className="text-xs text-center mb-1">Well Histories with Percentiles</p>
                <ChartModuleAnalysis data={allData} />
              </div>
              
              {/* Metrics Table Section */}
              <div className="col-span-1">
                <p className="text-xs text-center mb-1">Analysis</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="py-2 px-4 text-center">Model</th>
                        <th className="py-2 px-4 text-center">MAE</th>
                        <th className="py-2 px-4 text-center">RMSE</th>
                        <th className="py-2 px-4 text-center">MAPE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(allData).map((modelName) => {
                        const { MAE, RMSE, MAPE } = allData[modelName].errors_rate_historical || {};
                        return (
                          <tr key={modelName} className="border-b">
                            <td className="px-4 py-2 text-center">{modelName}</td>
                            <td className="px-4 py-2 text-center">{MAE?.toFixed(2)}</td>
                            <td className="px-4 py-2 text-center">{RMSE?.toFixed(2)}</td>
                            <td className="px-4 py-2 text-center">{MAPE?.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ModelComparisonChartsModal;