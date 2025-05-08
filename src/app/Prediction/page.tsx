import React, { ReactNode } from 'react'
import { Header } from '../Components/Header';
import { MainProduction } from '../Components/Main/MainProduction';

interface MainProductonProps {
  children?: ReactNode;
}

function Production() {
  return (
<ProductionLayout>
<Header rout="/" title={"Production Forecasting"}/>
<MainProduction>
</MainProduction>
</ProductionLayout> 
  )
}

export default Production
// 007a5e






const ProductionLayout: React.FC<MainProductonProps> = ({children}: MainProductonProps) => {
  return <div className=" px-10 bg-[#0F0F0F] h-dvh ">{children}</div>
}
