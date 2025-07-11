"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import EssayUploadModule from "./essay-upload-module";
import GradingInstructionsModule from "./grading-instructions-module";

// instruction sheet data from the API
type InstructionSheetWithRelations = {
  id: string;
  type: string;
  theme: string;
  title: string;
  prompt: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
  specifications: Array<{
    id: string;
    label: string;
    title: string;
    details: string;
    taxonomyLevel: string;
    parent: string;
    instructions: Array<{
      id: string;
      label: string;
      title: string;
      details: string;
      scoringGuidelines: string;
    }>;
  }>;
};

export default function UploadSection() {
  const [instructionSheets, setInstructionSheets] = useState<
    InstructionSheetWithRelations[]
  >([]);
  const [selectedSheet, setSelectedSheet] =
    useState<InstructionSheetWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInstructionSheets();
  }, []);

  const fetchInstructionSheets = async () => {
    try {
      const response = await fetch("/api/fetch-instructions");
      if (!response.ok) {
        throw new Error("Failed to fetch instruction sheets");
      }
      const data = await response.json();
      setInstructionSheets(data);
    } catch (error) {
      console.error("Error fetching instruction sheets:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-red-600">
          Error: {error}
          <Button onClick={fetchInstructionSheets} className="ml-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <GradingInstructionsModule />
        <EssayUploadModule />
      </div>

      {instructionSheets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Existing Instruction Sheets ({instructionSheets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instructionSheets.map((sheet) => (
                <button
                  key={sheet.id}
                  className={`w-full text-left border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedSheet?.id === sheet.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedSheet(sheet)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{sheet.title}</h3>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      {sheet.type}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {sheet.theme}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {sheet.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {sheet.specifications.length} specifications
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedSheet && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-3">
                  Selected: {selectedSheet.title}
                </h4>
                <div className="space-y-3">
                  {selectedSheet.specifications.map((spec) => (
                    <div
                      key={spec.id}
                      className="border-l-2 border-primary pl-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-primary/20 px-2 py-1 rounded">
                          {spec.label}
                        </span>
                        <span className="font-medium text-sm">
                          {spec.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {spec.details}
                      </p>
                      {spec.instructions.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {spec.instructions.map((instruction) => (
                            <div key={instruction.id} className="text-xs">
                              <span className="bg-secondary px-2 py-1 rounded mr-2">
                                {instruction.label}
                              </span>
                              {instruction.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button className="mt-4">
                  Use This Instruction Sheet for Grading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
