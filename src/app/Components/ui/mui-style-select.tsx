"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

interface MuiStyleSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  fullWidth?: boolean;
  className?: string;
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
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const hasValue = !!selectedOption;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={selectRef}
      className={cn("relative", fullWidth && "w-full", className)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {label && (
        <label
          className={cn(
            "absolute left-3 transition-all pointer-events-none z-10 text-gray-400",
            isFocused || hasValue
              ? "-top-2 text-xs  px-1"
              : "top-1/2 -translate-y-1/2 text-sm"
          )}
        >
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer transition-all bg-[#0f0f0f] text-gray-100",
          isFocused || isOpen
            ? "border-amber-500 shadow-[0_0_0_2px_rgba(251,191,36,0.3)]"
            : "border-gray-600 hover:border-gray-500",
          error && "border-red-500",
          label && "pt-4 pb-1",
          "w-full"
        )}
      >
        <span className={hasValue ? "text-gray-100" : "text-gray-500"}>
          {selectedOption?.label || "Select..."}
        </span>
        <ChevronDown
          className={cn("h-5 w-5 text-gray-400 transition-transform", isOpen && "rotate-180")}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border  bg-[#0f0f0f] shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "px-3 py-2 cursor-pointer text-gray-100 hover:bg-gray-700",
                option.value === value && " text-amber-400"
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}