import {Header} from "./Components/Header";
import React, { ReactNode } from 'react';
import { MainProduction } from "./Components/Main/MainProduction";

interface MainProductonProps {
  children?: ReactNode;
}

export default function Home() {
  return (
    <ProductionLayout>
      <Header title={"Rate Prediction UI Design"}/>
      <MainProduction>
      </MainProduction>
    </ProductionLayout>
  
  );
}




const ProductionLayout: React.FC<MainProductonProps> = ({children}: MainProductonProps) => {
  return <div className=" container mx-auto ">{children}</div>
}
