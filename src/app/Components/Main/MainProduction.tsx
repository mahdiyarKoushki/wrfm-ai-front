"use client"


import { ReactNode, useState, useEffect } from "react";

import { RightSection } from "../Production/RightSetion";
// import { RightSetion } from "../Production/RightSetion";

interface MainProductonProps {
    children?: ReactNode;
}
import Well_Production_Data from "../../../Well_Production_Data/data.json"
import { LeftSection } from "../Production/LeftSetion";

export const MainProduction: React.FC<MainProductonProps> = ({ children }: MainProductonProps) => {
    const [jsonExel, setjsonExel] = useState<any>(Well_Production_Data);
    const [dataTabel, setdataTabel] = useState<any[]>(Well_Production_Data["SPH-04"]);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 space-x-10 ">
            <LeftSection jsonExel={jsonExel} setjsonExel={setjsonExel} dataTabel={dataTabel} setdataTabel={setdataTabel} />
            <RightSection dataTabel={dataTabel} />
        </div>
    );
};