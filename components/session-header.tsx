"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Copy, Check, Pause, Play } from "lucide-react"
import { useState } from "react"

type SessionHeaderProps = {
  title: string
  sessionId: string
  isActive: boolean
  isPaused?: boolean
  onToggleSession: () => void
  onTogglePause?: () => void
  logo?: React.ReactNode
  timer?: React.ReactNode
}

export function SessionHeader({
  title,
  sessionId,
  isActive,
  isPaused = false,
  onToggleSession,
  onTogglePause,
  logo,
  timer,
}: SessionHeaderProps) {
  const [copied, setCopied] = useState(false)

  const copySessionLink = () => {
    const sessionLink = `${window.location.origin}/session/${sessionId}/participant`
    navigator.clipboard.writeText(sessionLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          {logo}
          <div className="ml-2">
            <h1 className="text-xl font-semibold">{title}</h1>
            <div className="flex items-center">
              <p className="text-sm text-gray-500 mr-2">Session ID: {sessionId}</p>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copySessionLink}>
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-gray-500" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {timer && <div className="mr-2">{timer}</div>}

          <div className="text-sm font-medium">
            Status:{" "}
            <span className={`${!isActive ? "text-gray-500" : isPaused ? "text-yellow-500" : "text-green-500"}`}>
              {!isActive ? "Inactive" : isPaused ? "Paused" : "Active"}
            </span>
          </div>

          {onTogglePause && isActive && (
            <Button onClick={onTogglePause} variant="outline" size="sm" className="px-2">
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          )}

          <Button onClick={onToggleSession} variant={isActive ? "destructive" : "default"} size="sm">
            {isActive ? "End Session" : "Start Session"}
          </Button>
        </div>
      </div>
    </header>
  )
}
