"use client"

import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

type HatBlockProps = {
  color: string
  status: "idle" | "speaking" | "waiting"
  timeLeft?: number
  onClick?: () => void
  disabled?: boolean
}

export function HatBlock({ color, status, timeLeft = 0, onClick, disabled = false }: HatBlockProps) {
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

  // Hat SVG paths for each color
  const renderHat = (color: string) => {
    switch (color) {
      case "blue":
        return (
          <svg viewBox="0 0 100 80" className="w-24 h-24 mx-auto mb-2">
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#3b82f6"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
          </svg>
        )
      case "white":
        return (
          <svg viewBox="0 0 100 80" className="w-24 h-24 mx-auto mb-2">
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#ffffff"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" />
          </svg>
        )
      case "red":
        return (
          <svg viewBox="0 0 100 80" className="w-24 h-24 mx-auto mb-2">
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#ef4444"
              stroke="#dc2626"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
          </svg>
        )
      case "black":
        return (
          <svg viewBox="0 0 100 80" className="w-24 h-24 mx-auto mb-2">
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#000000"
              stroke="#374151"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#000000" stroke="#374151" strokeWidth="2" />
          </svg>
        )
      case "yellow":
        return (
          <svg viewBox="0 0 100 80" className="w-24 h-24 mx-auto mb-2">
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#eab308"
              stroke="#ca8a04"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          </svg>
        )
      case "green":
        return (
          <svg viewBox="0 0 100 80" className="w-24 h-24 mx-auto mb-2">
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#22c55e"
              stroke="#16a34a"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
          </svg>
        )
      default:
        return (
          <svg viewBox="0 0 100 80" className="w-24 h-24 mx-auto mb-2">
            <path
              d="M20,60 C20,40 40,30 50,30 C60,30 80,40 80,60 L90,60 C90,60 95,65 95,70 C95,75 90,75 90,75 L10,75 C10,75 5,75 5,70 C5,65 10,60 10,60 L20,60 Z"
              fill="#3b82f6"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <rect x="40" y="20" width="20" height="10" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
          </svg>
        )
    }
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
        {renderHat(color)}
        <div className="text-xl font-bold">{colorName}</div>
        <div className="text-sm opacity-90">{colorDescription}</div>
        {status === "idle" && !disabled && <div className="mt-2 text-xs opacity-80">Tap to speak</div>}
        {status === "speaking" && (
          <div className="mt-2 text-xs">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        )}
        {status === "waiting" && <div className="mt-2 text-xs opacity-80">Waiting...</div>}
      </div>
    </div>
  )
}
