"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type FileStatus = "idle" | "uploading" | "success" | "error";

interface RubricCriterion {
  name: string;
  description: string;
  maxScore: number;
}

export default function GradingInstructionsModule() {
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<FileStatus>("idle");
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "complete"
  >("idle");
  const [processedRubric, setProcessedRubric] = useState<
    RubricCriterion[] | null
  >(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileStatus("success");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setFileStatus("success");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const processRubric = () => {
    if (!file) {
      toast.error("Please upload a rubric file first.");
      return;
    }

    setProcessingStatus("processing");

    // Simulate processing
    setTimeout(() => {
      // Mock processed rubric
      const mockRubric: RubricCriterion[] = [
        {
          name: "Thesis and Argument",
          description:
            "Clear thesis statement and well-developed argument throughout the essay",
          maxScore: 10,
        },
        {
          name: "Evidence and Analysis",
          description:
            "Relevant evidence that supports claims with thorough analysis",
          maxScore: 10,
        },
        {
          name: "Organization and Structure",
          description:
            "Logical organization with clear transitions between ideas",
          maxScore: 5,
        },
        {
          name: "Language and Style",
          description: "Clear, precise language with appropriate academic tone",
          maxScore: 5,
        },
      ];

      setProcessedRubric(mockRubric);
      setProcessingStatus("complete");
      toast.success("Rubric processed successfully.");
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grading Instructions</CardTitle>
        <CardDescription>
          Upload your assessment rubric to be processed by AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
            ${
              fileStatus === "success"
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-primary hover:shadow-md hover:-translate-y-1"
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            {fileStatus === "success" ? (
              <>
                <CheckCircle className="h-10 w-10 text-green-500" />
                <p className="font-medium">{file?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file?.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <FileText className="h-10 w-10 text-muted-foreground" />
                <h3 className="font-medium text-lg">Upload Rubric</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop assessment rubric (PDF)
                </p>
              </>
            )}
          </div>

          <input
            type="file"
            id="file-rubric"
            className="hidden"
            accept=".pdf,.txt,.docx"
            onChange={handleFileChange}
          />

          <Button
            variant={fileStatus === "success" ? "outline" : "default"}
            className="mt-4"
            onClick={() => document.getElementById("file-rubric")?.click()}
          >
            {fileStatus === "success" ? "Change File" : "Select File"}
          </Button>
        </div>

        <div className="mt-6">
          <Button
            className="w-full"
            disabled={!file || processingStatus === "processing"}
            onClick={processRubric}
          >
            {processingStatus === "processing"
              ? "Processing..."
              : "Process Rubric with AI"}
          </Button>

          {processingStatus === "processing" && (
            <div className="mt-4 flex items-center text-amber-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Analyzing rubric with AI...</span>
            </div>
          )}
        </div>

        {processedRubric && processingStatus === "complete" && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-lg">Processed Rubric</h3>
            <div className="border rounded-md divide-y">
              {processedRubric.map((criterion, index) => (
                <div key={index} className="p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{criterion.name}</h4>
                    <span className="text-sm bg-muted px-2 py-1 rounded">
                      Max: {criterion.maxScore}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {criterion.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Edit Rubric</Button>
              <Button>Confirm Rubric</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
