"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Badge } from "../ui/badge"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"

const wells = [
  { value: "sph-01", label: "SPH-01" },
  { value: "sph-02", label: "SPH-02" },
  { value: "sph-03", label: "SPH-03" },
  { value: "sph-04", label: "SPH-04" },
  { value: "sph-05", label: "SPH-05" },
]

export default function MultiSelectWells() {
  const [open, setOpen] = useState(false)
  const [selectedWells, setSelectedWells] = useState([
    { value: "sph-02", label: "SPH-02" },
    { value: "sph-03", label: "SPH-03" },
  ])

  const handleSelect = (well: { value: string; label: string }) => {
    if (selectedWells.some((item) => item.value === well.value)) {
      setSelectedWells(selectedWells.filter((item) => item.value !== well.value))
    } else {
      setSelectedWells([...selectedWells, well])
    }
  }

  const handleRemove = (wellValue: string) => {
    setSelectedWells(selectedWells.filter((item) => item.value !== wellValue))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 py-2"
        >
          {selectedWells.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedWells.map((well) => (
                <Badge
                  key={well.value}
                  variant="outline"
                  className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"
                >
                  {well.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-red-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(well.value)
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {well.label}</span>
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">Select wells...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search wells..." />
          <CommandList>
            <CommandEmpty>No well found.</CommandEmpty>
            <CommandGroup>
              {wells.map((well) => {
                const isSelected = selectedWells.some((item) => item.value === well.value)
                return (
                  <CommandItem
                    key={well.value}
                    value={well.value}
                    onSelect={() => {
                      handleSelect(well)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                          isSelected ? "bg-primary border-primary" : "opacity-50"
                        }`}
                      >
                        {isSelected && <span className="h-2 w-2 rounded-sm bg-white" />}
                      </div>
                      <span>{well.label}</span>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
