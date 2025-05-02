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
  dataTabel: DataRow[];
}

export const RightSection: React.FC<RightSectionProps> = ({ dataTabel }) => {

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataTabel.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(dataTabel.length / itemsPerPage);
  const pageNumbers = [];

  // Calculate start and end pages for the pagination
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
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
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
            {/* Well Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Choke</th>
                    <th className="p-3 text-left">BSTP</th>
                    <th className="p-3 text-left">WHP</th>
                    <th className="p-3 text-left">Oil</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((row: DataRow, index) => (
                    <tr key={index} className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3">{indexOfFirstItem + index + 1}</td>
                      <td className="p-3">{row.Date}</td>
                      <td className="p-3">{row.Choke}</td>
                      <td className="p-3">{row.BSTP}</td>
                      <td className="p-3">{row.WHP}</td>
                      <td className="p-3">{row.Oil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2">
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
            </div>

            {/* Statistical Analysis */}
          </TabsContent>

          <TabsContent value="chart">
            <OilProductionChart  dataTabel={dataTabel}  filterData={true}/>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <h2 className="text-center font-medium mb-4">Statistical Analysis Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Count</th>
                <th className="p-3 text-left">mean</th>
                <th className="p-3 text-left">std</th>
                <th className="p-3 text-left">min</th>
                <th className="p-3 text-left">25%</th>
                <th className="p-3 text-left">50%</th>
                <th className="p-3 text-left">75%</th>
                <th className="p-3 text-left">max</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy data for analysis, should be dynamic if needed */}
              <tr>
                <td className="p-3">Oil</td>
                <td className="p-3">714.0</td>
                <td className="p-3">15.705</td>
                <td className="p-3">10.328</td>
                <td className="p-3">0.00</td>
                <td className="p-3">3.7916</td>
                <td className="p-3">24.00</td>
                <td className="p-3">24.00</td>
                <td className="p-3">25.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3">Choke</td>
                <td className="p-3">714.0</td>
                <td className="p-3">15.705</td>
                <td className="p-3">10.328</td>
                <td className="p-3">0.00</td>
                <td className="p-3">3.7916</td>
                <td className="p-3">24.00</td>
                <td className="p-3">24.00</td>
                <td className="p-3">25.00</td>
              </tr>
              <tr>
                <td className="p-3">FTHP</td>
                <td className="p-3">714.0</td>
                <td className="p-3">15.705</td>
                <td className="p-3">10.328</td>
                <td className="p-3">0.00</td>
                <td className="p-3">3.7916</td>
                <td className="p-3">24.00</td>
                <td className="p-3">24.00</td>
                <td className="p-3">25.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};