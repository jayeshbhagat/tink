"use client"

import { useEffect } from "react"
import { Clock } from "lucide-react"

interface TimerProps {
  seconds: number
  paused?: boolean
  onTick?: () => void
}

export function Timer({ seconds, paused = false, onTick }: TimerProps) {
  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (paused) return

    const interval = setInterval(() => {
      if (onTick) onTick()
    }, 1000)

    return () => clearInterval(interval)
  }, [paused, onTick])

  return (
    <div className="flex items-center text-sm font-medium">
      <Clock className="h-3.5 w-3.5 mr-1" />
      <span>{formatTime(seconds)}</span>
    </div>
  )
}
