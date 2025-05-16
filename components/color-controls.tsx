"use client"

import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

type ColorControlsProps = {
  onSetGlobalColor: (color: string) => void
  onReshuffle: () => void
  disabled?: boolean
  excludeBlue?: boolean
}

export function ColorControls({
  onSetGlobalColor,
  onReshuffle,
  disabled = false,
  excludeBlue = false,
}: ColorControlsProps) {
  // Define all colors
  const allColors = [
    { name: "White", value: "white", description: "Facts" },
    { name: "Red", value: "red", description: "Emotions" },
    { name: "Black", value: "black", description: "Caution" },
    { name: "Yellow", value: "yellow", description: "Benefits" },
    { name: "Green", value: "green", description: "Creativity" },
  ]

  // Filter out blue if excludeBlue is true
  const colors = excludeBlue ? allColors : [{ name: "Blue", value: "blue", description: "Process" }, ...allColors]

  const getColorStyles = (color: string) => {
    const styles: Record<string, string> = {
      blue: "bg-blue-500 hover:bg-blue-600 text-white",
      white: "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300",
      red: "bg-red-500 hover:bg-red-600 text-white",
      black: "bg-black hover:bg-gray-800 text-white",
      yellow: "bg-yellow-500 hover:bg-yellow-600 text-gray-800",
      green: "bg-green-500 hover:bg-green-600 text-white",
    }
    return styles[color] || ""
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Global Color Control</h2>
        <Button variant="outline" onClick={onReshuffle} disabled={disabled} className="flex items-center gap-2">
          <Shuffle className="h-4 w-4" />
          Reshuffle
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {colors.map((color) => (
          <Button
            key={color.value}
            className={`${getColorStyles(color.value)} h-16 flex flex-col items-center justify-center`}
            onClick={() => onSetGlobalColor(color.value)}
            disabled={disabled}
          >
            <span className="font-medium">{color.name}</span>
            <span className="text-xs mt-1">{color.description}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
