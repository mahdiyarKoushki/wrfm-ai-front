"use client"
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import OilProductionChart from './oli-chart/OilProductionChart';

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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="">
      <div className="container mx-auto py-6 px-4">
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6 ml-40">
            <TabsTrigger
              value="table"
              className="text-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              value="chart"
              className="text-gray-400 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
            >
              Chart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-center">#</th>
                    <th className="p-3 text-center">Date</th>
                    <th className="p-3 text-center">Choke (1/64")</th>
                    <th className="p-3 text-center">WHP (psig) </th>
                    <th className="p-3 text-center">Oil (STBD)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((row: DataRow, index:number) => (
                    <tr key={index} className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3  text-center">{indexOfFirstItem + index + 1}</td>
                      <td className="p-3 text-center">{formatDateString(row.Date)}</td>
                      <td className="p-3 text-center">{row.Choke}</td>
                      <td className="p-3 text-center">{row.WHP}</td>
                      <td className="p-3 text-center">{row.Oil?.toFixed()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                First
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              {pageNumbers.map((number) => (
                <Button
                  key={number}
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 p-0 ${currentPage === number ? 'bg-blue-50 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300' : ''}`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 p-0"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                Last
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="chart">
            <OilProductionChart dataTabel={dataTabel} filterData={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function formatDateString(input: string): string {
  const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!datePattern.test(input)) {
      throw new Error("Input string is not in the correct format.");
  }
  const datePart = input.split(" ")[0];
  return datePart;
}