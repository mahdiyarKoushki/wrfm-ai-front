"use client"

import React, { ReactNode } from 'react';
import { MainProduction } from "./Components/Main/MainProduction";
import { Button } from "./Components/ui/button";
import bgImage from "../../public/3409297.jpg"
import { useRouter } from "next/navigation";
import Image from "next/image";
import Production from './Prediction/page';


interface MainProductonProps {
  children?: ReactNode;
}
export default function Home() {
  const router = useRouter();
  return (

<Production />
  
  );
}






const ProductionLayout: React.FC<MainProductonProps> = ({children}: MainProductonProps) => {
  return <div className="  mx-auto ">{children}</div>
}
