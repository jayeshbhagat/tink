"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TinkLogo } from "@/components/tink-logo"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CreateSessionForm } from "@/components/create-session-form"
import { SessionHistory } from "@/components/session-history"
import { SessionDetail } from "@/components/session-detail"

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId)
  }

  const handleBackToHistory = () => {
    setSelectedSession(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="py-4 px-6 border-b border-gray-100">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="inline-flex items-center text-blue-600 mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          <TinkLogo size={80} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center w-full">Session Management</h1>

        {selectedSession ? (
          <div className="w-full max-w-4xl">
            <SessionDetail sessionId={selectedSession} onBack={handleBackToHistory} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="create">Create New Session</TabsTrigger>
              <TabsTrigger value="history">Session History</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-0 flex justify-center">
              <div className="w-full">
                <CreateSessionForm />
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0 flex justify-center">
              <div className="w-full">
                <SessionHistory onSessionSelect={handleSessionSelect} />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
