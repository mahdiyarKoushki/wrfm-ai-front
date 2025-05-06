"use client"
import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useWellStore from "@/store/zustandState";

interface Item {
  name: string;
  route: string;
}

interface ModelCardProps {
  title: string;
  items: Item[];
  goPage: (route: string) => void;
}

export const LeftSetion: React.FC<any> = ({jsonExel, setjsonExel,dataTabel, setdataTabel}) => {


  const router = useRouter();

  const { well, updateWell } = useWellStore();



  const handleChange = (event: SelectChangeEvent) => {
    const selectedWell = event.target.value;
    updateWell(selectedWell);

    const data = jsonExel[selectedWell];

    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        setdataTabel(Array.isArray(parsedData) ? parsedData : []);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setdataTabel([]);
      }
    } else if (Array.isArray(data)) {
      setdataTabel(data);
    } else {
      setdataTabel([]);
    }
  };

  const goPage = (route: string) => {
    router.push(`/${route}`);
  };
  return (
    <div className="">
      {/* <FileUploader jsonExel={jsonExel} setjsonExel={setjsonExel} /> */}
      <div className="mt-10 w-full space-y-10 mb-10 items-center">
        <div>
       
          <p className="   font-bold text-xl">Well Name</p>
          <FormControl sx={{ minWidth: 200, mt: "5px" }} size="small">
            <Select labelId="demo-select-small-label" id="demo-select-small" value={well} onChange={handleChange}>
              {Object.keys(jsonExel).map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="w-100 h-25 flex-col justify-between flex">
          <p className="text-gray-400 border-b-1 border-gray-200 font-bold text-xl">Analysis</p>
          <div>
            <div className="flex justify-between">
              <button onClick={() => router.push("/well-analysis")} className="rounded-md w-45 h-12 bg-amber-400 cursor-pointer" type="button">Type Well Analysis</button>
              <button onClick={() => router.push("/decline-curve")} className="rounded-md w-45 h-12 bg-amber-400 cursor-pointer" type="button">DCA Analysis</button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-0">
        <h1 className="text-gray-400 border-b-1 border-gray-200 font-bold text-xl mb-5" >AI Models</h1>
        <div className="flex space-x-20 items-start">
          <ModelCard goPage={goPage} title="Autoregressive" items={[{ name: "ARIMA", route: "arima" }, { name: "AutoARIMA", route: "auto-arima" }, { name: "ARIMAX", route: "arima-x" }, { name: "Auto ARIMAX", route: "auto-arima-x" }, { name: "VAR", route: "var-model" }]} />
          <ModelCard goPage={goPage} title="Deep Learning" items={[{ name: "GRU", route: "gru" }, { name: "LSTM", route: "lstm" }, { name: "CNN-LSTM", route: "cnn-lstm" }]} />
          <ModelCard goPage={goPage} title="Hybrid Models" items={[{ name: "DCA+GRU", route: "dca-gru" }]} />
        </div>
      </div>
    </div>
  );
};

const ModelCard: React.FC<ModelCardProps> = ({ title, items, goPage }) => (
  <div className="border-1 rounded-lg w-50 border-gray-400 h-auto overflow-hidden">
    <h2 className="font-semibold border-b text-center p-1.5">{title}</h2>
    <ul>
      {items.map((item, index) => (
        <li key={index} onClick={() => goPage(item.route)} className="border-t text-sm py-0.5 pl-10 border-gray-100 cursor-pointer hover:bg-gray-200">
          {item.name}
        </li>
      ))}
    </ul>
  </div>
);