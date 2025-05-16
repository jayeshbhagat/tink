"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Play } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Message = {
  id: string
  sender: string
  color: string
  text: string
  timestamp: string
}

type ChatPanelProps = {
  messages: Message[]
  onSendMessage: (text: string, color: string) => void
  disabled?: boolean
  showColorSelector?: boolean
  currentColor?: string
  excludeBlue?: boolean
  onStartSimulation?: () => void
  simulationActive?: boolean
}

export function ChatPanel({
  messages,
  onSendMessage,
  disabled = false,
  showColorSelector = false,
  currentColor = "blue", // Default to blue for facilitator
  excludeBlue = false,
  onStartSimulation,
  simulationActive = false,
}: ChatPanelProps) {
  const [messageText, setMessageText] = useState("")
  const [selectedColor, setSelectedColor] = useState(currentColor)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedColor(currentColor)
  }, [currentColor])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (messageText.trim() && !disabled) {
      onSendMessage(messageText, selectedColor)
      setMessageText("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getColorStyles = (color: string) => {
    const styles: Record<string, string> = {
      blue: "bg-blue-100 border-blue-300",
      white: "bg-gray-100 border-gray-300",
      red: "bg-red-100 border-red-300",
      black: "bg-gray-800 text-white border-gray-600",
      yellow: "bg-yellow-100 border-yellow-300",
      green: "bg-green-100 border-green-300",
    }
    return styles[color] || "bg-gray-100 border-gray-300"
  }

  const getColorIndicator = (color: string) => {
    const styles: Record<string, string> = {
      blue: "bg-blue-500",
      white: "bg-white border border-gray-300",
      red: "bg-red-500",
      black: "bg-black",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
    }
    return styles[color] || "bg-gray-500"
  }

  const getColorName = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "Blue",
      white: "White",
      red: "Red",
      black: "Black",
      yellow: "Yellow",
      green: "Green",
    }
    return colorMap[color] || color
  }

  // Define available colors for the dropdown
  const availableColors = [
    { name: "Blue", value: "blue" },
    { name: "White", value: "white" },
    { name: "Red", value: "red" },
    { name: "Black", value: "black" },
    { name: "Yellow", value: "yellow" },
    { name: "Green", value: "green" },
  ]

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto flex flex-col" style={{ height: "100%" }}>
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <div className="flex items-center mb-1">
                  <div className={`w-3 h-3 rounded-full ${getColorIndicator(message.color)} mr-2`}></div>
                  <span className="font-medium text-sm">{message.sender}</span>
                  <span className="text-xs text-gray-500 ml-2">{formatTime(message.timestamp)}</span>
                </div>
                <div className={`p-3 rounded-lg border ${getColorStyles(message.color)}`}>{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-4">No messages yet</p>
            {onStartSimulation && !simulationActive && (
              <Button onClick={onStartSimulation} variant="link" className="text-blue-600 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Simulate Active Chat
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="flex-shrink-0" disabled={disabled}>
                <div className={`w-5 h-5 rounded-full ${getColorIndicator(selectedColor)}`}></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="p-2">
              {availableColors.map((color) => (
                <DropdownMenuItem key={color.value} onClick={() => setSelectedColor(color.value)}>
                  <div className="flex items-center py-1">
                    <div className={`w-5 h-5 rounded-full ${getColorIndicator(color.value)} mr-3`}></div>
                    <span>{color.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={disabled || !messageText.trim()}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
