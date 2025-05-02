"use client"

import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

import { Button } from "../ui/button"
import WellProductionChart from "../Well Analysis/well-production-chart"


interface ModelComparisonChartsModalProps {
  isOpen: boolean
  onClose: () => void
  models: { name: string; type: string }[]
}

export default function ModelComparisonChartsModal({ isOpen, onClose, models }: ModelComparisonChartsModalProps) {
  // Metrics data for the table
  const metrics = [
    { model: "Arps exponential", MAE: "0.73", RMSE: "0.95", MAPE: "0.25" },
    { model: "Power Law", MAE: "0.73", RMSE: "0.95", MAPE: "0.25" },
    { model: "Extended Exponential", MAE: "0.73", RMSE: "0.95", MAPE: "0.25" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle>Model Comparison Charts</DialogTitle>
        
          </div>
        </DialogHeader>

        <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[350px]">
            <p className="text-xs text-center mb-1">Well Histories with Percentiles</p>
            <WellProductionChart data={[]}  />
          </div>

          <div>
            <p className="text-xs text-center mb-1">Analysis</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="py-2 px-4 text-center">#</th>
                    <th className="py-2 px-4 text-center">MAE</th>
                    <th className="py-2 px-4 text-center">RMSE</th>
                    <th className="py-2 px-4 text-center">MAPE</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{metric.model}</td>
                      <td className="py-2 px-4 text-center">{metric.MAE}</td>
                      <td className="py-2 px-4 text-center">{metric.RMSE}</td>
                      <td className="py-2 px-4 text-center">{metric.MAPE}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Arps exponential</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Power Law</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Extended Exponential</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
