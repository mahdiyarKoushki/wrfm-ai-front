"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import OilProductionChart from "./oli-chart/OilProductionChart";

interface DataRow {
  Date: string;
  Choke: number;
  BSTP: string;
  WHP: number;
  Oil: number;
}

interface RightSectionProps {
  dataTabel: any;
}

export const RightSection: React.FC<RightSectionProps> = ({ dataTabel }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataTabel.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(dataTabel.length / itemsPerPage);
  const generatePageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage < 4) {
      if (currentPage < 3) {
        endPage = Math.min(totalPages, startPage + 4);
      } else {
        startPage = Math.max(1, endPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className=" col-span-2  py-6 px-4 bg-[#262626] p-5 rounded-2xl">
      <Tabs defaultValue="chart" className="w-full ">
        <TabsList className="grid w-full grid-cols-2 ">
     
          <TabsTrigger
            value="chart"
            className="text-gray-400 data-[state=active]:text-[#ac7d0c] data-[state=active]:border-b-2 data-[state=active]:border-[#ac7d0c] rounded-none"
          >
            Chart
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="text-[#ac7d0c] data-[state=active]:text-[#ac7d0c] data-[state=active]:border-b-2 data-[state=active]:border-[#ac7d0c] rounded-none"
          >
            Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="">
          <div className="overflow-x-auto  " >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#ac7d0c] text-white">
                  <th className="p-3 text-center">#</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Choke (1/64")</th>
                  <th className="p-3 text-center">FTHP (psig)</th>
                  <th className="p-3 text-center">Oil (STBD)</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row: DataRow, index: number) => (
                  <tr key={index} className={index % 2 === 1 ? "bg-[#262626] text-white" : "bg-[#5b5b5b20] text-white"}>
                    <td className="p-3 text-center">{indexOfFirstItem + index + 1}</td>
                    <td className="p-3 text-center">{formatDateString(row.Date)}</td>
                    <td className="p-3 text-center">{row.Choke}</td>
                    <td className="p-3 text-center">{row.WHP}</td>
                    <td className="p-3 text-center">{row.Oil.toFixed()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageNumbers={generatePageNumbers()}
          />
        </TabsContent>

        <TabsContent value="chart">
          <OilProductionChart dataTabel={dataTabel} filterData={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageNumbers: number[];
}> = ({ currentPage, totalPages, onPageChange, pageNumbers }) => (
  <div className="flex justify-center items-center gap-2 text-[#AC7D0C]">
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 p-0"
      disabled={currentPage === 1}
      onClick={() => onPageChange(1)}
    >
      First
      <span className="sr-only">First page</span>
    </Button>
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 p-0"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous page</span>
    </Button>

    {pageNumbers.map((number) => (
      <Button
        key={number}
        variant="outline"
        size="icon"
        className={`h-8 w-8 p-0 ${
          currentPage === number ? "bg-blue-50 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300" : ""
        }`}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Button>
    ))}

    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 p-0"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next page</span>
    </Button>

    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 p-0"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(totalPages)}
    >
      Last
      <span className="sr-only">Last page</span>
    </Button>
  </div>
);

function formatDateString(input: string): string {
  const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!datePattern.test(input)) {
    throw new Error("Input string is not in the correct format.");
  }
  return input.split(" ")[0];
}