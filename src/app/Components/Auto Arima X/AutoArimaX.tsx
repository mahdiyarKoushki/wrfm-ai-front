"use client"

import React, { useEffect, useState, CSSProperties } from "react"
import { MoonLoader, PacmanLoader } from "react-spinners"
import { Header } from "../Header"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

import { GenerateChartModal } from "../Generate Chart Modal/GenerateChartModal"
import { ArimaPosts, NewArimaPosts, NewArimaPostsStepTWO, NewAutoArimaPosts, NewAutoArimaXPosts } from "@/api-client/api-client"
import { FormControl, MenuItem, Select } from "@mui/material"
import { wells } from "../Well Analysis/mui-style-well-select"
import useWellStore from "@/store/zustandState"
import { Checkbox } from "../ui/checkbox"

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
}

interface Parameters {
  name: string
  from: number
  to: number
}
interface ParametersItemProps {
  Parameters: Parameters,
  onChange:(name:string,dir:string,value:string)=>void
}
const ParametersItem: React.FC<ParametersItemProps> = ({ Parameters,onChange }) => (
  <div className="flex items-center justify-between space-y-2 mt-3 space-x-10">
    <Label htmlFor={Parameters.name} className="text">
      {Parameters.name}
    </Label>
    <div className="flex items-center space-x-2">
      <span>from</span>
      <Input onChange={(e)=>{onChange(Parameters.name,"from",e.target.value)}}  id={Parameters.name} value={Parameters.from} />
    </div>
    <div className="flex items-center space-x-2">
      <span>to</span>
      <Input onChange={(e)=>{onChange(Parameters.name,"to",e.target.value)}}  id={Parameters.name} value={Parameters.to} />
    </div>
  </div>
)

