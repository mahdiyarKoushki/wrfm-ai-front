"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "./utils"


interface MuiStyleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export default function MuiStyleInput({ label, error, className, fullWidth = false, ...props }: MuiStyleInputProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = props.value !== undefined && props.value !== ""

  return (
    <div className={cn("relative", fullWidth ? "w-full" : "w-auto")}>
      {label && (
        <label
          className={cn(
            "absolute left-3 transition-all pointer-events-none",
            focused || hasValue
              ? "-top-2 text-xs bg-white px-1 "
              : "top-1/2 -translate-y-1/2 text-gray-500",
          )}
        >
          {label}
        </label>
      )}
      <input
        className={cn(
          "border rounded-md px-3 py-2 w-full transition-all outline-none",
          focused ? " shadow-[0_0_0_2px_rgba(25,118,210,0.2)]" : "border-gray-300 hover:border-gray-400",
          error ? "border-red-500" : "",
          label ? "pt-4 pb-1" : "",
          className,
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
