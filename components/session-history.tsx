"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

type SessionHistoryProps = {
  onSessionSelect: (sessionId: string) => void
}

export function SessionHistory({ onSessionSelect }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // In a real app, this would fetch from an API
    const savedSessions = JSON.parse(localStorage.getItem("tinkSessions") || "[]")

    // Add some mock data if no sessions exist
    if (savedSessions.length === 0) {
      const mockSessions = [
        {
          id: "abc123",
          title: "Product Roadmap Planning",
          description: "Quarterly planning session for Q3 2023",
          startTime: "2023-06-15T10:00",
          duration: "90",
          maxParticipants: "25",
          createdAt: "2023-06-10T08:30:00Z",
          status: "completed",
        },
        {
          id: "def456",
          title: "Marketing Campaign Brainstorm",
          description: "Ideation for summer campaign",
          startTime: "2023-07-20T14:00",
          duration: "60",
          maxParticipants: "20",
          createdAt: "2023-07-15T11:20:00Z",
          status: "completed",
        },
        {
          id: "ghi789",
          title: "Team Retrospective",
          description: "Monthly team retrospective",
          startTime: "2023-08-05T09:00",
          duration: "45",
          maxParticipants: "30",
          createdAt: "2023-08-01T16:45:00Z",
          status: "upcoming",
        },
      ]

      setSessions([...mockSessions, ...savedSessions])
    } else {
      setSessions(savedSessions)
    }
  }, [])

  useEffect(() => {
    let filtered = [...sessions]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (session) =>
          session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((session) => session.status === statusFilter)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

    setFilteredSessions(filtered)
  }, [sessions, searchTerm, statusFilter])

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No sessions found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="flex items-start gap-2">
                      <h3 className="text-xl font-semibold">{session.title}</h3>
                      {getStatusBadge(session.status)}
                    </div>

                    {session.description && <p className="text-gray-600">{session.description}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(session.startTime)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.duration} minutes
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Max {session.maxParticipants} participants
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Button variant="outline" className="ml-auto" onClick={() => onSessionSelect(session.id)}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
