"use client"

import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

type ColorBlockProps = {
  color: string
  status: "idle" | "speaking" | "waiting"
  timeLeft?: number
  onClick?: () => void
  disabled?: boolean
}

export function ColorBlock({ color, status, timeLeft = 0, onClick, disabled = false }: ColorBlockProps) {
  const maxTime = 60 // 1 minute in seconds
  const percentage = (timeLeft / maxTime) * 100

  const getColorStyles = (color: string) => {
    const styles: Record<string, Record<string, string>> = {
      blue: {
        bg: "bg-blue-500",
        hover: "hover:bg-blue-600",
        text: "text-white",
        border: "",
      },
      white: {
        bg: "bg-white",
        hover: "hover:bg-gray-100",
        text: "text-gray-800",
        border: "border border-gray-300",
      },
      red: {
        bg: "bg-red-500",
        hover: "hover:bg-red-600",
        text: "text-white",
        border: "",
      },
      black: {
        bg: "bg-black",
        hover: "hover:bg-gray-800",
        text: "text-white",
        border: "",
      },
      yellow: {
        bg: "bg-yellow-500",
        hover: "hover:bg-yellow-600",
        text: "text-gray-800",
        border: "",
      },
      green: {
        bg: "bg-green-500",
        hover: "hover:bg-green-600",
        text: "text-white",
        border: "",
      },
    }
    return styles[color] || styles.blue
  }

  const colorStyles = getColorStyles(color)
  const colorName = color.charAt(0).toUpperCase() + color.slice(1)
  const colorDescription = {
    blue: "Process",
    white: "Facts",
    red: "Emotions",
    black: "Caution",
    yellow: "Benefits",
    green: "Creativity",
  }[color]

  const getProgressBarColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "#3b82f6",
      white: "#e5e7eb",
      red: "#ef4444",
      black: "#000000",
      yellow: "#eab308",
      green: "#22c55e",
    }
    return colors[color] || colors.blue
  }

  return (
    <div
      className={`relative w-40 h-40 rounded-lg ${colorStyles.bg} ${
        !disabled && status === "idle" ? colorStyles.hover : ""
      } ${colorStyles.text} ${
        colorStyles.border
      } flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      } ${status === "waiting" ? "animate-pulse" : ""}`}
      onClick={() => {
        if (!disabled && status === "idle" && onClick) {
          onClick()
        }
      }}
    >
      {status === "speaking" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full">
            <CircularProgressbar
              value={percentage}
              strokeWidth={5}
              styles={buildStyles({
                strokeLinecap: "butt",
                pathColor: getProgressBarColor(color),
                trailColor: "rgba(255, 255, 255, 0.3)",
              })}
            />
          </div>
        </div>
      )}

      <div className="text-center z-10 p-4">
        <div className="text-2xl font-bold mb-1">{colorName}</div>
        <div className="text-sm opacity-90">{colorDescription}</div>
        {status === "idle" && !disabled && <div className="mt-3 text-xs opacity-80">Tap to speak</div>}
        {status === "speaking" && (
          <div className="mt-3 text-xs">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        )}
        {status === "waiting" && <div className="mt-3 text-xs opacity-80">Waiting...</div>}
      </div>
    </div>
  )
}
