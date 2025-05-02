"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Header } from '../Header'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { GenerateChartModal } from '../Generate Chart Modal/GenerateChartModal'
import { Checkbox } from '../ui/checkbox'
// import ChartArima from './ChartArima'
interface Parameters {
    name: string,
    from: number,
    to: number,
  
  }
interface ParametersItemProps {
    Parameters: Parameters;
  }
  
function AutoArimaX() {
      const [initialParameters, setInitialParameters] = useState(
      [  
        {
        name: "p",
        from: 0,
        to: 0,
      },
        {
        name: "d",
        from: 0,
        to: 0,
      },
        {
        name: "q",
        from: 0,
        to: 0,
      },
    ]
    )
        const [OpenChart, setOpenChart] = useState<boolean>(false)
    
        const closeChart = () => {
            setOpenChart(false);
          };
    
          const openModalChart =()=>{
            setOpenChart(true)
          }
    
   
  const [rangTrain, setrangTrain] = React.useState<string | number>('50'); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setrangTrain(e.target.value);
  }
    const [selectedModels, setSelectedModels] = useState({
      FTHP: true,
      Choke: false,
      Oil_rate: false,
  
    })
  
    const toggleModel = (model: keyof typeof selectedModels) => {
      setSelectedModels({
        ...selectedModels,
        [model]: !selectedModels[model],
      })
    }
  return (  
    <div className="container mx-auto px-4">
 <Header title={"Auto  ARIMA X Algorithm"}/>
 <div className=' h-200 grid grid-cols-6 lg:grid-cols-12 space-x-5'>

     <div className=' col-span-6 lg:col-span-7' >
         <div className=' grid grid-cols-12 space-x-10'>

             <div className='col-span-5'>
             <div>
            <h2 className=" font-bold text-gray-400 my-3">Input Feature</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="FTHP"
                  checked={selectedModels.FTHP}
                  onCheckedChange={() => toggleModel("FTHP")}
                />
                <Label htmlFor="exponential" className="text-sm">
                FTHP
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
                  checked={selectedModels.Oil_rate}
                  onCheckedChange={() => toggleModel("Oil_rate")}
                />
                <Label htmlFor="Oil_rate" className="text-sm">
                  Oil rate
                </Label>
              </div>
            
             
            
              
            </div>
          </div>
                <h2 className='border-b border-gray-300 pb-2 text-gray-400 font-bold mt-3'>Parameters</h2>
                <div className=" gap-4">

              <div className="space-y-1 w-full">
                {initialParameters.map(Parameters=><ParametersItem key={Parameters.name} Parameters={Parameters} />)}
               
              </div>
          
            </div>
                
             </div>

             <div className='col-span-7   h-10'>
                <h2  className=' text-gray-400 font-bold'>Hyperparameter Tuning</h2>

                <div className='flex space-x-3 mt-7 '>
                    <h2>Train Percentage</h2>
                    <input  onChange={handleChange} className='w-2/4' type="range" /> <span>{rangTrain} %</span>
                </div>

                <div className=' space-x-3 mt-5 '>
                    <h2 className='text-gray-400 font-bold'>Best Model</h2>
                    <div className='flex space-x-5 py-5'>
                        <span> p = 2</span>
                        <span> d = 2</span>
                        <span> q = 2</span>
                    </div>
                </div>
               
             </div>

         </div>
         <div className=' mt-20 ml-11'>
            <div>
                <h2 className='p-2 border w-60 text-center rounded-t-2xl font-bold border-b-0'>Generate Forecast</h2>
                <div className='border w-110 py-3 px-10 rounded-tr-2xl'>
                    <h2 className='border-b border-gray-300 pb-2 text-gray-400 font-bold' >Projection Settings</h2>
                    <div className='w-1/2'>
                    <h2 className=' py-3  font-bold '>Days</h2>
                    <Input id="day" value={180} />
                    </div>
                    <div className='flex justify-between items-center mt-5'>
                    <Button className=" border hover:bg-gray-300 cursor-pointer  w-43">
                                Cancel
                                </Button>
                         <Button onClick={openModalChart} className="bg-gray-800 hover:bg-gray-700 cursor-pointer  text-white w-43">
                                               Save
                                               </Button>

                    </div>
                </div>
            </div>
         </div>

     </div>


      <div className=' col-span-6 lg:col-span-5 gird space-y-20'>
        {/* <ChartArima/>
        <ChartArima/> */}

      </div>

 </div>
 <GenerateChartModal OpenChart={OpenChart} setOpenChart={setOpenChart} closeChart={closeChart}/>

    </div>
  )
}

export default AutoArimaX

const  ParametersItem: React.FC<ParametersItemProps> =({Parameters})=><div className='flex items-center justify-between space-y-2 mt-3 space-x-10' >
<Label htmlFor={Parameters.name}className="text-sm  ">
{Parameters.name}
</Label>
<div >
<span>from</span>
<Input 
id={Parameters.name}
value={Parameters.to}
//   onChange={(e) => setInitialParams({ ...initialParams, qi: e.target.value })}
/>
</div>
<div >
<span>to</span>
<Input 
id={Parameters.name}
value={Parameters.to}
//   onChange={(e) => setInitialParams({ ...initialParams, qi: e.target.value })}
/>
</div>
</div>