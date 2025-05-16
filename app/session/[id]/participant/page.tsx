"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TinkLogo } from "@/components/tink-logo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatPanel } from "@/components/chat-panel"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ParticipantList } from "@/components/participant-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timer } from "@/components/timer"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HatBlock } from "@/components/hat-block"

// Only participant colors (no blue)
const PARTICIPANT_COLORS = ["white", "red", "black", "yellow", "green"]

type Participant = {
  id: string
  name: string
  color: string
  status: "idle" | "speaking" | "waiting"
}

type Message = {
  id: string
  sender: string
  color: string
  text: string
  timestamp: string
}

export default function ParticipantView({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Join flow state
  const [isJoining, setIsJoining] = useState(true)
  const [name, setName] = useState(searchParams.get("name") || "")

  // Session state
  const [sessionActive, setSessionActive] = useState(false)
  const [inWaitingRoom, setInWaitingRoom] = useState(true)
  const [sessionPaused, setSessionPaused] = useState(false)
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null)

  // Participant state - initialize with a non-blue color
  const [myColor, setMyColor] = useState(PARTICIPANT_COLORS[Math.floor(Math.random() * PARTICIPANT_COLORS.length)])
  const [myStatus, setMyStatus] = useState<"idle" | "speaking" | "waiting">("idle")
  const [timeLeft, setTimeLeft] = useState(0)
  const [activeTab, setActiveTab] = useState("buzzer")

  // Shared session data
  const [participants, setParticipants] = useState<Participant[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSpeaker, setCurrentSpeaker] = useState<Participant | null>(null)

  // Handle joining the session
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsJoining(false)

    // In a real app, this would send a request to join the session
    const myId = Date.now().toString()

    // Don't assign a color initially - wait for session to start
    const me: Participant = {
      id: myId,
      name: name,
      color: "", // Empty color until session starts
      status: "idle",
    }

    // Add myself to participants
    setParticipants((prev) => [...prev, me])

    toast({
      title: "Joined session",
      description: "Waiting for the facilitator to start the session.",
    })
  }

  // Add a new message to the chat
  const sendMessage = (text: string, messageColor: string) => {
    // Ensure the message color is never blue
    const safeColor = messageColor === "blue" ? myColor : messageColor

    const newMessage = {
      id: Date.now().toString(),
      sender: name,
      color: safeColor,
      text: text,
      timestamp: new Date().toISOString(),
    }

    // In a real app, this would send the message to all participants
    setMessages((prev) => [...prev, newMessage])
  }

  // Helper functions for hat information - remove blue hat information
  const getHatTitle = (color: string) => {
    const titles: Record<string, string> = {
      white: "White Hat - Facts & Information",
      red: "Red Hat - Emotions & Feelings",
      black: "Black Hat - Caution & Critique",
      yellow: "Yellow Hat - Benefits & Optimism",
      green: "Green Hat - Creativity & Possibilities",
    }
    return titles[color] || "Unknown Hat"
  }

  const getHatDescription = (color: string) => {
    const descriptions: Record<string, string> = {
      white:
        "The White Hat focuses on available data, facts, and information without interpretation. It's about being neutral and objective in your thinking.",
      red: "The Red Hat gives permission to express emotions, feelings, and intuitions without justification. It's about acknowledging the role of emotions in decision-making.",
      black:
        "The Black Hat identifies risks, difficulties, and potential problems. It's about critical judgment and logical negative assessment.",
      yellow:
        "The Yellow Hat looks for benefits, value, and positive aspects. It's about optimism and constructive thinking.",
      green:
        "The Green Hat focuses on creativity, new ideas, and alternatives. It's about generating novel solutions and possibilities.",
    }
    return descriptions[color] || ""
  }

  const getHatGuidelines = (color: string) => {
    const guidelines: Record<string, string[]> = {
      white: [
        "Focus only on facts and information",
        "Be neutral and objective",
        "Avoid interpretations and opinions",
        "Identify information gaps",
        "Distinguish between verified facts and beliefs",
      ],
      red: [
        "Express your feelings and intuitions",
        "No need to justify or explain your emotions",
        "Be honest about your gut reactions",
        "Consider how others might feel",
        "Acknowledge emotional aspects of the topic",
      ],
      black: [
        "Identify risks and potential problems",
        "Point out logical flaws or weaknesses",
        "Consider what might go wrong",
        "Be specific about concerns",
        "Focus on why something might not work",
      ],
      yellow: [
        "Look for benefits and positive aspects",
        "Identify opportunities and advantages",
        "Consider best-case scenarios",
        "Find value in ideas, even flawed ones",
        "Be constructively optimistic",
      ],
      green: [
        "Generate new ideas and alternatives",
        "Think outside conventional boundaries",
        "Build on others' ideas",
        "Consider unusual approaches",
        "Suspend judgment while creating",
      ],
    }
    return guidelines[color] || []
  }

  const getHatQuestions = (color: string) => {
    const questions: Record<string, string[]> = {
      white: [
        "What facts do we know about this situation?",
        "What information is missing?",
        "What data is relevant to this decision?",
        "What evidence supports this?",
        "What are the verifiable facts?",
      ],
      red: [
        "How do you feel about this idea?",
        "What is your intuition telling you?",
        "What emotions does this situation evoke?",
        "What's your gut reaction?",
        "How might others feel about this?",
      ],
      black: [
        "What could go wrong?",
        "What are the risks or challenges?",
        "Why might this not work?",
        "What obstacles might we face?",
        "What are the logical flaws in this approach?",
      ],
      yellow: [
        "What are the benefits of this approach?",
        "What's the best possible outcome?",
        "What opportunities does this present?",
        "What value might this create?",
        "How could this work well?",
      ],
      green: [
        "What are some alternative approaches?",
        "How could we solve this differently?",
        "What if we tried something unexpected?",
        "How can we combine or modify existing ideas?",
        "What would be a creative solution?",
      ],
    }
    return questions[color] || []
  }

  const getHatBackgroundColor = (color: string) => {
    const bgColors: Record<string, string> = {
      white: "bg-gray-50 border border-gray-200",
      red: "bg-red-50 border border-red-200",
      black: "bg-gray-100 border border-gray-300",
      yellow: "bg-yellow-50 border border-yellow-200",
      green: "bg-green-50 border border-green-200",
    }
    return bgColors[color] || "bg-gray-50 border border-gray-200"
  }

  const getHatIndicatorColor = (color: string) => {
    const indicatorColors: Record<string, string> = {
      white: "bg-white border border-gray-300",
      red: "bg-red-500",
      black: "bg-black",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
    }
    return indicatorColors[color] || "bg-gray-500"
  }

  // Simulate receiving updates from the facilitator
  useEffect(() => {
    // Simulate session starting
    const sessionStartTimeout = setTimeout(() => {
      if (inWaitingRoom && !isJoining) {
        setInWaitingRoom(false)
        setSessionActive(true)

        // Now assign a color since the session is starting
        setMyColor(PARTICIPANT_COLORS[Math.floor(Math.random() * PARTICIPANT_COLORS.length)])

        // Update my color in participants list
        setParticipants((prev) =>
          prev.map((p) =>
            p.name === name
              ? { ...p, color: PARTICIPANT_COLORS[Math.floor(Math.random() * PARTICIPANT_COLORS.length)] }
              : p,
          ),
        )

        toast({
          title: "Session started",
          description: "The facilitator has started the session.",
        })
      }
    }, 5000) // Simulate after 5 seconds for demo

    return () => clearTimeout(sessionStartTimeout)
  }, [inWaitingRoom, isJoining, toast, name])

  // Handle timer countdown for speaking
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (myStatus === "speaking" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setMyStatus("idle")
            setCurrentSpeaker(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [myStatus, timeLeft])

  // Handle session timer
  useEffect(() => {
    let sessionTimer: NodeJS.Timeout

    if (sessionActive && !sessionPaused && sessionTimeRemaining !== null && sessionTimeRemaining > 0) {
      sessionTimer = setInterval(() => {
        setSessionTimeRemaining((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(sessionTimer)
            setSessionActive(false)
            toast({
              title: "Session ended",
              description: "The session time has ended.",
            })
            return 0
          }
          return prev !== null ? prev - 1 : null
        })
      }, 1000)
    }

    return () => clearInterval(sessionTimer)
  }, [sessionActive, sessionPaused, sessionTimeRemaining, toast])

  // Request to speak (buzzer)
  const requestToSpeak = () => {
    if (myStatus !== "idle" || !sessionActive || sessionPaused) return

    // In a real app, this would send a request to the facilitator
    setMyStatus("waiting")

    // Simulate facilitator approval after 2 seconds
    setTimeout(() => {
      setMyStatus("speaking")
      setTimeLeft(60) // 1 minute in seconds

      // Update current speaker
      const me = participants.find((p) => p.name === name)
      if (me) {
        setCurrentSpeaker(me)

        // Update my status in participants list
        setParticipants((prev) => prev.map((p) => (p.name === name ? { ...p, status: "speaking" } : p)))
      }

      toast({
        title: "Speaking turn started",
        description: "You have 1 minute to share your thoughts.",
      })

      // After speaking time ends, update status
      setTimeout(() => {
        setMyStatus("idle")
        setCurrentSpeaker(null)
        setParticipants((prev) => prev.map((p) => (p.name === name ? { ...p, status: "idle" } : p)))
      }, 60000) // 1 minute
    }, 2000)
  }

  // Simulate receiving a color change from facilitator
  useEffect(() => {
    const colorChangeInterval = setInterval(() => {
      if (Math.random() > 0.9 && sessionActive && !inWaitingRoom && !sessionPaused) {
        // Only use participant colors (excluding blue)
        const newColor = PARTICIPANT_COLORS[Math.floor(Math.random() * PARTICIPANT_COLORS.length)]
        setMyColor(newColor)

        // Update my color in participants list
        setParticipants((prev) => prev.map((p) => (p.name === name ? { ...p, color: newColor } : p)))

        toast({
          title: "Thinking hat changed",
          description: `The facilitator has assigned you the ${newColor} thinking hat.`,
        })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(colorChangeInterval)
  }, [sessionActive, inWaitingRoom, sessionPaused, name, toast])

  // Simulate session pause/resume
  useEffect(() => {
    const pauseInterval = setInterval(() => {
      if (Math.random() > 0.9 && sessionActive && !inWaitingRoom) {
        setSessionPaused((prev) => {
          const newState = !prev
          toast({
            title: newState ? "Session paused" : "Session resumed",
            description: newState
              ? "The facilitator has paused the session."
              : "The facilitator has resumed the session.",
          })
          return newState
        })
      }
    }, 45000) // Check every 45 seconds

    return () => clearInterval(pauseInterval)
  }, [sessionActive, inWaitingRoom, toast])

  // Simulate session timer updates
  useEffect(() => {
    if (sessionActive && !inWaitingRoom && sessionTimeRemaining === null) {
      // Randomly choose a session duration (10, 15, 20, or 40 minutes)
      const durations = [10 * 60, 15 * 60, 20 * 60, 40 * 60]
      const selectedDuration = durations[Math.floor(Math.random() * durations.length)]
      setSessionTimeRemaining(selectedDuration)

      toast({
        title: "Session timer set",
        description: `The session will last for ${selectedDuration / 60} minutes.`,
      })
    }
  }, [sessionActive, inWaitingRoom, sessionTimeRemaining, toast])

  // Simulate other participants joining
  useEffect(() => {
    if (sessionActive && !inWaitingRoom && participants.length < 3) {
      const names = ["Alex", "Jordan", "Taylor", "Casey", "Morgan"]

      // Add 2-4 random participants
      const numParticipants = Math.floor(Math.random() * 3) + 2
      const newParticipants: Participant[] = []

      for (let i = 0; i < numParticipants; i++) {
        const randomName = names[Math.floor(Math.random() * names.length)]
        // Only use participant colors (excluding blue)
        const randomColor = PARTICIPANT_COLORS[Math.floor(Math.random() * PARTICIPANT_COLORS.length)]

        if (!participants.some((p) => p.name === randomName)) {
          newParticipants.push({
            id: `sim-${Date.now()}-${i}`,
            name: randomName,
            color: randomColor,
            status: "idle",
          })
        }
      }

      setParticipants((prev) => [...prev, ...newParticipants])
    }
  }, [sessionActive, inWaitingRoom, participants])

  // Join screen
  if (isJoining) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="py-4 px-6 border-b border-gray-100">
          <div className="container mx-auto flex items-center">
            <TinkLogo size={80} />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4 border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl">Join Session</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-4">
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
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Join
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Waiting room
  if (inWaitingRoom) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="py-4 px-6 border-b border-gray-100">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <TinkLogo size={80} />
            </div>
            <div className="text-right">
              <p className="font-medium">{name}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4 border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <TinkLogo size={120} />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Waiting Room</h2>
              <p className="text-gray-600 mb-6">
                You've joined the session. Please wait for the facilitator to start the session.
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
                  <span>Waiting for session to start...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Active session
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="py-4 px-6 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <TinkLogo size={80} />
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="font-medium">{name}</p>
            <div className="flex items-center">
              <p className={`text-sm ${sessionPaused ? "text-yellow-500" : "text-green-500"}`}>
                {sessionPaused ? "Session Paused" : "Session Active"}
              </p>
              {sessionTimeRemaining !== null && (
                <div className="ml-2">
                  <Timer seconds={sessionTimeRemaining} paused={sessionPaused} />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4 flex flex-col gap-6">
          <Card className={`p-4 border border-gray-200 ${sessionPaused ? "bg-gray-50" : ""}`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Session Information</h2>
                <p className="text-sm text-gray-600">Team Strategy Meeting</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Details
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-3 space-y-2">
                    <div>
                      <h4 className="font-medium text-sm">Description</h4>
                      <p className="text-sm text-gray-600">
                        Quarterly planning session to define our product roadmap and priorities for the next three
                        months.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Facilitator</h4>
                      <p className="text-sm text-gray-600">Alex Johnson</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Session Goal</h4>
                      <p className="text-sm text-gray-600">
                        Develop a consensus on key initiatives and allocate resources effectively.
                      </p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>

          <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="buzzer">Buzzer</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="buzzer" className="flex-1 p-4 flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Your Thinking Hat</h3>
                  <div className="flex justify-center mb-4">
                    <HatBlock
                      color={myColor}
                      status={myStatus}
                      timeLeft={timeLeft}
                      onClick={requestToSpeak}
                      disabled={!sessionActive || sessionPaused || currentSpeaker !== null}
                    />
                  </div>

                  {myStatus === "speaking" && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                  )}

                  {myStatus === "waiting" && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Waiting for facilitator approval...</p>
                    </div>
                  )}

                  {myStatus === "idle" && !currentSpeaker && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Tap your color block when you want to speak</p>
                    </div>
                  )}

                  {myStatus === "idle" && currentSpeaker && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">{currentSpeaker.name} is currently speaking</p>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-md">
                  <div className={`p-6 rounded-lg ${getHatBackgroundColor(myColor)}`}>
                    <div className="flex items-center mb-3">
                      <div className={`w-5 h-5 rounded-full ${getHatIndicatorColor(myColor)} mr-2`}></div>
                      <h3 className="text-lg font-semibold">{getHatTitle(myColor)}</h3>
                    </div>
                    <div className="space-y-3">
                      <p>{getHatDescription(myColor)}</p>
                      <div>
                        <h4 className="font-medium mb-1">How to think with this hat:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {getHatGuidelines(myColor).map((guideline, index) => (
                            <li key={index}>{guideline}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Questions to consider:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {getHatQuestions(myColor).map((question, index) => (
                            <li key={index}>{question}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="flex-1 flex flex-col h-full">
                <ChatPanel
                  messages={messages}
                  onSendMessage={sendMessage}
                  disabled={!sessionActive || sessionPaused}
                  showColorSelector
                  currentColor={myColor}
                  excludeBlue={true}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <Card className="p-4 h-full border border-gray-200">
            <ParticipantList
              participants={participants}
              onParticipantSpeak={() => {}}
              onChangeColor={() => {}}
              disabled={true}
              viewOnly={true}
              currentSpeaker={currentSpeaker?.id}
              excludeBlue={true}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
