"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Check, ChevronDown } from "lucide-react"

interface Well {
  value: string
  label: string
}

const wells: Well[] = [
  { value: "sph-01", label: "SPH-01" },
  { value: "sph-02", label: "SPH-02" },
  { value: "sph-03", label: "SPH-03" },
  { value: "sph-04", label: "SPH-04" },
  { value: "sph-05", label: "SPH-05" },
]

export default function MuiStyleWellSelect() {
  const [open, setOpen] = useState(false)
  const [selectedWells, setSelectedWells] = useState<Well[]>([
    { value: "sph-02", label: "SPH-02" },
    { value: "sph-03", label: "SPH-03" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleSelect = (well: Well) => {
    if (selectedWells.some((item) => item.value === well.value)) {
      setSelectedWells(selectedWells.filter((item) => item.value !== well.value))
    } else {
      setSelectedWells([...selectedWells, well])
    }
  }

  const handleRemove = (wellValue: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setSelectedWells(selectedWells.filter((item) => item.value !== wellValue))
  }

  const filteredWells = wells.filter((well) => well.label.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* MUI-style select input */}
      <div
        onClick={() => setOpen(!open)}
        className={`flex min-h-[56px] w-2/3items-center justify-between rounded-md border px-3 py-2 text-sm transition-all
          ${open ? "border-blue-500 shadow-[0_0_0_2px_rgba(25,118,210,0.2)]" : "border-gray-300 hover:border-gray-400"}
          bg-white cursor-pointer`}
      >
        <div className="flex flex-wrap gap-1">
          {selectedWells.length > 0 ? (
            selectedWells.map((well) => (
              <div
                key={well.value}
                className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700"
              >
                {well.label}
                <button
                  onClick={(e) => handleRemove(well.value, e)}
                  className="ml-1 rounded-full p-0.5 hover:bg-blue-100"
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
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search wells..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1">
            {filteredWells.length > 0 ? (
              filteredWells.map((well) => {
                const isSelected = selectedWells.some((item) => item.value === well.value)
                return (
                  <li
                    key={well.value}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(well)
                    }}
                    className={`flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100
                      ${isSelected ? "bg-blue-50" : ""}`}
                  >
                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded border border-gray-400">
                      {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                    </div>
                    {well.label}
                  </li>
                )
              })
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">No wells found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
