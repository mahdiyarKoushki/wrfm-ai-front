"use client"
import { ReactNode, useState } from "react";
import { LeftSetion } from "../Production/LeftSetion";
import { RightSection } from "../Production/RightSetion";
// import { RightSetion } from "../Production/RightSetion";

interface MainProductonProps {
  children?: ReactNode;
}

export const MainProduction:React.FC<MainProductonProps>=({children}: MainProductonProps)=>{
      const [jsonExel, setjsonExel] = useState<Record<string, string | undefined>>(() => {
        const storedData = localStorage.getItem("jsonExel");
        return storedData ? JSON.parse(storedData) : {};
      });
    
      const [dataTabel, setdataTabel] = useState<any[]>(() => {
        const storedTableData = localStorage.getItem("dataTabel");
        return storedTableData ? JSON.parse(storedTableData) : [];
      });
return<div className="grid grid-cols-1 lg:grid-cols-2 space-x-10 ">
       <LeftSetion jsonExel={jsonExel} setjsonExel={setjsonExel} dataTabel={dataTabel} setdataTabel={setdataTabel}/>
          <RightSection dataTabel={dataTabel}/>
</div>
}
