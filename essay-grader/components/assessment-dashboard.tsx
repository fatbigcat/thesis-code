"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Edit,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock data for demonstration - now using rubric criteria instead of questions
const mockRubricCriteria = [
  {
    id: 1,
    name: "Thesis and Argument",
    description:
      "Clear thesis statement and well-developed argument throughout the essay",
    maxScore: 10,
    aiScore: 7,
    aiExplanation: `<div class="space-y-3">
      <p><strong>Strengths:</strong></p>
      <ul class="list-disc pl-5 space-y-1">
        <li>The essay presents a clear thesis in the introduction: <span class="bg-green-100 px-1">"...arguing that without substantial adaptation and mitigation efforts, climate change will severely undermine global food production and distribution systems."</span></li>
        <li>The argument is generally maintained throughout the essay with supporting evidence.</li>
        <li>The conclusion effectively reinforces the main argument about the need for comprehensive responses.</li>
      </ul>
      
      <p><strong>Areas for Improvement:</strong></p>
      <ul class="list-disc pl-5 space-y-1">
        <li>The thesis could be more specific about which adaptation and mitigation efforts are most critical.</li>
        <li>In the middle paragraphs, the focus occasionally drifts from the main argument to descriptive information.</li>
        <li>The relationship between some evidence and the central thesis could be more explicitly stated.</li>
      </ul>
      
      <p><strong>Specific Examples:</strong></p>
      <p>When discussing adaptation strategies, the essay states: <span class="bg-yellow-100 px-1">"Adaptation strategies are essential for maintaining food security in a changing climate."</span> This could be strengthened by directly connecting to the thesis about how these strategies prevent the undermining of food systems.</p>
    </div>`,
    teacherScore: 7,
    teacherComment: "",
  },
  {
    id: 2,
    name: "Evidence and Analysis",
    description:
      "Relevant evidence that supports claims with thorough analysis",
    maxScore: 10,
    aiScore: 8,
    aiExplanation: `<div class="space-y-3">
      <p><strong>Strengths:</strong></p>
      <ul class="list-disc pl-5 space-y-1">
        <li>The essay incorporates specific numerical data: <span class="bg-green-100 px-1">"wheat yields decline by approximately 6%"</span> and <span class="bg-green-100 px-1">"rainfall has decreased by 30% since 1998"</span>.</li>
        <li>Includes concrete examples from different regions (Mali, Bangladesh, Kenya, Midwestern US).</li>
        <li>Effectively analyzes multiple pathways through which climate change affects food security.</li>
      </ul>
      
      <p><strong>Areas for Improvement:</strong></p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Some claims lack citation information, such as: <span class="bg-yellow-100 px-1">"accounting for approximately 24% of global greenhouse gas emissions"</span>.</li>
        <li>The analysis of economic impacts could be more developed with specific examples of price increases.</li>
        <li>The connection between evidence and broader implications could be strengthened in some sections.</li>
      </ul>
      
      <p><strong>Specific Examples:</strong></p>
      <p>The essay mentions: <span class="bg-green-100 px-1">"The 2019 flooding in the Midwestern United States resulted in approximately $3 billion in agricultural losses"</span> - this is excellent specific evidence, but could be analyzed more deeply regarding long-term impacts on food security.</p>
    </div>`,
    teacherScore: 8,
    teacherComment: "",
  },
  {
    id: 3,
    name: "Organization and Structure",
    description: "Logical organization with clear transitions between ideas",
    maxScore: 5,
    aiScore: 4,
    aiExplanation: `<div class="space-y-3">
      <p><strong>Strengths:</strong></p>
      <ul class="list-disc pl-5 space-y-1">
        <li>The essay follows a logical structure with a clear introduction, body paragraphs, and conclusion.</li>
        <li>Effective use of topic sentences to introduce new aspects of the argument.</li>
        <li>The conclusion effectively summarizes key points and reinforces the main argument.</li>
      </ul>
      
      <p><strong>Areas for Improvement:</strong></p>
      <ul class="list-disc pl-5 space-y-1">
        <li>The transition between the paragraph on adaptation strategies and mitigation efforts could be smoother.</li>
        <li>The paragraph on international cooperation feels somewhat disconnected from the previous discussion.</li>
      </ul>
      
      <p><strong>Specific Examples:</strong></p>
      <p>The transition <span class="bg-yellow-100 px-1">"However, adaptation alone is insufficient."</span> is functional but could be more sophisticated by connecting specific limitations of the adaptation examples just provided to the need for mitigation.</p>
    </div>`,
    teacherScore: 4,
    teacherComment: "",
  },
  {
    id: 4,
    name: "Language and Style",
    description: "Clear, precise language with appropriate academic tone",
    maxScore: 5,
    aiScore: 3,
    aiExplanation: `<div class="space-y-3">
      <p><strong>Strengths:</strong></p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Generally maintains an appropriate academic tone throughout.</li>
        <li>Effective use of discipline-specific vocabulary related to climate science and food security.</li>
        <li>Varied sentence structure that enhances readability.</li>
      </ul>
      
      <p><strong>Areas for Improvement:</strong></p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Several grammatical errors, including: <span class="bg-red-100 px-1">"...organizations such as the Food and Agriculture Organization (FAO) offer technical support..."</span> (redundant phrasing).</li>
        <li>Some instances of wordiness: <span class="bg-red-100 px-1">"The complexity of these challenges necessitates comprehensive responses"</span> could be simplified.</li>
        <li>Occasional informal expressions that detract from the academic tone.</li>
      </ul>
      
      <p><strong>Grammar and Spelling Issues:</strong></p>
      <p>There are 5 grammatical errors and 2 instances of imprecise language that should be addressed to improve the overall quality of writing.</p>
    </div>`,
    teacherScore: 3,
    teacherComment: "",
  },
];

