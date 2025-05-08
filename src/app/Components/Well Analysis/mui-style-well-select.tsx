"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Check, ChevronDown } from "lucide-react";

export interface Well {
  value: string;
  label: string;
}

interface PropsSelect {
  selectedWells: Well[];
  setSelectedWells: React.Dispatch<React.SetStateAction<Well[]>>;
}

export const wells: Well[] = [
  { value: "SPH-01", label: "SPH-01" },
  { value: "JR-06", label: "JR-06" },
  { value: "JR-07", label: "JR-07" },
  { value: "SPH-02", label: "SPH-02" },
  { value: "SPH-03", label: "SPH-03" },
  { value: "SPH-04", label: "SPH-04" },
  { value: "SPH-05", label: "SPH-05" },
  { value: "SPH-06", label: "SPH-06" },
  { value: "SPH-07", label: "SPH-07" },
  { value: "SPH-08", label: "SPH-08" },
  { value: "SPH-09", label: "SPH-09" },
];

export default function MuiStyleWellSelect({ selectedWells, setSelectedWells }: PropsSelect) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (well: Well) => {
    setSelectedWells((prev) =>
      prev.some((item) => item.value === well.value)
        ? prev.filter((item) => item.value !== well.value)
        : [...prev, well]
    );
  };

  const handleRemove = (wellValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWells((prev) => prev.filter((item) => item.value !== wellValue));
  };

  const filteredWells = wells.filter((well) =>
    well.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Select Input */}
      <div
        onClick={() => setOpen(!open)}
        className={`flex min-h-[56px] w-2/3 items-center justify-between rounded-md border bg-[#0F0F0F] px-3 py-2 text-sm transition-all
          ${open ? "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.3)]" : "border-gray-600 hover:border-gray-500"}
          cursor-pointer text-gray-300`}
      >
        <div className="flex flex-wrap gap-1">
          {selectedWells.length > 0 ? (
            selectedWells.map((well) => (
              <div
                key={well.value}
                className="flex items-center gap-1 rounded-full bg-[#AC7D0C] px-2 py-1 text-xs"
              >
                {well.label}
                <button
                  onClick={(e) => handleRemove(well.value, e)}
                  className="ml-1 rounded-full p-0.5 hover:bg-[#ac7d0c]"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {well.label}</span>
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-500">Select wells...</span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-700 bg-[#0F0F0F] shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search wells..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-gray-900 p-2 text-sm text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {filteredWells.length > 0 ? (
              filteredWells.map((well) => {
                const isSelected = selectedWells.some((item) => item.value === well.value);
                return (
                  <li
                    key={well.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(well);
                    }}
                    className={`flex cursor-pointer items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700
                      ${isSelected ? "bg-[#a77605]" : ""}`}
                  >
                    <div
                      className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                        isSelected ? "border-blue-500 bg-[#a77605]" : "border-gray-600"
                      }`}
                    >
                      {isSelected && <Check className="h-4 w-4 text-blue-500" />}
                    </div>
                    {well.label}
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">No wells found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}