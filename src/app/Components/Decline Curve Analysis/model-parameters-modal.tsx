"use client"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"

import ModelComparisonChartsModal from "./model-comparison-charts-modal"
import MuiStyleSelect from "../ui/mui-style-select"
import MuiStyleInput from "../ui/mui-style-input"

// "use client"

// import { useState } from "react"
// import { X, Plus, Trash2 } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import MuiStyleInput from "@/components/mui-style-input"
// import MuiStyleSelect from "@/components/mui-style-select"
// import ModelComparisonChartsModal from "@/components/model-comparison-charts-modal"

interface ModelParametersModalProps {
  isOpen: boolean
  onClose: () => void
  wellData?: any[]
}

interface ModelForm {
  id: string
  model: string
  initialParams: {
    qi: string
    D: string
    b: string
  }
  optimalParams: {
    qi: string
  }
}

export default function ModelParametersModal({ isOpen, onClose, wellData }: ModelParametersModalProps) {
  const [modelForms, setModelForms] = useState<ModelForm[]>([
    {
      id: "model-1",
      model: "arps-exponential",
      initialParams: {
        qi: "0",
        D: "0",
        b: "auto",
      },
      optimalParams: {
        qi: "200",
      },
    },
  ])
  const [projectionDays, setProjectionDays] = useState("180")
  const [bestModelParams, setBestModelParams] = useState({
    qi: "0.1",
    D: "0",
    b: "3",
  })
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false)

  const handleAddNewModel = () => {
    const newId = `model-${modelForms.length + 1}`
    setModelForms([
      ...modelForms,
      {
        id: newId,
        model: "extended-exponential",
        initialParams: {
          qi: "0",
          D: "0",
          b: "auto",
        },
        optimalParams: {
          qi: "200",
        },
      },
    ])

    // Scroll to bottom after a short delay to allow the new form to render
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
    setModelForms(modelForms.map((form) => (form.id === id ? { ...form, model: value } : form)))
  }

  const handleInitialParamChange = (id: string, param: keyof ModelForm["initialParams"], value: string) => {
    setModelForms(
      modelForms.map((form) =>
        form.id === id ? { ...form, initialParams: { ...form.initialParams, [param]: value } } : form,
      ),
    )
  }

  const handleOptimalParamChange = (id: string, param: keyof ModelForm["optimalParams"], value: string) => {
    setModelForms(
      modelForms.map((form) =>
        form.id === id ? { ...form, optimalParams: { ...form.optimalParams, [param]: value } } : form,
      ),
    )
  }

  const handleSaveChanges = () => {
    // Close this modal and open the comparison modal
    onClose()
    setIsComparisonModalOpen(true)
  }

  const modelOptions = [
    { value: "arps-exponential", label: "ARPS - Exponential" },
    { value: "extended-exponential", label: "Extended Exponential" },
    { value: "logistic-growth", label: "Logistic Growth Model" },
    { value: "modified-dca", label: "Modified DCA (Transition Decline Rate)" },
    { value: "power-law", label: "Power Law" },
  ]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="p-6 pb-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Model Parameters</DialogTitle>
            
            </div>
          </DialogHeader>

          <div className="p-6 pt-2 overflow-y-auto model-params-content flex-grow">
            {modelForms.map((form, index) => (
              <div key={form.id} className={index > 0 ? "mt-10 pt-10 border-t relative" : "relative"}>
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteModel(form.id)}
                    className="absolute right-0 -top-0  text-red-500 hover:text-red-700 hover:bg-red-50"
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
                <div className="grid grid-cols-3 gap-6 mb-6 w-full">
                <h3 className="text-sm text-gray-500 mb-2">Initial Parameters</h3>
                    <h3 className="text-sm text-gray-500 mb-2">Optimal Parameters</h3>
                      <h3 className="text-sm text-gray-500 mb-2">Projection Settings</h3>
                </div>

                <div className="grid grid-cols-5 gap-6 mb-6">
                 
                
                   
                      <MuiStyleInput
                        label="qi"
                        value={form.initialParams.qi}
                        onChange={(e) => handleInitialParamChange(form.id, "qi", e.target.value)}
                        fullWidth
                      />
                      <MuiStyleInput
                        label="D"
                        value={form.initialParams.D}
                        onChange={(e) => handleInitialParamChange(form.id, "D", e.target.value)}
                        fullWidth
                      />
                      <MuiStyleInput
                        label="b"
                        value={form.initialParams.b}
                        onChange={(e) => handleInitialParamChange(form.id, "b", e.target.value)}
                        fullWidth
                      />
                            <MuiStyleInput
                        label="qi"
                        value={form.optimalParams.qi}
                        onChange={(e) => handleOptimalParamChange(form.id, "qi", e.target.value)}
                        fullWidth
                      />
                        <MuiStyleInput
                          label="days"
                          value={projectionDays}
                          onChange={(e) => setProjectionDays(e.target.value)}
                          fullWidth
                        />
                   
                  

                  
                   
                      
                      
                    
                  
                 
                </div>

                {index === 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm text-gray-500 mb-2">Best Model</h3>
                    <div className="mb-2">
                      <p className="text-sm">Optimal Parameters</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">qi</span>
                        <span className="text-sm">{bestModelParams.qi}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">D</span>
                        <span className="text-sm">{bestModelParams.D}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">b</span>
                        <span className="text-sm">{bestModelParams.b}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        models={modelForms.map((form) => ({
          name: modelOptions.find((opt) => opt.value === form.model)?.label || "",
          type: form.model,
        }))}
        // wellData={wellData}
      />
    </>
  )
}