// Mock essay text
const mockEssayText = `<p>The Impact of Climate Change on Global Food Security</p>

<p>Climate change represents one of the most significant challenges to global food security in the 21st century. As temperatures rise and weather patterns become increasingly unpredictable, agricultural systems worldwide face unprecedented threats. This essay examines the multifaceted relationship between climate change and food security, <span class="bg-green-100">arguing that without substantial adaptation and mitigation efforts, climate change will severely undermine global food production and distribution systems.</span></p>

<p>Rising temperatures and changing precipitation patterns directly impact crop yields. Studies indicate that for every degree Celsius increase in global mean temperature, <span class="bg-green-100">wheat yields decline by approximately 6%</span>. Similar effects have been observed in rice, maize, and soybean production, which collectively constitute over 60% of global caloric intake. In regions heavily dependent on rainfed agriculture, such as sub-Saharan Africa, these impacts are particularly pronounced. For instance, in Mali, where agriculture employs over 80% of the population, <span class="bg-green-100">rainfall has decreased by 30% since 1998</span>, resulting in significant crop failures and food shortages.</p>

<p>Beyond direct impacts on crop yields, climate change disrupts food systems through multiple pathways. Extreme weather events, including floods, droughts, and storms, damage infrastructure critical for food storage and distribution. <span class="bg-green-100">The 2019 flooding in the Midwestern United States, for example, resulted in approximately $3 billion in agricultural losses</span> and disrupted food transportation networks across the region. Additionally, rising sea levels threaten coastal agricultural lands through saltwater intrusion, while ocean acidification impacts marine food sources.</p>

<p>Food security encompasses not only availability but also access, utilization, and stability. Climate change affects all these dimensions. Economic impacts of climate-related agricultural losses increase food prices, reducing access particularly for vulnerable populations. Nutritional quality of crops may decline under elevated CO2 conditions, with studies showing reduced protein, zinc, and iron content in staple crops grown under such conditions. Furthermore, climate variability threatens the stability of food systems, making planning and investment more difficult for farmers and food producers.</p>

<p>Adaptation strategies are essential for maintaining food security in a changing climate. These include developing drought and heat-resistant crop varieties, implementing water conservation techniques, diversifying agricultural systems, and improving early warning systems for extreme weather events. In Bangladesh, the adoption of floating gardens has allowed farmers to continue production during flood seasons, while in Kenya, agroforestry practices have helped maintain soil fertility and provide alternative income sources during crop failures.</p>

<p><span class="bg-yellow-100">However, adaptation alone is insufficient.</span> Mitigation efforts to reduce greenhouse gas emissions are crucial for limiting the long-term impacts of climate change on food systems. Agricultural practices themselves contribute significantly to climate change, <span class="bg-yellow-100">accounting for approximately 24% of global greenhouse gas emissions</span>. Sustainable agricultural methods, including precision farming, reduced tillage, and improved livestock management, can simultaneously enhance food security and reduce emissions.</p>

<p>International cooperation is essential for addressing the global challenge of climate change and food security. The Paris Agreement provides a framework for coordinated action, while <span class="bg-red-100">organizations such as the Food and Agriculture Organization (FAO) offer technical support</span> for implementing climate-smart agricultural practices. Financial mechanisms, including the Green Climate Fund, can help channel resources to vulnerable regions for adaptation efforts.</p>

<p>In conclusion, climate change poses a profound threat to global food security through multiple, interconnected pathways. <span class="bg-red-100">The complexity of these challenges necessitates comprehensive responses</span> that integrate adaptation and mitigation strategies across local, national, and international levels. While the challenges are significant, with appropriate policies, technologies, and international cooperation, it is possible to build resilient food systems capable of ensuring food security in a changing climate. The cost of inaction, measured in human suffering and economic losses, far outweighs the investments required for these essential transformations.</p>`;

