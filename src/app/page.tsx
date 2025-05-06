"use client"

import React, { ReactNode } from 'react';
import { MainProduction } from "./Components/Main/MainProduction";
import { Button } from "./Components/ui/button";
import bgImage from "../../public/3409297.jpg"
import { useRouter } from "next/navigation";
import Image from "next/image";


interface MainProductonProps {
  children?: ReactNode;
}
export default function Home() {
  const router = useRouter();
  return (
<div className="h-dvh w-full flex items-center justify-center relative ">
  <Image className="h-full w-full bg-cover bg-no-repeat" width={100} height={100} src={"/3409297.jpg"} alt="" priority unoptimized/>
   <Button onClick={()=>{router.push("/Prediction")}} className=" font-bold text-6xl border shadow-2xl shadow-white/50 flex flex-col  p-20  absolute text-amber-500 cursor-pointer">
    Welcom To  Rate Prediction AI 
    <span className="text-sm underline text-amber-300">click</span>
    </Button>
    
  
</div>
  
  );
}






const ProductionLayout: React.FC<MainProductonProps> = ({children}: MainProductonProps) => {
  return <div className=" container mx-auto ">{children}</div>
}
