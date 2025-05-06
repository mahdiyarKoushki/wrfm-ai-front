import React, { ReactNode } from 'react'
import { Header } from '../Components/Header';
import { MainProduction } from '../Components/Main/MainProduction';

interface MainProductonProps {
  children?: ReactNode;
}

function page() {
  return (
<ProductionLayout>
<Header rout="/" title={"Production Forecasting"}/>
<MainProduction>
</MainProduction>
</ProductionLayout> 
  )
}

export default page
// 007a5e






const ProductionLayout: React.FC<MainProductonProps> = ({children}: MainProductonProps) => {
  return <div className=" container mx-auto ">{children}</div>
}