export default function AssessmentDashboard() {
  const [criteria, setCriteria] = useState(mockRubricCriteria);
  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showFullEssay, setShowFullEssay] = useState(false);
  const [hoveredCriterion, setHoveredCriterion] = useState<number | null>(null);

  const currentCriterion = criteria[currentCriterionIndex];

  const totalScore = criteria.reduce((sum, c) => sum + c.teacherScore, 0);
  const maxPossibleScore = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);

  const handleScoreChange = (value: number[]) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[currentCriterionIndex].teacherScore = value[0];
    setCriteria(updatedCriteria);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[currentCriterionIndex].teacherComment = e.target.value;
    setCriteria(updatedCriteria);
  };

  const saveChanges = () => {
    setEditMode(false);
    toast.success("Changes saved successfully!");
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-red-600";
  };

  // Add this function to handle the HTML content safely
  const createMarkup = (html: string) => {
    return { __html: html };
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Rubric Criteria Assessed</span>
                  <span>
                    {criteria.length}/{criteria.length}
                  </span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="pt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Overall Score</span>
                  <span
                    className={`font-medium ${getScoreColor(
                      totalScore,
                      maxPossibleScore
                    )}`}
                  >
                    {totalScore}/{maxPossibleScore} ({percentageScore}%)
                  </span>
                </div>
                <Progress
                  value={percentageScore}
                  className="h-2"
                  indicatorClassName={
                    percentageScore >= 80
                      ? "bg-green-600"
                      : percentageScore >= 60
                      ? "bg-amber-600"
                      : "bg-red-600"
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>AI Assessment Summary</CardTitle>
            <CardDescription>
              GPT-4 has analyzed the essay based on all rubric criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Strong in Organization and Structure</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Needs improvement in Language and Style</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <span>AI confidence level: High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Essay Assessment</CardTitle>
          <CardDescription>
            Review the essay and assess each rubric criterion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span className="text-xs">Strong points</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 rounded"></div>
              <span className="text-xs">Could be improved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 rounded"></div>
              <span className="text-xs">Grammar/style issues</span>
            </div>
          </div>
          <Collapsible
            open={showFullEssay}
            onOpenChange={setShowFullEssay}
            className="w-full"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Essay Text:</h3>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {showFullEssay ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        <span>Hide Full Essay</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span>Show Full Essay</span>
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

              {!showFullEssay && (
                <div className="p-4 bg-muted rounded-md max-h-32 overflow-hidden relative">
                  <div
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={createMarkup(
                      mockEssayText.substring(0, 300) + "..."
                    )}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-muted to-transparent"></div>
                </div>
              )}

              <CollapsibleContent>
                <div className="p-4 bg-muted rounded-md max-h-96 overflow-y-auto">
                  <div
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={createMarkup(mockEssayText)}
                  />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Rubric Criteria</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentCriterionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentCriterionIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentCriterionIndex((prev) =>
                      Math.min(criteria.length - 1, prev + 1)
                    )
                  }
                  disabled={currentCriterionIndex === criteria.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>

            <div
              className={`p-4 border rounded-md mb-4 transition-all duration-300 ${
                hoveredCriterion === currentCriterion.id
                  ? "shadow-md -translate-y-1 bg-primary/5 border-primary"
                  : ""
              }`}
              onMouseEnter={() => setHoveredCriterion(currentCriterion.id)}
              onMouseLeave={() => setHoveredCriterion(null)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-lg">
                    {currentCriterion.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentCriterion.description}
                  </p>
                </div>
                <div className="text-sm bg-muted px-2 py-1 rounded">
                  {currentCriterionIndex + 1} of {criteria.length}
                </div>
              </div>
            </div>

            <Tabs defaultValue="ai-assessment" className="space-y-4 pt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ai-assessment">AI Assessment</TabsTrigger>
                <TabsTrigger value="teacher-review">Teacher Review</TabsTrigger>
                <TabsTrigger value="grammar-analysis">
                  Grammar Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai-assessment" className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">AI Score:</h3>
                    <span
                      className={`font-medium ${getScoreColor(
                        currentCriterion.aiScore,
                        currentCriterion.maxScore
                      )}`}
                    >
                      {currentCriterion.aiScore}/{currentCriterion.maxScore}
                    </span>
                  </div>
                  <Progress
                    value={
                      (currentCriterion.aiScore / currentCriterion.maxScore) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-2">AI Explanation:</h3>
                  <div
                    className="p-4 bg-muted rounded-md text-sm"
                    dangerouslySetInnerHTML={createMarkup(
                      currentCriterion.aiExplanation
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="teacher-review" className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Teacher Score:</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${getScoreColor(
                          currentCriterion.teacherScore,
                          currentCriterion.maxScore
                        )}`}
                      >
                        {currentCriterion.teacherScore}/
                        {currentCriterion.maxScore}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditMode(!editMode)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {editMode ? (
                    <div className="py-4">
                      <Slider
                        value={[currentCriterion.teacherScore]}
                        max={currentCriterion.maxScore}
                        step={1}
                        onValueChange={handleScoreChange}
                      />
                    </div>
                  ) : (
                    <Progress
                      value={
                        (currentCriterion.teacherScore /
                          currentCriterion.maxScore) *
                        100
                      }
                      className="h-2"
                    />
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Teacher Comments:</h3>
                  <Textarea
                    placeholder="Add your comments or feedback here..."
                    value={currentCriterion.teacherComment}
                    onChange={handleCommentChange}
                    rows={4}
                  />
                </div>

                {editMode && (
                  <Button
                    onClick={saveChanges}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="grammar-analysis" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">
                    Grammar and Style Analysis:
                  </h3>
                  <div className="p-4 bg-muted rounded-md">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Issues Detected:</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>
                            Redundant phrasing: {" "}
                            <span className="bg-red-100 px-1">
                              &quot;organizations such as the Food and Agriculture
                              Organization (FAO)&quot;
                            </span>
                          </li>
                          <li>
                            Wordiness: {" "}
                            <span className="bg-red-100 px-1">
                              &quot;The complexity of these challenges necessitates
                              comprehensive responses&quot;
                            </span>
                          </li>
                          <li>
                            Weak transition: {" "}
                            <span className="bg-yellow-100 px-1">
                              &quot;However, adaptation alone is insufficient.&quot;
                            </span>
                          </li>
                          <li>
                            Uncited claim: {" "}
                            <span className="bg-yellow-100 px-1">
                              &quot;accounting for approximately 24% of global
                              greenhouse gas emissions&quot;
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium">Suggestions:</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>
                            Replace &quot;organizations such as the Food and
                            Agriculture Organization (FAO)&quot; with &quot;the Food and
                            Agriculture Organization (FAO)&quot;
                          </li>
                          <li>
                            Simplify &quot;The complexity of these challenges
                            necessitates comprehensive responses&quot; to &quot;These
                            complex challenges require comprehensive responses&quot;
                          </li>
                          <li>
                            Strengthen the transition with &quot;Despite these
                            adaptation strategies, mitigation efforts are also
                            essential because...&quot;
                          </li>
                          <li>
                            Add citation for the emissions statistic or qualify
                            with &quot;according to recent estimates&quot;
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            AI and teacher assessments are saved automatically
          </div>
          <Button variant="outline">Mark as Reviewed</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
