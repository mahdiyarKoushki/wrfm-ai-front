"use client"

import { CSSProperties, useEffect, useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import ModelComparisonChartsModal from "./model-comparison-charts-modal"
import MuiStyleSelect from "../ui/mui-style-select"
import useWellStore from "@/store/zustandState"
import { declineCurveAnalysis } from "@/api-client/api-client"
import { MoonLoader } from "react-spinners"
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
}
interface ModelParametersModalProps {
  isOpen: boolean
  onClose: () => void
  wellData?: any[],
  days: string
}

interface ModelForm {
  id: string
  model: string
  initialParams: { [key: string]: string | number }
}

export default function ModelParametersModal({ isOpen, onClose, wellData, days }: ModelParametersModalProps) {
  const [firstParameters, setFirstParameters] = useState<any>({})
  const [loading, setLoading] = useState(false) // Added loading state
  const { well } = useWellStore()
  const [modelForms, setModelForms] = useState<ModelForm[]>([
    {
      id: "model-1",
      model: "Exponential",
      initialParams: firstParameters["Exponential"] || {}
    },
  ])

  useEffect(() => {
    
    setModelForms([
      {
        id: "model-1",
        model: "Exponential",
        initialParams: firstParameters["Exponential"] || {}
      },
    ])
 
  }, [firstParameters])


  
  

  const handleDeclineAnalysis = async () => {
    setLoading(true)  // Start loading
    const params = {
      forecast_days: Number(days),
      selected_wells: [well],
      selected_models: ["Exponential", "Hyperbolic", "Harmonic", "StretchedExp", "Logistic", "ModifiedDCA", "PowerLaw"],
    }

    try {
      const data = await declineCurveAnalysis(params)
      const Exponential=data.data[well].models["Exponential"].parameters 
      const Hyperbolic=data.data[well].models["Hyperbolic"].parameters 
      const Harmonic=data.data[well].models["Harmonic"].parameters 
      const StretchedExp=data.data[well].models["StretchedExp"].parameters 
      const Logistic=data.data[well].models["Logistic"].parameters 
      const ModifiedDCA=data.data[well].models["ModifiedDCA"].parameters 
      const PowerLaw=data.data[well].models["PowerLaw"].parameters 

      setFirstParameters({Exponential,Hyperbolic,Harmonic,StretchedExp,Logistic,ModifiedDCA,PowerLaw})

    } catch (error) {
      console.error("An error occurred:", error)
    } finally {
      setLoading(false)  // End loading
    }
  }

  useEffect(() => {
    handleDeclineAnalysis()
  }, [])



  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false)

  const handleAddNewModel = () => {
    const newId = `model-${modelForms.length + 1}`
    setModelForms([
      ...modelForms,
      {
        id: newId,
        model: "Exponential",
        initialParams: firstParameters["Exponential"] || {}
      },
    ])

    setTimeout(() => {
      const modalContent = document.querySelector(".model-params-content")
      if (modalContent) {
        modalContent.scrollTop = modalContent.scrollHeight
      }
    }, 100)
  }

  const handleDeleteModel = (id: string) => {
    setModelForms(modelForms.filter((form) => form.id !== id))
  }

  const handleModelChange = (id: string, value: string) => {
    setModelForms(modelForms.map((form) =>
      form.id === id ? { ...form, model: value, initialParams: firstParameters[value] || {} } : form))
  }

  const handleSaveChanges = () => {
    onClose()
    setIsComparisonModalOpen(true)
  }

  const modelOptions = [
    { value: "Exponential", label: "ARPS: Exponential" },
    { value: "Hyperbolic", label: "ARPS: Hyperbolic" },
    { value: "Harmonic", label: "ARPS: Harmonic" },
    { value: "StretchedExp", label: "Extended Exponential" },
    { value: "Logistic", label: "Logistic Growth Model" },
    { value: "ModifiedDCA", label: "Modified DCA (Transition Decline Rate)" },
    { value: "PowerLaw", label: "Power Law" },
  ]

  const formatNumber = (num: number | string | undefined) => (num !== undefined ? parseFloat(num as string).toFixed(3) : "-")

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 h-[600px] overflow-hidden flex flex-col">
          <DialogHeader className="p-6 pb-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Model Parameters</DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-6 pt-2 overflow-y-auto model-params-content flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                 <MoonLoader

                      color="#365ad8"
                      loading={loading}
                      cssOverride={override}
                      size={150}
                      />
              </div>
            ) : (
              modelForms.map((form, index) => (
                <div key={form.id} className={index > 0 ? "mt-10 pt-10 border-t relative" : "relative"}>
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteModel(form.id)}
                      className="absolute right-0 -top-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                    </Button>
                  )}

                  <div className="mb-6">
                    <MuiStyleSelect
                      label="Parameters"
                      value={form.model}
                      onChange={(value) => handleModelChange(form.id, value)}
                      options={modelOptions}
                      fullWidth
                    />
                  </div>

                  <div className="grid gap-10">
                    <div className="col-span-8">
                      <h2 className="text-gray-400 font-bold mb-5">
                        Optimal Parameters
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              {["qi", "D", "b", "K", "a", "n", "D_lim", "beta"].map((h) => (
                                <th key={h} className="py-2 px-4 text-center">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="text-center">
                              {["qi", "D", "b", "K", "a", "n", "D_lim", "beta"].map((param) => (
                                <td key={param} className="py-2 px-4">
                                  {formatNumber(form.initialParams[param])}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center p-6 pt-4 border-t flex-shrink-0">
            <Button variant="outline" className="flex items-center gap-1" onClick={handleAddNewModel}>
              <Plus className="h-4 w-4" />
              Add New Model
            </Button>
            <Button className="bg-gray-800 hover:bg-gray-700 text-white" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ModelComparisonChartsModal 
      days={days}
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        models={modelForms.map((item)=>item.model)}
      />
    </>
  )
}