"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "./utils"


interface MuiStyleSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  error?: string
  fullWidth?: boolean
  className?: string
}

export default function MuiStyleSelect({
  label,
  value,
  onChange,
  options,
  error,
  fullWidth = false,
  className,
}: MuiStyleSelectProps) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)
  const hasValue = !!selectedOption

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={selectRef}
      className={cn("relative", fullWidth ? "w-full" : "w-auto", className)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {label && (
        <label
          className={cn(
            "absolute left-3 transition-all pointer-events-none z-10",
            focused || hasValue
              ? "-top-2 text-xs bg-white px-1 "
              : "top-1/2 -translate-y-1/2 text-gray-500",
          )}
        >
          {label}
        </label>
      )}
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer transition-all",
          focused || open
            ? " shadow-[0_0_0_2px_rgba(25,118,210,0.2)]"
            : "border-gray-300 hover:border-gray-400",
          error ? "border-red-500" : "",
          label ? "pt-4 pb-1" : "",
          "w-full",
        )}
      >
        <span className={hasValue ? "" : "text-gray-500"}>{selectedOption?.label || "Select..."}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "px-3 py-2 cursor-pointer hover:bg-gray-100",
                option.value === value ? "bg-blue-50 " : "",
              )}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
