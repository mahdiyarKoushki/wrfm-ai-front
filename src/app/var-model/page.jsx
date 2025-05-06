// "use client"

// import { useState } from "react"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Slider } from "@/components/ui/slider"
// import { Checkbox } from "@/components/ui/checkbox"
// import { ArrowLeft } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// export default function LSTMModelUI() {
//   const [trainPercentage, setTrainPercentage] = useState(80)
//   const [selectedFeatures, setSelectedFeatures] = useState({
//     WHP: true,
//     Choke: false,
//     OilRate: false,
//   })

//   const [modelType, setModelType] = useState("DCA")

//   // Sample data for charts
//   const testData = generateSampleData(2024, 12, 2025, 5, 2000, 2200)
//   const trainTestData = generateSampleData(2024, 12, 2025, 5, 1950, 2200, true)

//   return (
//     <div className="container mx-auto p-4 max-w-7xl">
//       <div className="flex items-center mb-6">
//         <h1 className="text-2xl font-bold flex-1">LSTM Model UI</h1>
//         <Button variant="ghost" size="sm">
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="space-y-8">
//           {/* Input Feature */}
//           <div>
//             <h2 className="text-lg font-medium text-muted-foreground mb-4">Input Feature</h2>
//             <div className="flex gap-4">
//               <Button
//                 variant={selectedFeatures.WHP ? "default" : "outline"}
//                 onClick={() => setSelectedFeatures({ ...selectedFeatures, WHP: !selectedFeatures.WHP })}
//                 className="flex-1"
//               >
//                 WHP
//               </Button>
//               <Button
//                 variant={selectedFeatures.Choke ? "default" : "outline"}
//                 onClick={() => setSelectedFeatures({ ...selectedFeatures, Choke: !selectedFeatures.Choke })}
//                 className="flex-1"
//               >
//                 Choke
//               </Button>
//               <Button
//                 variant={selectedFeatures.OilRate ? "default" : "outline"}
//                 onClick={() => setSelectedFeatures({ ...selectedFeatures, OilRate: !selectedFeatures.OilRate })}
//                 className="flex-1"
//               >
//                 Oil rate
//               </Button>
//             </div>
//           </div>

//           {/* Model Selection */}
//           <div className="grid grid-cols-2 gap-2">
//             <div className="flex items-center space-x-2">
//               <Checkbox id="dca" checked={modelType === "DCA"} onCheckedChange={() => setModelType("DCA")} />
//               <label
//                 htmlFor="dca"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Using DCA
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="exponential"
//                 checked={modelType === "Exponential"}
//                 onCheckedChange={() => setModelType("Exponential")}
//               />
//               <label
//                 htmlFor="exponential"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Exponential
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="hyperbolic"
//                 checked={modelType === "Hyperbolic"}
//                 onCheckedChange={() => setModelType("Hyperbolic")}
//               />
//               <label
//                 htmlFor="hyperbolic"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Hyperbolic
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="harmonic"
//                 checked={modelType === "Harmonic"}
//                 onCheckedChange={() => setModelType("Harmonic")}
//               />
//               <label
//                 htmlFor="harmonic"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Harmonic
//               </label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Checkbox
//                 id="logistic"
//                 checked={modelType === "Logistic"}
//                 onCheckedChange={() => setModelType("Logistic")}
//               />
//               <label
//                 htmlFor="logistic"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Logistic
//               </label>
//             </div>
//           </div>

//           {/* Hyperparameter Tuning */}
//           <div>
//             <h2 className="text-lg font-medium text-muted-foreground mb-4">Hyperparameter Tuning</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm">Train Percentage</span>
//                   <span className="text-sm">{trainPercentage} %</span>
//                 </div>
//                 <Slider
//                   value={[trainPercentage]}
//                   min={10}
//                   max={90}
//                   step={1}
//                   onValueChange={(value) => setTrainPercentage(value[0])}
//                 />
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-sm">Window Size</label>
//                   <Input type="number" placeholder="0" min={0} />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm">Epoch</label>
//                   <Input type="number" placeholder="0" min={0} />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm">Loss Func</label>
//                   <Input type="number" placeholder="0" min={0} />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm">Batch Size</label>
//                   <Input type="number" placeholder="0" min={0} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Model Settings */}
//           <div>
//             <h2 className="text-lg font-medium text-muted-foreground mb-4">Model Settings</h2>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader className="bg-primary text-primary-foreground">
//                   <TableRow>
//                     <TableHead className="text-center">Layer Number</TableHead>
//                     <TableHead className="text-center">LSTM Units</TableHead>
//                     <TableHead className="text-center">Acti Func</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell className="text-center">Layer 1</TableCell>
//                     <TableCell className="text-center">64</TableCell>
//                     <TableCell className="text-center">tanh</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell className="text-center">Dense Layer</TableCell>
//                     <TableCell className="text-center">1</TableCell>
//                     <TableCell className="text-center">linear</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </div>
//           </div>

