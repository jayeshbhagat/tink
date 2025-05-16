"use client"

import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ParticipantList } from "@/components/participant-list"
import { ColorControls } from "@/components/color-controls"
import { ChatPanel } from "@/components/chat-panel"
import { useToast } from "@/hooks/use-toast"
import { TinkLogo } from "@/components/tink-logo"
import { Timer } from "@/components/timer"
import { Copy, Check, HelpCircle, Users, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Participant = {
  id: string
  name: string
  color: string
  status: "idle" | "speaking" | "waiting"
}

// Available colors for participants (excluding blue which is reserved for facilitator)
const PARTICIPANT_COLORS = ["white", "red", "black", "yellow", "green"]

// Company team members
const TEAM_MEMBERS = [
  "Rahul",
  "Anshuman",
  "Kiran",
  "Amitesh",
  "Pradyumn",
  "Jayesh",
  "Rikin",
  "Pallavi",
  "Aladita",
  "Shivam",
  "Ashit",
  "Pulkit",
  "Aman",
  "Rutvij",
  "Akash",
  "Dhanaji",
  "Karthik",
  "Tanmay",
  "Sumedh",
  "Bansi",
  "Shalini",
  "Manoj",
  "Ishtha",
  "Alia",
  "Ananya",
]

// Session topic and description
const SESSION_TOPIC = "Discuss about water bottle"
const SESSION_DESCRIPTION =
  "Figure out what kind of bottle top provide each employee when they come for a coworking session next week."

// Sample chat messages for simulation - specific to the water bottle discussion
const SAMPLE_MESSAGES = {
  white: [
    "We currently have 45 employees attending the coworking session next week.",
    "Standard water bottles typically come with either screw tops or flip tops.",
    "Our budget is $12 per bottle including customization.",
    "The average daily water intake recommended is 2 liters per person.",
    "Stainless steel bottles retain temperature for up to 24 hours, while plastic ones for 4-6 hours.",
    "According to our survey, 65% of employees prefer bottles that are easy to clean.",
    "The coworking session will last for 8 hours each day for 3 days.",
    "The venue has water dispensers available throughout the space.",
    "Insulated bottles typically cost 30% more than non-insulated ones.",
    "The industry standard for BPA-free plastic bottles is around $8-10 per unit.",
  ],
  red: [
    "I feel that stainless steel bottles give a more premium feel to employees.",
    "I'm concerned that screw tops might be frustrating to open and close frequently.",
    "I'm excited about the possibility of branded bottles that employees can keep using.",
    "I worry that plastic bottles might make us look cheap or environmentally unfriendly.",
    "I have a gut feeling that employees would appreciate bottles with built-in infusers.",
    "I'm anxious about choosing a design that some employees might not like.",
    "I feel strongly that the bottles should reflect our company colors and values.",
    "I'm enthusiastic about bottles with measurement markings to encourage proper hydration.",
    "I dislike flip-top lids as they often break after a few months of use.",
    "I'm passionate about providing something that employees will actually use daily.",
  ],
  black: [
    "Stainless steel bottles are heavier and might be inconvenient to carry around all day.",
    "If we choose bottles with complex lids, they might be difficult to clean properly.",
    "Customized bottles will take at least 2 weeks for delivery, which might be cutting it close.",
    "Cheaper bottles might leak and create a negative impression of our company.",
    "Some employees might already have their preferred water bottles and won't use new ones.",
    "Bottles with straws can harbor bacteria if not cleaned properly.",
    "We might end up with excess inventory if we order for all employees and some don't attend.",
    "Plastic bottles might not be durable enough for long-term use.",
    "Wide-mouth bottles are easier to clean but more likely to spill when drinking.",
    "If we choose a bottle that's too large, employees might find it cumbersome during the sessions.",
  ],
  yellow: [
    "Providing branded water bottles can serve as ongoing marketing when employees use them elsewhere.",
    "Bottles with time markers can encourage better hydration habits among our team.",
    "Stainless steel bottles are more sustainable and could reinforce our environmental values.",
    "A good quality bottle could be used by employees for years, providing lasting value.",
    "Bottles with infusers could encourage healthier drinking habits beyond just water.",
    "This is an opportunity to show employees we care about their wellbeing and comfort.",
    "Flip-top lids allow for one-handed operation, which is convenient during meetings.",
    "Bottles with straws make it easier to stay hydrated without disrupting work.",
    "Vacuum-insulated bottles keep drinks at the right temperature, increasing likelihood of use.",
    "This initiative could reduce single-use plastic waste at our coworking sessions.",
  ],
  green: [
    "What if we offered a choice between 2-3 different bottle types and let employees pre-select?",
    "We could include a QR code on each bottle linking to hydration tips and company resources.",
    "What about bottles with removable bases for easy cleaning and adding ice?",
    "We could create a hydration challenge during the coworking session with prizes.",
    "What if we partnered with a charity that provides clean water and made a donation with each bottle?",
    "We could design a modular bottle with interchangeable tops for different uses.",
    "What about bottles with built-in Bluetooth speakers for a fun element?",
    "We could include a small compartment in the bottle design for storing small items like pills or keys.",
    "What if we created a custom app that syncs with the bottle to track hydration throughout the day?",
    "We could design bottles with attachable accessories like carabiners or phone holders.",
  ],
  blue: [
    "Let's start by defining our key criteria for selecting the right water bottle.",
    "We need to balance functionality, cost, and employee preferences in our decision.",
    "Let's summarize the pros and cons of each bottle type we've discussed so far.",
    "We should prioritize which features are most important for our specific use case.",
    "Let's make sure we're considering both short-term use during the session and long-term value.",
    "We need to establish a timeline for ordering and customizing the selected bottles.",
    "Let's organize our ideas into must-have features versus nice-to-have features.",
    "We should consider how this decision aligns with our company's sustainability goals.",
    "Let's review our budget constraints before making a final decision.",
    "We need to determine who will be responsible for the final selection and ordering process.",
  ],
}

// Sample action points for the session summary
const SAMPLE_ACTION_POINTS = [
  "Research top 3 bottle suppliers and get quotes by next Friday",
  "Create a survey to gather employee preferences on bottle features",
  "Develop a timeline for ordering and distribution",
  "Prepare budget proposal for management approval",
  "Design custom branding elements for the selected bottles",
  "Establish criteria for measuring the success of this initiative",
]

export default function FacilitatorSession({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [waitingParticipants, setWaitingParticipants] = useState<{ id: string; name: string; joinedAt: string }[]>([])
  const [messages, setMessages] = useState<
    { id: string; sender: string; color: string; text: string; timestamp: string }[]
  >([])
  const [activeTab, setActiveTab] = useState("participants")
  const [sessionTitle, setSessionTitle] = useState(SESSION_TOPIC)
  const [sessionDescription, setSessionDescription] = useState(SESSION_DESCRIPTION)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionPaused, setSessionPaused] = useState(false)
  const [sessionDuration, setSessionDuration] = useState<number | null>(20) // Default to 20 minutes
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null)
  const [currentSpeaker, setCurrentSpeaker] = useState<Participant | null>(null)
  const [copied, setCopied] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [simulationActive, setSimulationActive] = useState(false)
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null)
  const [sessionSummaryOpen, setSessionSummaryOpen] = useState(false)
  const [sessionSummary, setSessionSummary] = useState<{
    [color: string]: string[]
    actionPoints: string[]
  }>({
    blue: [],
    white: [],
    red: [],
    black: [],
    yellow: [],
    green: [],
    actionPoints: [],
  })
  const [colorsAssigned, setColorsAssigned] = useState(false)

  // Simulate a participant speaking
  const handleParticipantSpeak = (participantId: string) => {
    // Find the participant
    const participant = participants.find((p) => p.id === participantId)
    if (!participant) return

    // If someone is already speaking, don't allow another speaker
    if (currentSpeaker) {
      toast({
        title: "Speaker already active",
        description: `${currentSpeaker.name} is currently speaking. Please wait for them to finish.`,
      })
      return
    }

    // Update participant status
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        status: p.id === participantId ? "speaking" : p.status,
      })),
    )

    // Set current speaker
    setCurrentSpeaker(participant)

    toast({
      title: "Speaker activated",
      description: `${participant.name} is now speaking with the ${getColorName(participant.color)} hat.`,
    })

    // After 2 minutes, set back to idle
    setTimeout(() => {
      handleStopSpeaking(participantId)
    }, 120000) // 2 minutes
  }

  // Stop a participant from speaking
  const handleStopSpeaking = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        status: p.id === participantId ? "idle" : p.status,
      })),
    )

    setCurrentSpeaker(null)

    const participant = participants.find((p) => p.id === participantId)
    if (participant) {
      toast({
        title: "Speaking time ended",
        description: `${participant.name}'s turn has ended.`,
      })
    }
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

  // Change a participant's color
  const changeParticipantColor = (participantId: string, newColor: string) => {
    // Ensure blue is never assigned to a participant
    if (newColor === "blue") {
      toast({
        title: "Color assignment error",
        description: "Blue is reserved for the facilitator and cannot be assigned to participants.",
        variant: "destructive",
      })
      return
    }

    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        color: p.id === participantId ? newColor : p.color,
      })),
    )
  }

  // Set global color for all participants
  const setGlobalColor = (color: string) => {
    // Ensure blue is never assigned to participants
    if (color === "blue") {
      toast({
        title: "Color assignment error",
        description: "Blue is reserved for the facilitator and cannot be assigned to participants.",
        variant: "destructive",
      })
      return
    }

    setParticipants((prev) =>
      prev.map((p) => ({
        ...p,
        color: color,
      })),
    )

    setColorsAssigned(true)

    toast({
      title: "Global color changed",
      description: `All participants are now thinking with the ${color} hat.`,
    })
  }

  // Reshuffle colors randomly
  const reshuffleColors = () => {
    // This ensures a balanced distribution of colors
    const balancedColorAssignment = () => {
      // Make a copy of the participants
      const updatedParticipants = [...participants]

      // Count how many of each color we need to assign
      // For example, with 20 participants and 5 colors, we need 4 of each color
      const totalParticipants = participants.length
      const colorsCount = PARTICIPANT_COLORS.length

      // Calculate how many of each color we need (base amount)
      const basePerColor = Math.floor(totalParticipants / colorsCount)

      // Calculate how many colors need one extra (remainder)
      const remainder = totalParticipants % colorsCount

      // Create an array with the right number of each color
      let colorPool: string[] = []

      PARTICIPANT_COLORS.forEach((color, index) => {
        // Add the base amount of each color
        for (let i = 0; i < basePerColor; i++) {
          colorPool.push(color)
        }

        // Add one extra for some colors (up to the remainder)
        if (index < remainder) {
          colorPool.push(color)
        }
      })

      // Shuffle the color pool
      colorPool = shuffleArray(colorPool)

      // Assign colors from the pool to participants
      updatedParticipants.forEach((participant, index) => {
        participant.color = colorPool[index]
      })

      return updatedParticipants
    }

    // Fisher-Yates shuffle algorithm
    const shuffleArray = <T,>(array: T[]): T[] => {
      const result = [...array]
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
      }
      return result
    }

    setParticipants(balancedColorAssignment())
    setColorsAssigned(true)

    toast({
      title: "Colors reshuffled",
      description: "All participants have been assigned new thinking hats in a balanced distribution.",
    })
  }

  // Add a new message to the chat
  const addMessage = (text: string, color: string) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: "Facilitator",
      color: color, // Use the selected color instead of always blue
      text: text,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
  }

  // Add a participant message to the chat
  const addParticipantMessage = (participantId: string, text: string) => {
    const participant = participants.find((p) => p.id === participantId)
    if (!participant) return

    const newMessage = {
      id: Date.now().toString(),
      sender: participant.name,
      color: participant.color,
      text: text,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
  }

  // Generate session summary
  const generateSessionSummary = () => {
    // Group messages by color
    const messagesByColor: { [color: string]: string[] } = {
      blue: [],
      white: [],
      red: [],
      black: [],
      yellow: [],
      green: [],
    }

    // Add messages to their color groups (without sender information)
    messages.forEach((message) => {
      if (messagesByColor[message.color]) {
        messagesByColor[message.color].push(message.text)
      }
    })

    // Create a concise summary with key points for each hat color
    const summary: { [color: string]: string[]; actionPoints: string[] } = {
      blue: [],
      white: [],
      red: [],
      black: [],
      yellow: [],
      green: [],
      actionPoints: [],
    }

    // Generate a summary for each color (up to 6 points per color)
    Object.entries(messagesByColor).forEach(([color, messages]) => {
      // If we have real messages, use them to create summary points
      if (messages.length > 0) {
        // Get unique messages (remove duplicates)
        const uniqueMessages = [...new Set(messages)]

        // Take up to 6 key points
        const keyPoints = uniqueMessages.slice(0, 6)

        summary[color as keyof typeof summary] = keyPoints
      } else {
        // If no messages for this color, leave empty
        summary[color as keyof typeof summary] = []
      }
    })

    // Generate action points
    // In a real app, this would be more sophisticated, possibly using AI
    // For now, we'll use sample action points
    summary.actionPoints = [...SAMPLE_ACTION_POINTS]

    setSessionSummary(summary)
    setSessionSummaryOpen(true)
  }

  // Start or end the session
  const toggleSession = () => {
    if (!sessionStarted) {
      // Starting the session
      if (sessionDuration === null) {
        toast({
          title: "Set session duration",
          description: "Please set a session duration before starting.",
        })
        return
      }

      setSessionStarted(true)
      setSessionTimeRemaining(sessionDuration * 60) // Convert minutes to seconds

      // Admit waiting participants
      if (waitingParticipants.length > 0) {
        // Don't assign colors initially - leave them empty until global color is set or reshuffled
        const newParticipants = waitingParticipants.map((wp) => ({
          id: wp.id,
          name: wp.name,
          color: "", // Empty color initially
          status: "idle" as const,
        }))

        setParticipants((prev) => [...prev, ...newParticipants])
        setWaitingParticipants([])

        toast({
          title: "Participants admitted",
          description: `${newParticipants.length} participants have been admitted to the session.`,
        })
      }
    } else {
      // Ending the session
      setSessionStarted(false)
      setSessionPaused(false)
      setSessionTimeRemaining(null)
      setCurrentSpeaker(null)
      setSimulationActive(false)
      setColorsAssigned(false)

      if (simulationInterval) {
        clearInterval(simulationInterval)
        setSimulationInterval(null)
      }

      // Reset participant statuses
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          status: "idle",
          color: "", // Reset colors when session ends
        })),
      )

      // Generate session summary
      if (messages.length > 0) {
        generateSessionSummary()
      }
    }

    toast({
      title: sessionStarted ? "Session ended" : "Session started",
      description: sessionStarted ? "The brainstorming session has ended." : "The brainstorming session has started.",
    })
  }

  // Pause or resume the session
  const togglePause = () => {
    setSessionPaused(!sessionPaused)

    // If simulation is active and we're pausing, stop the simulation
    if (simulationActive && !sessionPaused) {
      setSimulationActive(false)
      if (simulationInterval) {
        clearInterval(simulationInterval)
        setSimulationInterval(null)
      }
    }

    toast({
      title: sessionPaused ? "Session resumed" : "Session paused",
      description: sessionPaused ? "The session has been resumed." : "The session has been paused.",
    })
  }

  // Set session duration
  const handleSetDuration = (minutes: number) => {
    setSessionDuration(minutes)

    if (sessionStarted) {
      setSessionTimeRemaining(minutes * 60) // Convert minutes to seconds

      toast({
        title: "Session time updated",
        description: `Session time has been set to ${minutes} minutes.`,
      })
    }
  }

  // Handle timer tick
  const handleTimerTick = () => {
    if (sessionTimeRemaining !== null && sessionTimeRemaining > 0 && sessionStarted && !sessionPaused) {
      setSessionTimeRemaining(sessionTimeRemaining - 1)

      // End session when timer reaches zero
      if (sessionTimeRemaining === 1) {
        setSessionStarted(false)
        setSessionPaused(false)
        setCurrentSpeaker(null)
        setSimulationActive(false)
        setColorsAssigned(false)

        if (simulationInterval) {
          clearInterval(simulationInterval)
          setSimulationInterval(null)
        }

        // Generate session summary
        if (messages.length > 0) {
          generateSessionSummary()
        }

        toast({
          title: "Session ended",
          description: "The session time has ended.",
        })
      }
    }
  }

  // Simulate team members joining
  const simulateTeamJoin = () => {
    // Filter out names that are already in use
    const existingNames = [...participants.map((p) => p.name), ...waitingParticipants.map((p) => p.name)]
    const availableNames = TEAM_MEMBERS.filter((name) => !existingNames.includes(name))

    // Determine how many to add (up to 20 total)
    const currentCount = participants.length + waitingParticipants.length
    const toAdd = Math.min(20 - currentCount, availableNames.length)

    if (toAdd <= 0) {
      toast({
        title: "Maximum reached",
        description: "You already have 20 participants in the session.",
        variant: "destructive",
      })
      return
    }

    const newParticipants = []

    for (let i = 0; i < toAdd; i++) {
      newParticipants.push({
        id: `team-${Date.now()}-${i}`,
        name: availableNames[i],
        joinedAt: new Date().toISOString(),
      })
    }

    setWaitingParticipants((prev) => [...prev, ...newParticipants])

    toast({
      title: "Team members joined",
      description: `${toAdd} team members have joined the waiting room.`,
    })
  }

  // Start chat simulation
  const startChatSimulation = () => {
    if (!sessionStarted || sessionPaused) {
      toast({
        title: "Cannot start simulation",
        description: "Make sure the session is active and not paused.",
        variant: "destructive",
      })
      return
    }

    // If there are no participants, add some for the simulation
    if (participants.length === 0) {
      // Add some simulated participants
      const simulatedParticipants = TEAM_MEMBERS.slice(0, 5).map((name, index) => ({
        id: `sim-${Date.now()}-${index}`,
        name,
        color: PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length],
        status: "idle" as const,
      }))

      setParticipants(simulatedParticipants)
      setColorsAssigned(true)

      toast({
        title: "Simulation participants added",
        description: "Added 5 simulated participants for the chat simulation.",
      })
    }
    // If colors haven't been assigned yet, assign them now for the simulation
    else if (!colorsAssigned) {
      reshuffleColors()
    }

    setSimulationActive(true)
    setActiveTab("chat")

    // Add an initial message from the facilitator
    addMessage(
      `Welcome everyone to our ${SESSION_TOPIC} brainstorming session! ${SESSION_DESCRIPTION} Let's start by gathering some facts with the White Hat.`,
      "blue",
    )

    // Set up interval to add messages periodically
    const interval = setInterval(() => {
      if (!sessionStarted || sessionPaused) {
        clearInterval(interval)
        setSimulationInterval(null)
        setSimulationActive(false)
        return
      }

      // Randomly select a participant
      const participantsWithColors = participants.filter((p) => p.color && p.color !== "")

      if (participantsWithColors.length === 0) {
        // No participants with valid colors, can't continue simulation
        clearInterval(interval)
        setSimulationInterval(null)
        setSimulationActive(false)

        toast({
          title: "Simulation stopped",
          description: "No participants with assigned colors. Please assign colors first.",
          variant: "destructive",
        })
        return
      }

      const randomParticipantIndex = Math.floor(Math.random() * participantsWithColors.length)
      const randomParticipant = participantsWithColors[randomParticipantIndex]

      // Get messages for this participant's hat color
      const colorMessages = SAMPLE_MESSAGES[randomParticipant.color as keyof typeof SAMPLE_MESSAGES]

      if (colorMessages && colorMessages.length > 0) {
        // Select a random message from the appropriate color
        const randomMessageIndex = Math.floor(Math.random() * colorMessages.length)
        const messageText = colorMessages[randomMessageIndex]

        // Add the message
        addParticipantMessage(randomParticipant.id, messageText)
      }
    }, 3000) // Add a new message every 3 seconds

    setSimulationInterval(interval)

    toast({
      title: "Chat simulation started",
      description: "Team members will now simulate an active discussion about water bottles.",
    })
  }

  // Stop chat simulation
  const stopChatSimulation = () => {
    setSimulationActive(false)

    if (simulationInterval) {
      clearInterval(simulationInterval)
      setSimulationInterval(null)
    }

    toast({
      title: "Chat simulation stopped",
      description: "The chat simulation has been stopped.",
    })
  }

  // Copy session link
  const copySessionLink = () => {
    const sessionLink = `${window.location.origin}/session/${params.id}/participant`
    navigator.clipboard.writeText(sessionLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download session summary
  const downloadSummary = () => {
    // Create a text version of the summary
    let summaryText = `# ${sessionTitle} - Session Summary\n\n`
    summaryText += `${sessionDescription}\n\n`
    summaryText += `Date: ${new Date().toLocaleDateString()}\n`
    summaryText += `Participants: ${participants.length}\n\n`

    // Add key points by hat color
    Object.entries(sessionSummary).forEach(([color, points]) => {
      if (color !== "actionPoints" && points.length > 0) {
        summaryText += `## ${getColorName(color)} Hat Key Points\n\n`

        points.forEach((point) => {
          summaryText += `- ${point}\n`
        })

        summaryText += "\n"
      }
    })

    // Add action points
    if (sessionSummary.actionPoints.length > 0) {
      summaryText += `## Action Points\n\n`

      sessionSummary.actionPoints.forEach((point) => {
        summaryText += `- ${point}\n`
      })
    }

    // Create a blob and download link
    const blob = new Blob([summaryText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${sessionTitle.replace(/\s+/g, "-").toLowerCase()}-summary.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Summary downloaded",
      description: "The session summary has been downloaded as a text file.",
    })
  }

  // Initialize timer when session starts
  useEffect(() => {
    if (sessionStarted && sessionTimeRemaining === null && sessionDuration !== null) {
      setSessionTimeRemaining(sessionDuration * 60)
    }
  }, [sessionStarted, sessionTimeRemaining, sessionDuration])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval)
      }
    }
  }, [simulationInterval])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="py-4 px-6 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <TinkLogo size={80} className="mr-3" />
            <div>
              <h1 className="text-xl font-semibold">{sessionTitle}</h1>
              <div className="flex items-center mt-1">
                <p className="text-sm text-gray-500 mr-2">Session ID: {params.id}</p>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copySessionLink}>
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-gray-500" />}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                      <HelpCircle className="h-3 w-3 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-80">
                    <div className="p-3 space-y-2">
                      <div>
                        <h4 className="font-medium text-sm">Session Topic</h4>
                        <p className="text-sm text-gray-600">{sessionTitle}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Description</h4>
                        <p className="text-sm text-gray-600">{sessionDescription}</p>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Timer dropdown for adjustments */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer bg-gray-100 px-3 py-1 rounded-md">
                  {sessionTimeRemaining !== null ? (
                    <Timer seconds={sessionTimeRemaining} paused={sessionPaused} onTick={handleTimerTick} />
                  ) : (
                    <span className="text-sm font-medium">{sessionDuration} min</span>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSetDuration(10)}>10 minutes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetDuration(15)}>15 minutes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetDuration(20)}>20 minutes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetDuration(30)}>30 minutes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetDuration(40)}>40 minutes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetDuration(60)}>60 minutes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="text-sm font-medium">
              Status:{" "}
              <span
                className={`${
                  !sessionStarted ? "text-gray-500" : sessionPaused ? "text-yellow-500" : "text-green-500"
                }`}
              >
                {!sessionStarted ? "Inactive" : sessionPaused ? "Paused" : "Active"}
              </span>
            </div>

            {sessionStarted && (
              <Button onClick={togglePause} variant="outline" size="sm">
                {sessionPaused ? "Resume Session" : "Pause Session"}
              </Button>
            )}

            <Button onClick={toggleSession} variant={sessionStarted ? "destructive" : "default"} size="sm">
              {sessionStarted ? "End Session" : "Start Session"}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6">
        {!sessionStarted && waitingParticipants.length > 0 && (
          <div className="w-full">
            <Card className="p-4 mb-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Waiting Room ({waitingParticipants.length})</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={simulateTeamJoin}
                    className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Add Team Members
                  </Button>
                  <Button
                    onClick={toggleSession}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={sessionDuration === null}
                  >
                    Start Session & Admit All
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {waitingParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-white border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-xs text-gray-500">
                          Joined {new Date(participant.joinedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Main content area - now using full width */}
        <div className="w-full flex flex-col gap-6">
          {sessionStarted && (
            <Card className="p-6 border border-gray-200 shadow-sm">
              <ColorControls
                onSetGlobalColor={setGlobalColor}
                onReshuffle={reshuffleColors}
                disabled={!sessionStarted || sessionPaused}
                excludeBlue={true}
              />
            </Card>
          )}

          <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="participants">Participants ({participants.length})</TabsTrigger>
                <TabsTrigger value="chat">Chat {messages.length > 0 && `(${messages.length})`}</TabsTrigger>
              </TabsList>

              <TabsContent value="participants" className="flex-1 p-4 overflow-auto">
                {participants.length > 0 ? (
                  <ParticipantList
                    participants={participants}
                    onParticipantSpeak={handleParticipantSpeak}
                    onStopSpeaking={handleStopSpeaking}
                    onChangeColor={changeParticipantColor}
                    disabled={!sessionStarted || sessionPaused || !colorsAssigned}
                    currentSpeaker={currentSpeaker?.id}
                    excludeBlue={true}
                    speakingTimeSeconds={120} // 2 minutes
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No participants have joined yet.</p>
                    <p className="text-sm mt-2">Share the session link to invite participants.</p>
                    {/* Simulate participant join styled as a link */}
                    {!sessionStarted && waitingParticipants.length < 20 && (
                      <div className="mt-4 space-y-2">
                        <Button
                          variant="outline"
                          onClick={simulateTeamJoin}
                          className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Add Team Members
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chat" className="flex-1 flex flex-col h-full">
                <ChatPanel
                  messages={messages}
                  onSendMessage={addMessage}
                  disabled={!sessionStarted || sessionPaused}
                  onStartSimulation={sessionStarted && !sessionPaused ? startChatSimulation : undefined}
                  simulationActive={simulationActive}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Floating help button */}
      <button
        onClick={() => setHelpDialogOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {/* Session Summary Dialog */}
      <Dialog open={sessionSummaryOpen} onOpenChange={setSessionSummaryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{sessionTitle} - Session Summary</DialogTitle>
            <DialogDescription>{sessionDescription}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Participants: {participants.length}</p>
              </div>
              <Button onClick={downloadSummary} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Summary
              </Button>
            </div>

            <div className="space-y-6">
              {/* Key points by hat color */}
              {Object.entries(sessionSummary).map(([color, points]) => {
                if (color === "actionPoints" || points.length === 0) return null

                return (
                  <Card
                    key={color}
                    className={`border ${
                      color === "blue"
                        ? "border-blue-200 bg-blue-50"
                        : color === "white"
                          ? "border-gray-200 bg-gray-50"
                          : color === "red"
                            ? "border-red-200 bg-red-50"
                            : color === "black"
                              ? "border-gray-300 bg-gray-100"
                              : color === "yellow"
                                ? "border-yellow-200 bg-yellow-50"
                                : "border-green-200 bg-green-50"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-2 ${
                            color === "blue"
                              ? "bg-blue-500"
                              : color === "white"
                                ? "bg-white border border-gray-300"
                                : color === "red"
                                  ? "bg-red-500"
                                  : color === "black"
                                    ? "bg-black"
                                    : color === "yellow"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                          }`}
                        ></div>
                        {getColorName(color)} Hat Key Points
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 list-disc pl-5">
                        {points.map((point, index) => (
                          <li key={index} className="text-gray-700">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}

              {/* Action Points */}
              {sessionSummary.actionPoints.length > 0 && (
                <Card className="border border-blue-200 bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-4 h-4 mr-2 text-blue-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      Action Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      {sessionSummary.actionPoints.map((point, index) => (
                        <li key={index} className="text-gray-700">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Six Thinking Hats Guide</DialogTitle>
            <DialogDescription>A comprehensive guide to Edward de Bono's Six Thinking Hats method</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">What is the Six Thinking Hats method?</h3>
              <p>
                The Six Thinking Hats is a powerful technique for looking at decisions from different perspectives. It
                was created by Edward de Bono in 1985 and forces you to move outside your habitual thinking style and
                look at things from different angles.
              </p>
              <p className="mt-2">
                Each "hat" represents a different direction of thinking. By mentally wearing different hats, you can
                direct your thinking in specific ways, leading to more thorough and balanced discussions.
              </p>
              <p className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <strong>Note:</strong> In this application, the Blue Hat is reserved exclusively for the facilitator as
                it represents process control and organization of the thinking process.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">The Six Hats</h3>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500 mr-2"></div>
                  <h4 className="text-lg font-medium">Blue Hat - Process Control</h4>
                </div>
                <p>
                  The Blue Hat represents the control of the thinking process. It's about organizing and managing the
                  thinking.
                </p>
                <div className="mt-3">
                  <h5 className="font-medium">Example statements:</h5>
                  <ul className="list-disc pl-5 mt-1">
                    <li>"Let's first gather all the facts before we make a decision."</li>
                    <li>"We need to spend more time on creative solutions."</li>
                    <li>"Let's summarize what we've discussed so far."</li>
                    <li>"What have we missed in our thinking?"</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 rounded-full bg-white border border-gray-300 mr-2"></div>
                  <h4 className="text-lg font-medium">White Hat - Facts & Information</h4>
                </div>
                <p>
                  The White Hat calls for information known or needed. It's about data, facts, and objective
                  information.
                </p>
                <div className="mt-3">
                  <h5 className="font-medium">Example statements:</h5>
                  <ul className="list-disc pl-5 mt-1">
                    <li>"Our market share has decreased by 5% over the last quarter."</li>
                    <li>"The project will require 120 hours of development time."</li>
                    <li>"According to the survey, 68% of customers prefer the new design."</li>
                    <li>"We don't have data on how this will affect our existing customers."</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 rounded-full bg-red-500 mr-2"></div>
                  <h4 className="text-lg font-medium">Red Hat - Feelings & Emotions</h4>
                </div>
                <p>
                  The Red Hat signifies feelings, hunches, and intuition. It's about emotional responses without
                  justification.
                </p>
                <div className="mt-3">
                  <h5 className="font-medium">Example statements:</h5>
                  <ul className="list-disc pl-5 mt-1">
                    <li>"I'm excited about this new direction."</li>
                    <li>"I have a bad feeling about rushing this decision."</li>
                    <li>"I'm frustrated that we keep revisiting this issue."</li>
                    <li>"My intuition tells me this is the right path forward."</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 rounded-full bg-black mr-2"></div>
                  <h4 className="text-lg font-medium">Black Hat - Caution & Critique</h4>
                </div>
                <p>
                  The Black Hat is for critical judgment and logical negative assessment. It identifies risks,
                  difficulties, and potential problems.
                </p>
                <div className="mt-3">
                  <h5 className="font-medium">Example statements:</h5>
                  <ul className="list-disc pl-5 mt-1">
                    <li>"This approach might alienate our existing customer base."</li>
                    <li>"We don't have the resources to implement this effectively."</li>
                    <li>"The timeline is too aggressive and creates quality risks."</li>
                    <li>"This strategy doesn't address our core competitive weakness."</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 rounded-full bg-yellow-500 mr-2"></div>
                  <h4 className="text-lg font-medium">Yellow Hat - Benefits & Optimism</h4>
                </div>
                <p>
                  The Yellow Hat symbolizes brightness and optimism. It explores positives and looks for benefits and
                  value.
                </p>
                <div className="mt-3">
                  <h5 className="font-medium">Example statements:</h5>
                  <ul className="list-disc pl-5 mt-1">
                    <li>"This approach could open up entirely new market segments."</li>
                    <li>"The new system will reduce processing time by 30%."</li>
                    <li>"This partnership brings complementary strengths to both organizations."</li>
                    <li>"Even if it fails, we'll gain valuable insights for future projects."</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 mr-2"></div>
                  <h4 className="text-lg font-medium">Green Hat - Creativity & Possibilities</h4>
                </div>
                <p>
                  The Green Hat focuses on creativity, alternatives, and new ideas. It's about generating possibilities
                  and solutions.
                </p>
                <div className="mt-3">
                  <h5 className="font-medium">Example statements:</h5>
                  <ul className="list-disc pl-5 mt-1">
                    <li>"What if we approached this from the customer's perspective?"</li>
                    <li>"We could create a subscription model instead of one-time purchases."</li>
                    <li>"Let's combine these two ideas to create something new."</li>
                    <li>"What if we completely reimagined our onboarding process?"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">How to Facilitate a Six Thinking Hats Session</h3>

              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <span className="font-medium">Start with the Blue Hat</span> - Define the focus of the thinking and
                  what you want to achieve.
                </li>
                <li>
                  <span className="font-medium">Use the White Hat</span> - Gather all relevant facts and information.
                </li>
                <li>
                  <span className="font-medium">Explore with the Green Hat</span> - Generate new ideas and
                  possibilities.
                </li>
                <li>
                  <span className="font-medium">Evaluate with the Yellow Hat</span> - Identify benefits and value in the
                  ideas.
                </li>
                <li>
                  <span className="font-medium">Assess with the Black Hat</span> - Spot difficulties and potential
                  problems.
                </li>
                <li>
                  <span className="font-medium">Check feelings with the Red Hat</span> - Understand emotional reactions.
                </li>
                <li>
                  <span className="font-medium">Conclude with the Blue Hat</span> - Summarize insights and define next
                  steps.
                </li>
              </ol>

              <p className="mt-4">
                Note: This is a suggested sequence, but you can adapt the order based on your specific needs. The key is
                to ensure all perspectives are considered.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Tips for Effective Sessions</h3>

              <ul className="list-disc pl-5 space-y-2">
                <li>Keep everyone in the same "hat" at the same time</li>
                <li>Allow sufficient time for each thinking perspective</li>
                <li>Document insights from each hat perspective</li>
                <li>Encourage full participation from all attendees</li>
                <li>Use visual cues (like colored cards) to signal hat changes</li>
                <li>Remind participants to stay in the appropriate thinking mode</li>
                <li>Consider using a timer for each hat to maintain momentum</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
