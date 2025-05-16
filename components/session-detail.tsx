"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Download, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

type Session = {
  id: string
  title: string
  description: string
  startTime: string
  duration: string
  maxParticipants: string
  createdAt: string
  status: "completed" | "upcoming" | "active" | "cancelled"
}

type Contribution = {
  id: string
  participantName: string
  hatColor: string
  text: string
  timestamp: string
}

type SessionDetailProps = {
  sessionId: string
  onBack: () => void
}

export function SessionDetail({ sessionId, onBack }: SessionDetailProps) {
  const { toast } = useToast()
  const [session, setSession] = useState<Session | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [participants, setParticipants] = useState<{ name: string; hatColor: string }[]>([])
  const [activeTab, setActiveTab] = useState("summary")

  useEffect(() => {
    // In a real app, this would fetch from an API
    const savedSessions = JSON.parse(localStorage.getItem("tinkSessions") || "[]")
    const foundSession = savedSessions.find((s: Session) => s.id === sessionId)

    if (foundSession) {
      setSession(foundSession)
    } else {
      // Mock data for demo purposes
      setSession({
        id: sessionId,
        title: "Product Roadmap Planning",
        description: "Quarterly planning session for Q3 2023",
        startTime: "2023-06-15T10:00",
        duration: "90",
        maxParticipants: "25",
        createdAt: "2023-06-10T08:30:00Z",
        status: "completed",
      })
    }

    // Mock contributions data
    setContributions([
      {
        id: "c1",
        participantName: "Alex Johnson",
        hatColor: "white",
        text: "Our current market share is 23% according to the latest industry report.",
        timestamp: "2023-06-15T10:05:00Z",
      },
      {
        id: "c2",
        participantName: "Jamie Smith",
        hatColor: "red",
        text: "I'm concerned about the aggressive timeline for the new feature rollout.",
        timestamp: "2023-06-15T10:12:00Z",
      },
      {
        id: "c3",
        participantName: "Taylor Wong",
        hatColor: "yellow",
        text: "The new pricing model could increase our revenue by up to 15%.",
        timestamp: "2023-06-15T10:18:00Z",
      },
      {
        id: "c4",
        participantName: "Morgan Lee",
        hatColor: "black",
        text: "We need to consider the potential impact on customer support if we launch all features at once.",
        timestamp: "2023-06-15T10:25:00Z",
      },
      {
        id: "c5",
        participantName: "Casey Rivera",
        hatColor: "green",
        text: "What if we created a tiered rollout strategy based on customer segments?",
        timestamp: "2023-06-15T10:32:00Z",
      },
      {
        id: "c6",
        participantName: "Alex Johnson",
        hatColor: "blue",
        text: "Let's summarize the key action items from today's discussion.",
        timestamp: "2023-06-15T10:40:00Z",
      },
    ])

    // Mock participants data
    setParticipants([
      { name: "Alex Johnson", hatColor: "blue" },
      { name: "Jamie Smith", hatColor: "red" },
      { name: "Taylor Wong", hatColor: "yellow" },
      { name: "Morgan Lee", hatColor: "black" },
      { name: "Casey Rivera", hatColor: "green" },
      { name: "Jordan Patel", hatColor: "white" },
    ])
  }, [sessionId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Upcoming
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Active
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getHatColorStyles = (color: string) => {
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

  const getHatName = (color: string) => {
    const names: Record<string, string> = {
      blue: "Blue (Process)",
      white: "White (Facts)",
      red: "Red (Emotions)",
      black: "Black (Caution)",
      yellow: "Yellow (Benefits)",
      green: "Green (Creativity)",
    }
    return names[color] || color
  }

  const downloadPDF = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "PDF Export",
      description: "Session summary PDF has been downloaded.",
    })
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p>Loading session details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Session List
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{session.title}</h1>
            {getStatusBadge(session.status)}
          </div>
          <p className="text-gray-600">{session.description}</p>
        </div>

        <Button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" /> Export Summary
        </Button>
      </div>

      <Card className="border border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{formatDate(session.startTime)}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{session.duration} minutes</p>
              </div>
            </div>

            <div className="flex items-center">
              <Users className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="font-medium">
                  {participants.length} / {session.maxParticipants}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-0">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Session Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Key Insights</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Current market share is 23% according to latest reports</li>
                    <li>New pricing model could increase revenue by up to 15%</li>
                    <li>Concerns about aggressive timeline for feature rollout</li>
                    <li>Potential impact on customer support with simultaneous launches</li>
                    <li>Proposed tiered rollout strategy based on customer segments</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Hat Distribution</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {["blue", "white", "red", "black", "yellow", "green"].map((color) => {
                      const count = participants.filter((p) => p.hatColor === color).length
                      return (
                        <div key={color} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                          <div className={`w-6 h-6 rounded-full ${getHatColorStyles(color)} mb-2`}></div>
                          <p className="font-medium">{color.charAt(0).toUpperCase() + color.slice(1)}</p>
                          <p className="text-sm text-gray-500">{count} participants</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Session Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-24 text-sm text-gray-500">10:00 AM</div>
                      <div className="ml-2 p-2 bg-blue-50 rounded border border-blue-100 flex-1">
                        Session started - Blue hat introduction
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm text-gray-500">10:15 AM</div>
                      <div className="ml-2 p-2 bg-gray-50 rounded border border-gray-100 flex-1">
                        White hat phase - Facts and data sharing
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm text-gray-500">10:30 AM</div>
                      <div className="ml-2 p-2 bg-red-50 rounded border border-red-100 flex-1">
                        Red hat phase - Emotional responses
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm text-gray-500">10:45 AM</div>
                      <div className="ml-2 p-2 bg-yellow-50 rounded border border-yellow-100 flex-1">
                        Yellow hat phase - Benefits and opportunities
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm text-gray-500">11:00 AM</div>
                      <div className="ml-2 p-2 bg-black bg-opacity-5 rounded border border-gray-200 flex-1">
                        Black hat phase - Cautions and risks
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm text-gray-500">11:15 AM</div>
                      <div className="ml-2 p-2 bg-green-50 rounded border border-green-100 flex-1">
                        Green hat phase - Creative solutions
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm text-gray-500">11:30 AM</div>
                      <div className="ml-2 p-2 bg-blue-50 rounded border border-blue-100 flex-1">
                        Session wrap-up - Blue hat summary
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributions" className="mt-0">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Contributions by Hat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {["blue", "white", "red", "black", "yellow", "green"].map((hatColor) => {
                  const hatContributions = contributions.filter((c) => c.hatColor === hatColor)
                  if (hatContributions.length === 0) return null

                  return (
                    <div key={hatColor} className="space-y-4">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${getHatColorStyles(hatColor)} mr-2`}></div>
                        <h3 className="text-lg font-medium">{getHatName(hatColor)}</h3>
                      </div>

                      <div className="space-y-3 pl-6">
                        {hatContributions.map((contribution) => (
                          <div key={contribution.id} className="border-l-2 border-gray-200 pl-4 py-1">
                            <div className="flex justify-between items-start">
                              <p className="font-medium">{contribution.participantName}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(contribution.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <p className="text-gray-700">{contribution.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="mt-0">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-full ${getHatColorStyles(participant.hatColor)} flex items-center justify-center mr-3`}
                    >
                      <span
                        className={`text-sm font-medium ${participant.hatColor === "white" ? "text-gray-800" : "text-white"}`}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-xs text-gray-500">{getHatName(participant.hatColor)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