export default function AutoArimaX() {
  const [loading, setLoading] = useState<boolean>(false)
  const { well } = useWellStore();

  

  const [allData, setallData] = useState<any>({})
  const [rangTrain, setRangTrain] = useState<string | number>("50")
  const [initialParameters,setinitialParameters] = useState<any>({  
    P: { name: "P", from: 0, to: 3 },
    D:{ name: "D", from: 0, to: 2 },
    Q: { name: "Q", from: 0, to: 3 },

  })

  const [bestModels, setBestModels] = useState<number[]>([0, 0, 0])
  const [chartACFdata, setChartACFdata] = useState<number[]>([])
  const [chartPACFdata, setChartPACFdata] = useState<number[]>([])
  const [dataDialogChart, setDataDialogChart] = useState<any>({})
  const [metrics, setmetrics] = useState<any>({})
  const [OpenChart, setOpenChart] = useState<boolean>(false)

  const [p, setP] = useState<number>(0);
  const [d, setD] = useState<number>(0);
  const [q, setQ] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const intValue = parseInt(value, 10) || 0;

    switch (id) {
      case 'p':
        setP(intValue);
        break;
      case 'd':
        setD(intValue);
        break;
      case 'q':
        setQ(intValue);
        break;
      default:
        break;
    }
  };

  const generateOutput = () => {
    return `${p},${d},${q}`;
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangTrain(e.target.value)
  }
  const openModalChart = () => setOpenChart(true)
  const closeChart = () => setOpenChart(false)

  const [selectedModels, setSelectedModels] = useState<any>({
    WHP: true,
    Choke: false,
    // Oil_rate: false,

  })
  const selectedArray = Object.keys(selectedModels).filter(key => selectedModels[key]);


  const fetchArima = async (wellName = well) => {
    setLoading(true)
    try {
      const params = {
        well_name: wellName,
        model: "ARIMA",
        input_features: ["WHP"],
      }
      const res = await ArimaPosts(params)

   

      const Measured_train = JSON.parse(res.data.metrics_and_data.train)
      const Predicted_train = JSON.parse(
        res.data.metrics_and_data.train_forecast
      )
      const Predicted_Validation = JSON.parse(
        res.data.metrics_and_data.predict_df
      )
      const Measured_Validation = JSON.parse(res.data.metrics_and_data.valid)

   
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  const fetchArimaNew = async (wellName = well) => {
    setLoading(true)
    try {
      const params = {
        well_name  :well,
  start_p:Number(initialParameters.P.from),
  max_p:Number(initialParameters.P.to),
  d:Number(initialParameters.D.from),
  max_d:Number(initialParameters.D.to),
  start_q:Number(initialParameters.Q.from),
  max_q:Number(initialParameters.Q.to),
      }
      const res = await NewArimaPosts(params)
      setBestModels(res.data.result.recom_order.recommended_order)
      setChartACFdata(res.data.result.acf_pacf_data.acf_data.acf_values)
      setChartPACFdata(res.data.result.acf_pacf_data.pacf_data.pacf_values)
      setallData(res.data)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  const fetchAutoArima = async (wellName = well) => {
    setLoading(true)
    // allData
    try {

      const params = {
        well_name  :well,
        start_p:Number(initialParameters.P.from),
        max_p:Number(initialParameters.P.to),
        d:Number(initialParameters.D.from),
        max_d:Number(initialParameters.D.to),
        start_q:Number(initialParameters.Q.from),
        max_q:Number(initialParameters.Q.to),
        train_ratio:(Number(rangTrain)/100),
        input_features:selectedArray,

        // well_name  :string,
        // start_p:number,
        // d:number,
        // start_q:number,
        // max_p:number,
        // max_d:number,
        // max_q:number,
        // train_ratio:number,
        // input_features: string[]

        // order:"1,2,3"
      }
      const res = await NewAutoArimaXPosts(params)
      const blind=JSON.parse(res.data.metrics_and_data.blind)
      const pred_test=JSON.parse(res.data.metrics_and_data.pred_test)
      const predict_df=JSON.parse(res.data.metrics_and_data.predict_df)
      const train=JSON.parse(res.data.metrics_and_data.train)
      const valid=JSON.parse(res.data.metrics_and_data.valid)
      const train_forecast=JSON.parse(res.data.metrics_and_data.train_forecast)
      const metrics =res.data.metrics_and_data.metrics
      const dataChart={
        blind,pred_test,predict_df,train,valid,train_forecast
      }
      setmetrics(metrics)
      
      
      setDataDialogChart(dataChart)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // fetchArimaNew()
  }, [])

  const handleChangeParameters:(name:string,dir:string,value:string)=>void=(name,dir,value)=>{
    setinitialParameters((last:any)=>{
      const temp={...last}
      if (dir=="from") {
        temp[name]={name,from:value,to:last[name].to}
          return temp
      }else{
        temp[name]={name,from:last[name].from,to: value}
        return temp
      }
    })

  }

  const toggleModel = (model: keyof typeof selectedModels) => {
    setSelectedModels({
      ...selectedModels,
      [model]: !selectedModels[model],
    })
  }

  return (
    <div className="container mx-auto px-4 relative">
      {/* === Loader Overlay === */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-white bg-opacity-80 flex items-center justify-center flex-col gap-5">
          <MoonLoader

            color="#365ad8"
            loading={loading}
            cssOverride={override}
            size={150}
          />
          <h2 className="font-bold">Data Feeding , Please Wait ... </h2>
        </div>
      )}

      {/* === Header === */}
      <Header rout="/Prediction" title={"Auto ARIMA Algorithm"} />

      {/* === Main Grid === */}
      <div className="h-200 grid grid-cols-6 lg:grid-cols-12 space-x-5">
        {/* Left Panel */}
        <div className="col-span-6 lg:col-span-7">
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

          <div className="grid grid-cols-12 space-x-10">
            {/* Parameters */}

            <div className="col-span-5">
              <h2 className="border-b border-gray-300 pb-2 text-gray-400 font-bold">
                Parameters
              </h2>
              {Object.keys(initialParameters).map((p) => (
                <ParametersItem key={p} onChange={handleChangeParameters} Parameters={initialParameters[p]} />
              ))}
         <div className=" border-t mt-6  w-[690px] border-gray-300 pb-2">
         {/* <div className="space-x-3 mt-5">
                <h2 className="text-gray-400 font-bold">Best Model</h2>
                <div className="flex space-x-5 py-5">
                  <span> p = {bestModels[0]}</span>
                  <span> d = {bestModels[1]}</span>
                  <span> q = {bestModels[2]}</span>
                </div>

              </div> */}
         </div>

                {/* <div className="space-x-3 mt-10 w-100">
                <h2 className="text-gray-400 font-bold">User Select</h2>
                <div className="grid grid-cols-4 space-x-5 py-3">
                  <div className="flex items-center space-x-2">
                    <span> p </span> <Input  id="p"
            value={p}
            onChange={handleInputChange}  />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span> d </span> <Input  id="d"
                                  value={d}
                              onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span> q </span> <Input id="q"
            value={q}
            onChange={handleInputChange} />
                  </div>
                </div>
              </div> */}
            </div>

            {/* Tuning & Best Model */}
            <div className="col-span-7 h-10">
              <h2 className="text-gray-400 font-bold">Hyperparameter Tuning</h2>
              <div className="flex space-x-3 mt-7">
                <h2>Train Percentage</h2>
                <input
                  onChange={handleChange}
                  className="w-2/4"
                  type="range"
                />{" "}
                <span>{rangTrain} %</span>
              </div>
  
            
            

              
            </div>
          </div>

          {/* Generate Forecast */}
          <div className="mt-5 ml-11">
            {/* <h2 className="p-2 border w-60 text-center rounded-t-2xl font-bold border-b-0">
              Generate Forecast
            </h2> */}
            <div className="border w-110 py-3 px-10 rounded-tr-2xl">
     
              <Button
                onClick={()=>{
                  openModalChart()
                  fetchAutoArima()
                }}
                className="bg-gray-800 hover:bg-gray-700 cursor-pointer my-5 text-white w-43"
              >
                 Generate Forecast
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-6 lg:col-span-5 space-y-20">
          {/* <ChartArima title="Autocorrelation (ACF)" dataChart={chartACFdata} />
          <ChartArima
            title="Partial Autocorrelation (PACF)"
            dataChart={chartPACFdata}
          /> */}
        </div>
      </div>

      {/* Forecast Modal */} 
      {!loading &&  <GenerateChartModal
        data={dataDialogChart}
        metrics={metrics}
        OpenChart={OpenChart}
        closeChart={closeChart}
      />
      }
     
    </div>
  )
}