//           {/* Result Section */}
//           <div>
//             <h2 className="text-lg font-medium text-muted-foreground mb-4">Result Section</h2>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader className="bg-primary text-primary-foreground">
//                   <TableRow>
//                     <TableHead className="text-center">RMSE Test</TableHead>
//                     <TableHead className="text-center">MAE Test</TableHead>
//                     <TableHead className="text-center">MAPE Test</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell className="text-center">25.62959804316816</TableCell>
//                     <TableCell className="text-center">18.31939004578852</TableCell>
//                     <TableCell className="text-center">0.0088851819557111</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell className="text-center">25.62959804316816</TableCell>
//                     <TableCell className="text-center">18.31939004578852</TableCell>
//                     <TableCell className="text-center">0.0088851819557111</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell className="text-center">25.62959804316816</TableCell>
//                     <TableCell className="text-center">18.31939004578852</TableCell>
//                     <TableCell className="text-center">0.0088851819557111</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className="space-y-8">
//           <Card className="p-4">
//             <h3 className="text-sm font-medium mb-4">VAR Model Predictions for Oil on Test Data (BPH-Oil)</h3>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={testData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="date"
//                     tickFormatter={(value) => {
//                       const date = new Date(value)
//                       return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
//                     }}
//                   />
//                   <YAxis domain={[1950, 2200]} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="actual" stroke="#ff0000" dot={false} />
//                   <Line type="monotone" dataKey="predicted" stroke="#0000ff" dot={false} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>

//           <Card className="p-4">
//             <h3 className="text-sm font-medium mb-4">VAR Model Predictions for Oil on Train and Test Data (BPH-Oil)</h3>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={trainTestData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="date"
//                     tickFormatter={(value) => {
//                       const date = new Date(value)
//                       return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
//                     }}
//                   />
//                   <YAxis domain={[1950, 2200]} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="actual" stroke="#ff0000" dot={false} />
//                   <Line type="monotone" dataKey="predicted" stroke="#0000ff" dot={false} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
//         <Button className="bg-gray-800 hover:bg-gray-700">Train Model</Button>
//         <Button variant="outline">Optimize Model</Button>
//         <Button variant="outline">Result and Plots</Button>
//         <Button variant="outline">Model Summary</Button>
//         <Button variant="outline">Reset</Button>
//       </div>
//     </div>
//   )
// }

// // Helper function to generate sample data for charts
// function generateSampleData(startYear, startMonth, endYear, endMonth, minValue, maxValue, isDecreasing = false) {
//   const data = []
//   const currentDate = new Date(startYear, startMonth - 1, 1)
//   const endDate = new Date(endYear, endMonth - 1, 1)

//   let baseValue = isDecreasing ? maxValue : minValue
//   const direction = isDecreasing ? -1 : 1

//   while (currentDate <= endDate) {
//     // Add some randomness to the data
//     const randomVariation = Math.random() * 30 - 15
//     const actualValue = baseValue + randomVariation
//     const predictedValue = actualValue + (Math.random() * 20 - 10)

//     data.push({
//       date: new Date(currentDate),
//       actual: actualValue,
//       predicted: predictedValue,
//     })

//     // Move to next month
//     currentDate.setMonth(currentDate.getMonth() + 1)

//     // Gradually change the base value for trend
//     if (isDecreasing) {
//       baseValue -= Math.random() * 5
//       if (baseValue < minValue) baseValue = minValue
//     } else {
//       // For the first chart, create more fluctuation
//       baseValue += direction * (Math.random() * 10 - 5)
//       if (baseValue > maxValue) baseValue = maxValue
//       if (baseValue < minValue) baseValue = minValue
//     }
//   }

//   return data
// }
