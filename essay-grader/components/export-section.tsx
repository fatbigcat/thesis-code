"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileIcon, FileTextIcon, LinkIcon, Download } from "lucide-react";

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export default function ExportSection() {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [includeAiScores, setIncludeAiScores] = useState(true);
  const [includeTeacherComments, setIncludeTeacherComments] = useState(true);

  const exportOptions: ExportOption[] = [
    {
      id: "excel",
      name: "Excel Spreadsheet",
      description: "Export all assessment data in Excel format",
      icon: <FileIcon className="h-5 w-5" />,
    },
    {
      id: "pdf",
      name: "PDF Report",
      description: "Generate detailed PDF reports with feedback",
      icon: <FileTextIcon className="h-5 w-5" />,
    },
    {
      id: "rm-assessor",
      name: "RM Assessor",
      description: "Export in format compatible with RM Assessor",
      icon: <LinkIcon className="h-5 w-5" />,
    },
  ];

  const handleExport = () => {
    if (!selectedFormat) {
      toast.error("Please select a format to export.");
      return;
    }

    toast.success("Exporting data in ${selectedFormat}...");

    // Simulate export process
    setTimeout(() => {
      toast.success("Data exported successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {exportOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-md p-4 cursor-pointer transition-colors ${
                  selectedFormat === option.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary"
                }`}
                onClick={() => setSelectedFormat(option.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {option.icon}
                  <h4 className="font-medium">{option.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Export Options</h3>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-ai"
                  checked={includeAiScores}
                  onCheckedChange={(checked) =>
                    setIncludeAiScores(checked as boolean)
                  }
                />
                <Label htmlFor="include-ai">
                  Include AI scores and explanations
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-comments"
                  checked={includeTeacherComments}
                  onCheckedChange={(checked) =>
                    setIncludeTeacherComments(checked as boolean)
                  }
                />
                <Label htmlFor="include-comments">
                  Include teacher comments
                </Label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleExport}
              disabled={!selectedFormat}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Assessment Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Assessment Statistics</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Total Tests</div>
                <div className="text-2xl font-bold">1</div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Questions</div>
                <div className="text-2xl font-bold">3</div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Avg. Score</div>
                <div className="text-2xl font-bold">70%</div>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">AI Accuracy</div>
                <div className="text-2xl font-bold">95%</div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              AI Accuracy represents how often teachers agree with the AI's
              assessment. This data helps improve the AI model over time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
