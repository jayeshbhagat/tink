"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CreateSessionForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    duration: "",
    maxParticipants: "30",
  })
  const [sessionCreated, setSessionCreated] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a random session ID (in a real app, this would come from the backend)
    const newSessionId = Math.random().toString(36).substring(2, 10)
    setSessionId(newSessionId)
    setSessionCreated(true)

    // Ensure duration has a default value if not provided
    const sessionData = {
      id: newSessionId,
      ...formData,
      duration: formData.duration || "20", // Default to 20 minutes if not specified
      createdAt: new Date().toISOString(),
      status: "upcoming",
    }

    // Save to local storage for demo purposes
    const existingSessions = JSON.parse(localStorage.getItem("tinkSessions") || "[]")
    localStorage.setItem("tinkSessions", JSON.stringify([...existingSessions, sessionData]))

    toast({
      title: "Session created",
      description: "Your new session has been created successfully.",
    })
  }

  const copyToClipboard = () => {
    const sessionLink = `${window.location.origin}/session/${sessionId}/participant`
    navigator.clipboard.writeText(sessionLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const startSession = () => {
    router.push(`/session/${sessionId}`)
  }

  return (
    <Card className="border border-gray-200 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{sessionCreated ? "Session Created" : "Create a New Session"}</CardTitle>
      </CardHeader>
      <CardContent>
        {!sessionCreated ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title*</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Team Strategy Meeting"
                required
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the session goals and agenda"
                rows={4}
                className="border-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)*</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="10"
                  max="180"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="60"
                  required
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="2"
                max="50"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="border-gray-300"
              />
              <p className="text-xs text-gray-500">Limit: 20-50 participants</p>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Create Session
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Session Details</h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Title:</span> {formData.title}
              </p>
              {formData.description && (
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Description:</span> {formData.description}
                </p>
              )}
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Start Time:</span> {new Date(formData.startTime).toLocaleString()}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Duration:</span> {formData.duration} minutes
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Max Participants:</span> {formData.maxParticipants}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Share this link with participants</Label>
              <div className="flex">
                <Input
                  readOnly
                  value={`${window.location.origin}/session/${sessionId}/participant`}
                  className="rounded-r-none border-gray-300"
                />
                <Button type="button" variant="outline" className="rounded-l-none border-l-0" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button onClick={startSession} className="w-full bg-blue-600 hover:bg-blue-700">
              Start Session as Facilitator
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
