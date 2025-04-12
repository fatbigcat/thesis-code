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
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type FileStatus = "idle" | "uploading" | "success" | "error";

export default function EssayUploadModule() {
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<FileStatus>("idle");
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "complete"
  >("idle");

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

  const processEssay = () => {
    if (!file) {
      toast.error("Please upload an essay file first.");
      return;
    }

    setProcessingStatus("processing");

    // Simulate processing
    setTimeout(() => {
      setProcessingStatus("complete");
      toast.success(
        "Essay processed successfully. You can now proceed to Assessment tab."
      );
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Essays</CardTitle>
        <CardDescription>
          Upload student essays for AI assessment
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
                <Upload className="h-10 w-10 text-muted-foreground" />
                <h3 className="font-medium text-lg">Upload Essay</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your essay file (PDF, scan, or text)
                </p>
              </>
            )}
          </div>

          <input
            type="file"
            id="file-essay"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            onChange={handleFileChange}
          />

          <Button
            variant={fileStatus === "success" ? "outline" : "default"}
            className="mt-4"
            onClick={() => document.getElementById("file-essay")?.click()}
          >
            {fileStatus === "success" ? "Change File" : "Select File"}
          </Button>
        </div>

        <div className="mt-6">
          <Button
            className="w-full"
            disabled={!file || processingStatus === "processing"}
            onClick={processEssay}
          >
            {processingStatus === "processing"
              ? "Processing..."
              : "Process Essay"}
          </Button>

          {processingStatus === "processing" && (
            <div className="mt-4 flex items-center text-amber-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>Parsing and analyzing essay...</span>
            </div>
          )}

          {processingStatus === "complete" && (
            <div className="mt-4 flex items-center text-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>
                Essay processed successfully! Proceed to Assessment tab.
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
