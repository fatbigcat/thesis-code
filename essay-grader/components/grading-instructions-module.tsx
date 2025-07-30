"use client";

import type { ParsedInstructionSheet } from "@/types/parsing.types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Upload, ChevronDown } from "lucide-react";
import React, { useState } from "react";


function AccordionSheet(props: { sheet: ParsedInstructionSheet; defaultOpen?: boolean }) {
  const { sheet, defaultOpen } = props;
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div className="border rounded-lg shadow-sm bg-white">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-primary border-b bg-gray-50 rounded-t-lg"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          <span className="font-semibold text-lg">{sheet.title}</span>
          <span className="ml-2 text-xs text-gray-500">({sheet.theme})</span>
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && (
        <div className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:gap-8">
            <div className="flex-1 mb-2">
              <div className="text-sm text-gray-700 mb-1"><span className="font-medium">Prompt:</span> {sheet.prompt}</div>
              <div className="text-sm text-gray-700 mb-1"><span className="font-medium">Time:</span> {sheet.time}</div>
              {sheet.languagePrompt && (
                <div className="text-sm text-gray-700 mb-1"><span className="font-medium">Language Prompt:</span> {sheet.languagePrompt}</div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 shadow-inner">
              <div className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                <Upload className="h-4 w-4" /> Specifications
              </div>
              <ul className="space-y-2">
                {sheet.specifications?.map((spec: any, idx: number) => (
                  <li key={`${spec.label || 'spec'}-${idx}`} className="border-b last:border-b-0 pb-2">
                    <div className="font-medium text-blue-900">{spec.title}</div>
                    <div className="text-xs text-gray-600">{spec.details}</div>
                    <div className="text-xs text-gray-500">Taxonomy: {spec.taxonomyLevel}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-3 shadow-inner">
              <div className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Instructions
              </div>
              <ul className="space-y-2">
                {sheet.instructions?.map((inst: any, idx: number) => (
                  <li key={`${inst.label || 'inst'}-${idx}`} className="border-b last:border-b-0 pb-2">
                    <div className="font-medium text-green-900">{inst.title}</div>
                    <div className="text-xs text-gray-600">{inst.details}</div>
                    <div className="text-xs text-gray-500">Scoring: {inst.scoringGuidelines}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
type FileStatus = "idle" | "uploading" | "success" | "error";
type ProcessingStatus = "idle" | "processing" | "complete" | "error";

// onUploadSuccess prop removed as it is unused


export default function GradingInstructionsModule() {
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<FileStatus>("idle");
  const [processingStatus, setProcessingStatus] =
    useState<ProcessingStatus>("idle");
  const [parsedResult, setParsedResult] = useState<ParsedInstructionSheet[] | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  // Parse only (does not save)
  const parseRubric = async () => {
    if (!file) return;
    setProcessingStatus("processing");
    setSaveStatus("idle");
    try {
      const parseFormData = new FormData();
      parseFormData.append("file", file);
      console.log("[DEBUG] Sending file to /api/parse...");
      const parseResponse = await fetch("/api/parse", {
        method: "POST",
        body: parseFormData,
      });
      console.log("[DEBUG] Got response from /api/parse:", parseResponse);
      if (!parseResponse.ok) throw new Error("Failed to parse instructions");
      const result = await parseResponse.json();
      // Accepts both: [{parsed, ...}] (research) or [{...parsed fields}] (frontend-only)
      let parsedArr;
      if (Array.isArray(result) && result.length > 0 && result[0].parsed) {
        // Research format: [{parsed, ...}]
        parsedArr = result.map((r) => r.parsed);
      } else {
        // Frontend-only format: [{...parsed fields}]
        parsedArr = result;
      }
      console.log("[DEBUG] Parsed result (frontend only):", parsedArr);
      setParsedResult(parsedArr);
      setProcessingStatus("complete");
    } catch (err) {
      setProcessingStatus("error");
      console.error("[DEBUG] Error during parseRubric:", err);
    }
  };

  // Save parsed instructions to backend
  const saveParsedInstructions = async () => {
    if (!parsedResult) return;
    // Validate all specifications have a non-null, non-empty label
    for (const sheet of parsedResult) {
      if (!sheet.specifications || sheet.specifications.some(spec => !spec.label || typeof spec.label !== 'string' || spec.label.trim() === '')) {
        setSaveStatus("error");
        alert("Error: One or more specifications are missing a valid label. Please check your parsed data before saving.");
        return;
      }
    }
    setSaveStatus("saving");
    try {
      let allSuccess = true;
      for (const sheet of parsedResult) {
        const saveResponse = await fetch("/api/save-instructions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sheets: [sheet] }),
        });
        if (!saveResponse.ok) {
          allSuccess = false;
          console.error("[DEBUG] Error saving sheet:", sheet.title, await saveResponse.text());
        }
      }
      setSaveStatus(allSuccess ? "success" : "error");
    } catch (err) {
      setSaveStatus("error");
      console.error("[DEBUG] Error during saveParsedInstructions:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (fileObj) {
      setFile(fileObj);
      setFileStatus("success");
      setParsedResult(null);
      setProcessingStatus("idle");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fileObj = e.dataTransfer.files?.[0];
    if (fileObj) {
      setFile(fileObj);
      setFileStatus("success");
      setParsedResult(null);
      setProcessingStatus("idle");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  let borderClass =
    "border-gray-300 hover:border-primary hover:shadow-md hover:-translate-y-1";
  if (fileStatus === "success") {
    borderClass = "border-green-500 bg-green-50";
  } else if (processingStatus === "error") {
    borderClass = "border-red-500 bg-red-50";
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grading Instructions</CardTitle>
        <CardDescription>
          Upload your assessment rubric to be processed by AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <button
          type="button"
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 w-full ${borderClass}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-rubric")?.click()}
          style={{ cursor: "pointer" }}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            {fileStatus === "success" ? (
              <>
                <CheckCircle className="h-10 w-10 text-green-500" />
                <p className="font-medium">{file?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {((file?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground" />
                <h3 className="font-medium text-lg">Upload Rubric</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop assessment rubric (PDF or TXT)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            id="file-rubric"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileChange}
          />
        </button>
        <Button
          className="mt-4 w-full"
          onClick={parseRubric}
          disabled={!file || processingStatus === "processing"}
        >
          {processingStatus === "processing"
            ? "Parsing..."
            : "Parse Instructions"}
        </Button>
        {/* Render parsed instructions in a visually separated, user-friendly format */}
        {processingStatus === "complete" && parsedResult && (
          <div className="mt-6">
            <div className="space-y-4">
              {parsedResult.map((sheet, idx) => (
                <AccordionSheet
                  key={`${sheet.title || 'sheet'}-${idx}`}
                  sheet={sheet}
                  defaultOpen={idx === 0}
                />
              ))}
            </div>
            {/* Save button and status */}
            <div className="mt-4 flex items-center gap-4">
              <Button onClick={saveParsedInstructions} disabled={saveStatus === "saving"}>
                {saveStatus === "saving" ? "Saving..." : "Save to Database"}
              </Button>
              {saveStatus === "success" && (
                <span className="text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Saved!</span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" /> Error saving.</span>
              )}
            </div>
          </div>
        )}


        <div className="mt-6 space-y-4">
          {processingStatus === "processing" && (
            <div className="flex items-center justify-center text-amber-600">
              <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
              <span>Processing and saving instructions...</span>
            </div>
          )}
          {processingStatus === "error" && (
            <div className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Error processing rubric. Please try again.</span>
            </div>
          )}
          {processingStatus === "complete" && parsedResult && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>
                Instructions parsed! Parsed&nbsp;
                {Array.isArray(parsedResult)
                  ? parsedResult.reduce(
                      (acc, sheet) => acc + (sheet.specifications?.length || 0),
                      0
                    )
                  : 0}{" "}
                specifications with&nbsp;
                {Array.isArray(parsedResult)
                  ? parsedResult.reduce(
                      (acc, sheet) => acc + (sheet.instructions?.length || 0),
                      0
                    )
                  : 0}{" "}
                instructions.
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
