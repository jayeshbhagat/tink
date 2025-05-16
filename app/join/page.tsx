"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TinkLogo } from "@/components/tink-logo"

export default function JoinSession() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!sessionId.trim()) {
      setError("Please enter a valid session ID or link")
      return
    }

    // Extract session ID if a full URL was pasted
    let extractedId = sessionId
    if (sessionId.includes("/session/")) {
      const parts = sessionId.split("/session/")
      if (parts.length > 1) {
        extractedId = parts[1].split("/")[0]
      }
    }

    // In a real app, you would validate that the session exists
    router.push(`/session/${extractedId}/participant?name=${encodeURIComponent(name)}`)
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="container mx-auto max-w-md">
        <Link href="/" className="inline-flex items-center text-blue-600 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <TinkLogo size={120} className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold">Join a Tink Session</h1>
          <p className="text-gray-600 mt-2">Enter your name and the session ID to join</p>
        </div>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl">Join a Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionId">Session ID or Link</Label>
                <Input
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => {
                    setSessionId(e.target.value)
                    setError("")
                  }}
                  placeholder="Paste session link or ID"
                  required
                  className="border-gray-300"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Join Session
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
