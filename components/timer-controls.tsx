"use client"

import { Button } from "@/components/ui/button"

interface TimerControlsProps {
  onSetDuration: (minutes: number) => void
  selectedDuration: number | null
}

export function TimerControls({ onSetDuration, selectedDuration }: TimerControlsProps) {
  const durations = [
    { label: "10 min", value: 10 },
    { label: "15 min", value: 15 },
    { label: "20 min", value: 20 },
    { label: "40 min", value: 40 },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {durations.map((duration) => (
        <Button
          key={duration.value}
          variant={selectedDuration === duration.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSetDuration(duration.value)}
        >
          {duration.label}
        </Button>
      ))}
    </div>
  )
}
