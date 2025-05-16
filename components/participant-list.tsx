"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Clock, Mic, Square } from "lucide-react"
import { HatIcon } from "@/components/hat-icon"
import { useState, useEffect } from "react"

type Participant = {
  id: string
  name: string
  color: string
  status: "idle" | "speaking" | "waiting"
}

type ParticipantListProps = {
  participants: Participant[]
  onParticipantSpeak: (id: string) => void
  onStopSpeaking?: (id: string) => void
  onChangeColor: (id: string, color: string) => void
  disabled?: boolean
  viewOnly?: boolean
  currentSpeaker?: string | null
  excludeBlue?: boolean
  speakingTimeSeconds?: number
}

export function ParticipantList({
  participants,
  onParticipantSpeak,
  onStopSpeaking,
  onChangeColor,
  disabled = false,
  viewOnly = false,
  currentSpeaker = null,
  excludeBlue = false,
  speakingTimeSeconds = 120, // Default to 2 minutes
}: ParticipantListProps) {
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({})

  useEffect(() => {
    // Initialize timer for current speaker
    if (currentSpeaker) {
      setTimeLeft((prev) => ({ ...prev, [currentSpeaker]: speakingTimeSeconds }))
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTimeLeft = { ...prev }

        // Update timer for current speaker
        if (currentSpeaker && newTimeLeft[currentSpeaker]) {
          newTimeLeft[currentSpeaker] = Math.max(0, newTimeLeft[currentSpeaker] - 1)
        }

        return newTimeLeft
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentSpeaker, speakingTimeSeconds])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getColorName = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "Blue (Process)",
      white: "White (Facts)",
      red: "Red (Emotions)",
      black: "Black (Caution)",
      yellow: "Yellow (Benefits)",
      green: "Green (Creativity)",
    }
    return colorMap[color] || color
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      idle: "Idle",
      speaking: "Speaking",
      waiting: "Waiting to speak",
    }
    return statusMap[status] || status
  }

  const getColorStyles = (color: string) => {
    if (!color) return "bg-gray-300 text-white" // Default for participants with no color

    const styles: Record<string, string> = {
      blue: "bg-blue-500 text-white",
      white: "bg-white border border-gray-300 text-gray-800",
      red: "bg-red-500 text-white",
      black: "bg-black text-white",
      yellow: "bg-yellow-500 text-gray-800",
      green: "bg-green-500 text-white",
    }
    return styles[color] || "bg-gray-500 text-white"
  }

  // Define available colors for color change dropdown
  const availableColors = [
    { name: "White", value: "white" },
    { name: "Red", value: "red" },
    { name: "Black", value: "black" },
    { name: "Yellow", value: "yellow" },
    { name: "Green", value: "green" },
  ]

  // Add blue only if not excluded
  if (!excludeBlue) {
    availableColors.unshift({ name: "Blue", value: "blue" })
  }

  // Group participants by color
  const groupedParticipants: Record<string, Participant[]> = {}

  // First, group waiting participants at the top
  const waitingParticipants = participants.filter((p) => p.status === "waiting")

  // Then group the rest by color
  const nonWaitingParticipants = participants.filter((p) => p.status !== "waiting")

  // Group non-waiting participants by color
  nonWaitingParticipants.forEach((participant) => {
    if (!groupedParticipants[participant.color]) {
      groupedParticipants[participant.color] = []
    }
    groupedParticipants[participant.color].push(participant)
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Participants ({participants.length})</h2>
      </div>

      {participants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No participants have joined yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Show waiting participants first */}
          {waitingParticipants.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Waiting to Speak</h3>
              {waitingParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-yellow-50 border-yellow-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <HatIcon color={participant.color} className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{participant.name}</p>
                        <div className="ml-2 flex items-center text-yellow-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="text-xs">Waiting</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{getColorName(participant.color)}</p>
                    </div>
                  </div>

                  {!viewOnly && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                      onClick={() => onParticipantSpeak(participant.id)}
                      disabled={disabled || currentSpeaker !== null}
                    >
                      <Mic className="h-4 w-4 mr-1" />
                      Enable Speaking
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Show grouped participants by color */}
          {Object.entries(groupedParticipants).map(([color, colorParticipants]) => (
            <div key={color} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${getColorStyles(color).split(" ")[0]}`}></div>
                {getColorName(color)} ({colorParticipants.length})
              </h3>
              {colorParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className={`flex items-center justify-between p-3 border rounded-lg shadow-sm ${
                    participant.id === currentSpeaker ? "bg-green-50 border-green-200" : "bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <HatIcon color={participant.color} className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{participant.name}</p>
                      </div>
                      <p className="text-xs text-gray-500">{getColorName(participant.color)}</p>
                    </div>
                  </div>

                  {!viewOnly && (
                    <div className="flex items-center space-x-2">
                      {participant.status === "speaking" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
                          onClick={() => onStopSpeaking && onStopSpeaking(participant.id)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Speaking ({formatTime(timeLeft[participant.id] || 0)})</span>
                          <Square className="h-3 w-3 ml-1 fill-current" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                          onClick={() => onParticipantSpeak(participant.id)}
                          disabled={disabled || currentSpeaker !== null}
                        >
                          <Mic className="h-4 w-4 mr-1" />
                          Enable Speaking
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={disabled}>
                          <Button variant="outline" size="sm">
                            Change Hat
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Dynamically generate color options */}
                          {availableColors.map((color) => (
                            <DropdownMenuItem
                              key={color.value}
                              onClick={() => onChangeColor(participant.id, color.value)}
                            >
                              Change to {color.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
