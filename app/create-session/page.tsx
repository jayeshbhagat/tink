"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"
import { TinkLogo } from "@/components/tink-logo"

export default function CreateSession() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
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
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center text-blue-600 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <TinkLogo size={120} className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold">Create a Tink Session</h1>
          <p className="text-gray-600 mt-2">Set up a new thinking session for your team</p>
        </div>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl">{sessionCreated ? "Session Created" : "Create a New Session"}</CardTitle>
          </CardHeader>
          <CardContent>
            {!sessionCreated ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Session Title</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time (Optional)</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="border-gray-300"
                  />
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
                  {formData.startTime && (
                    <p className="text-gray-600">
                      <span className="font-medium">Start Time:</span> {new Date(formData.startTime).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Share this link with participants</Label>
                  <div className="flex">
                    <Input
                      readOnly
                      value={`${window.location.origin}/session/${sessionId}/participant`}
                      className="rounded-r-none border-gray-300"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={copyToClipboard}
                    >
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
      </div>
    </div>
  )
}
