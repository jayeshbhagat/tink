import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { TinkLogo } from "@/components/tink-logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-12 mx-auto max-w-6xl">
        {/* Hero Section */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
          <div className="flex-1">
            <TinkLogo size={180} className="mb-6" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              New way to thinking is tinkering
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Digitize your brainstorming sessions with the Six Thinking Hats method. Facilitate structured thinking in
              a collaborative environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/sessions">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/join">Join Session</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-3 gap-4 max-w-md">
              {[
                { color: "blue", name: "Process" },
                { color: "white", name: "Facts" },
                { color: "red", name: "Emotions" },
                { color: "black", name: "Caution" },
                { color: "yellow", name: "Benefits" },
                { color: "green", name: "Creativity" },
              ].map((hat) => (
                <div
                  key={hat.color}
                  className="aspect-square rounded-lg flex items-center justify-center p-4 border"
                  style={{
                    backgroundColor:
                      hat.color === "white"
                        ? "#ffffff"
                        : hat.color === "blue"
                          ? "#3b82f6"
                          : hat.color === "red"
                            ? "#ef4444"
                            : hat.color === "black"
                              ? "#000000"
                              : hat.color === "yellow"
                                ? "#eab308"
                                : "#22c55e",
                    color: hat.color === "white" || hat.color === "yellow" ? "#1e293b" : "white",
                    borderColor: hat.color === "white" ? "#e5e7eb" : "transparent",
                  }}
                >
                  <span className="font-medium text-center">{hat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Six Thinking Hats Explanation */}
        <section className="py-16 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12">What are the Six Thinking Hats?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                The Six Thinking Hats is a thinking tool developed by Edward de Bono. It's a simple and effective
                parallel thinking process that helps people be more productive, focused, and mindfully involved.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Each "hat" represents a different perspective, allowing participants to separate thinking into six clear
                roles and perspectives. By mentally wearing different hats, you can redirect your thoughts,
                conversation, or meeting.
              </p>
              <p className="text-lg text-gray-700">
                This method encourages collaborative thinking where everyone explores the same perspective
                simultaneously before moving to the next one, leading to more thorough and balanced discussions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Blue Hat - Process</h3>
                  <p className="text-gray-600">Focuses on managing the thinking process, organization, and control.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">White Hat - Facts</h3>
                  <p className="text-gray-600">Concentrates on available data, information, and what we know.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500 flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Red Hat - Emotions</h3>
                  <p className="text-gray-600">Expresses feelings, intuition, and emotional reactions.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-black flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Black Hat - Caution</h3>
                  <p className="text-gray-600">Identifies risks, problems, and potential difficulties.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Yellow Hat - Benefits</h3>
                  <p className="text-gray-600">Focuses on positives, benefits, and optimistic views.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Green Hat - Creativity</h3>
                  <p className="text-gray-600">Generates new ideas, alternatives, and possibilities.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12">How Tink Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Create a Session",
                description: "Set up a new brainstorming session and invite participants with a unique link.",
                icon: "🔗",
              },
              {
                title: "Assign Thinking Hats",
                description: "Assign color blocks to participants or set a global thinking mode for everyone.",
                icon: "🎨",
              },
              {
                title: "Facilitate Discussion",
                description: "Manage speaking turns with timers and moderate the chat to keep the session productive.",
                icon: "⏱️",
              },
            ].map((step, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg border border-gray-100">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/sessions">Get Started Now</Link>
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 border-t border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Using Tink</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Structured Thinking</h3>
                <p className="text-gray-600">
                  Provides a clear framework for discussions, ensuring all aspects of a topic are explored thoroughly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enhanced Collaboration</h3>
                <p className="text-gray-600">
                  Enables teams to work together more effectively by focusing on one thinking style at a time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reduced Conflict</h3>
                <p className="text-gray-600">
                  Separates ego from performance by focusing on objective thinking rather than personal positions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Better Decisions</h3>
                <p className="text-gray-600">
                  Leads to more balanced and comprehensive decisions by considering multiple perspectives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Tink. All rights reserved.</p>
          <p className="mt-2">Six Thinking Hats is a registered trademark of The McQuaig Group Inc.</p>
        </footer>
      </div>
    </div>
  )
}
