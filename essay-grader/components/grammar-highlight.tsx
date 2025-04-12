"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GrammarHighlightProps {
  essayText: string
  highlightedText: string
}

export default function GrammarHighlight({ essayText, highlightedText }: GrammarHighlightProps) {
  const [view, setView] = useState<"original" | "highlighted">("highlighted")
  const [activeIssue, setActiveIssue] = useState<string | null>(null)

  // Extract issues from the highlighted text (in a real app, these would come from the API)
  const issues = [
    {
      id: "issue1",
      text: "organizations such as the Food and Agriculture Organization (FAO)",
      type: "redundant",
      suggestion: "the Food and Agriculture Organization (FAO)",
      explanation: "Redundant phrasing - 'organizations such as' is unnecessary when naming a specific organization.",
    },
    {
      id: "issue2",
      text: "The complexity of these challenges necessitates comprehensive responses",
      type: "wordiness",
      suggestion: "These complex challenges require comprehensive responses",
      explanation: "Wordy construction that can be simplified for clarity and impact.",
    },
    {
      id: "issue3",
      text: "However, adaptation alone is insufficient.",
      type: "transition",
      suggestion: "Despite these adaptation strategies, mitigation efforts are also essential because...",
      explanation:
        "Weak transition that could be strengthened by connecting more explicitly to the previous paragraph.",
    },
  ]

  // Function to highlight active issue
  useEffect(() => {
    if (activeIssue) {
      const issueElement = document.getElementById(activeIssue)
      if (issueElement) {
        issueElement.scrollIntoView({ behavior: "smooth", block: "center" })
        issueElement.classList.add("ring-2", "ring-primary", "animate-pulse-slow")

        return () => {
          issueElement.classList.remove("ring-2", "ring-primary", "animate-pulse-slow")
        }
      }
    }
  }, [activeIssue])

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Grammar and Style Analysis</span>
          <Tabs value={view} onValueChange={(v) => setView(v as "original" | "highlighted")}>
            <TabsList>
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="highlighted">Highlighted</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-4 bg-muted rounded-md max-h-96 overflow-y-auto">
            {view === "original" ? (
              <div className="whitespace-pre-line">{essayText}</div>
            ) : (
              <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: highlightedText }} />
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Detected Issues</h3>

            <div className="space-y-3">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-3 border rounded-md transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                    activeIssue === issue.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setActiveIssue(activeIssue === issue.id ? null : issue.id)}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        issue.type === "redundant"
                          ? "bg-red-500"
                          : issue.type === "wordiness"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {issue.type === "redundant"
                          ? "Redundant Phrasing"
                          : issue.type === "wordiness"
                            ? "Wordiness"
                            : "Weak Transition"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{issue.text}</p>
                    </div>
                  </div>

                  <div className="mt-2 pl-4">
                    <p className="text-xs text-muted-foreground">{issue.explanation}</p>
                    <div className="mt-1 p-1 bg-green-50 border border-green-200 rounded text-xs">
                      Suggestion: <span className="font-medium">{issue.suggestion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Total Issues:</span>
                <span className="font-medium">{issues.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Grammar:</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Style:</span>
                <span className="font-medium">2</span>
              </div>

              <Button className="w-full mt-4">Fix All Issues</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

