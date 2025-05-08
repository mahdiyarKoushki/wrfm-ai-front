"use client";

import { CSSProperties, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import ModelComparisonChartsModal from "./model-comparison-charts-modal";
import MuiStyleSelect from "../ui/mui-style-select";
import useWellStore from "@/store/zustandState";
import { declineCurveAnalysis } from "@/api-client/api-client";
import { MoonLoader } from "react-spinners";

// Spinner override for dark theme
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  // borderColor: "#FBBF24", // Amber for dark theme contrast
};

interface ModelParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
  wellData?: any[];
  days: string;
}

interface ModelForm {
  id: string;
  model: string;
  initialParams: { [key: string]: string | number };
}

const modelOptions = [
  { value: "Exponential", label: "ARPS: Exponential" },
  { value: "Hyperbolic", label: "ARPS: Hyperbolic" },
  { value: "Harmonic", label: "ARPS: Harmonic" },
  { value: "StretchedExp", label: "Extended Exponential" },
  { value: "Logistic", label: "Logistic Growth Model" },
  { value: "ModifiedDCA", label: "Modified DCA (Transition Decline Rate)" },
  { value: "PowerLaw", label: "Power Law" },
];

const paramHeaders = ["qi", "D", "b", "K", "a", "n", "D_lim", "beta"];

export default function ModelParametersModal({
  isOpen,
  onClose,
  days,
}: ModelParametersModalProps) {
  const [parameters, setParameters] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [modelForms, setModelForms] = useState<ModelForm[]>([
    { id: "model-1", model: "Exponential", initialParams: {} },
  ]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const { well } = useWellStore();

  // Fetch decline curve analysis data
  useEffect(() => {
    const fetchDeclineAnalysis = async () => {
      setLoading(true);
      try {
        const params = {
          forecast_days: Number(days),
          selected_wells: [well],
          selected_models: modelOptions.map((opt) => opt.value),
        };
        const { data } = await declineCurveAnalysis(params);
        const wellData = data[well].models;
        setParameters(wellData);
        setModelForms([
          {
            id: "model-1",
            model: "Exponential",
            initialParams: wellData["Exponential"].parameters,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch decline analysis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeclineAnalysis();
  }, [days, well]);

  // Add new model form
  const handleAddNewModel = () => {
    const newId = `model-${modelForms.length + 1}`;
    setModelForms([
      ...modelForms,
      {
        id: newId,
        model: "Exponential",
        initialParams: parameters["Exponential"]?.parameters || {},
      },
    ]);
    setTimeout(() => {
      const modalContent = document.querySelector(".model-params-content");
      modalContent?.scrollTo({ top: modalContent.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  // Delete model form
  const handleDeleteModel = (id: string) => {
    setModelForms(modelForms.filter((form) => form.id !== id));
  };

  // Update model selection
  const handleModelChange = (id: string, value: string) => {
    setModelForms(
      modelForms.map((form) =>
        form.id === id
          ? { ...form, model: value, initialParams: parameters[value]?.parameters || {} }
          : form
      )
    );
  };

  // Save and open comparison modal
  const handleSaveChanges = () => {
    onClose();
    setIsComparisonModalOpen(true);
  };

  // Format parameter values
  const formatNumber = (num: number | string | undefined) =>
    num !== undefined ? parseFloat(num as string).toFixed(3) : "-";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] p-0 h-[600px] overflow-hidden flex flex-col bg-[#262626] text-gray-100 border-0">
          <DialogHeader className="p-6 pb-2 flex-shrink-0 border-b border-gray-700">
            <DialogTitle className="text-xl text-gray-100">Model Parameters</DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-2 overflow-y-auto model-params-content flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <MoonLoader color="#FBBF24" loading={loading} cssOverride={override} size={100} />
              </div>
            ) : (
              modelForms.map((form, index) => (
                <div
                  key={form.id}
                  className={`relative ${index > 0 ? "mt-10 pt-10 border-t border-gray-700" : ""}`}
                >
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteModel(form.id)}
                      className="absolute right-0 -top-5 text-red-400 hover:text-red-300 hover:bg-gray-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="mb-6">
                    <MuiStyleSelect
                      label="Parameters"
                      value={form.model}
                      onChange={(value) => handleModelChange(form.id, value)}
                      options={modelOptions}
                      fullWidth
                      className="bg-gray-800 text-gray-100 border-gray-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-gray-400 font-bold mb-5">Optimal Parameters</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#AC7D0C]">
                            {paramHeaders.map((header) => (
                              <th key={header} className="py-2 px-4 text-center text-gray-200">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-center ">
                            {paramHeaders.map((param) => (
                              <td key={param} className="py-2 px-4 text-gray-300 bg-[#0f0f0f]">
                                {formatNumber(form.initialParams[param])}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center p-6 pt-4 border-t border-gray-700 flex-shrink-0">
            <Button
              variant="outline"
              className="flex items-center gap-1 bg-gray-800 text-gray-50 border-gray-600 hover:bg-gray-700"
              onClick={handleAddNewModel}
            >
              <Plus className="h-4 w-4" />
              Add New Model
            </Button>
            <Button
              className="bg-[#AC7D0C] hover:bg-amber-500 text-[#262626] text-gray-50"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ModelComparisonChartsModal
        days={days}
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        models={modelForms.map((item) => item.model)}
      />
    </>
  );
}