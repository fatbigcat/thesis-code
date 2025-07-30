import AssessmentDashboard from "@/components/assessment-dashboard";
import EssayUploadModule from "@/components/essay-upload-module";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadSection from "@/components/upload-section";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">AI-Powered Essay Assessment</h1>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="upload">Upload Instructions</TabsTrigger>
          <TabsTrigger value="upload-essays">Upload Essays</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="export">Export Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <UploadSection />
        </TabsContent>

        <TabsContent value="upload-essays">
          <EssayUploadModule />
        </TabsContent>

        <TabsContent value="assessment">
          <AssessmentDashboard />
        </TabsContent>

        <TabsContent value="export">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Export Assessment Results
            </h2>
            <ExportSection />
          </div>
        </TabsContent>
      </Tabs>

      <Toaster />
    </main>
  );
}

function ExportSection() {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="text-xl font-medium mb-4">Export Options</h3>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <FileIcon className="h-5 w-5" />
            <h4 className="font-medium">Excel Spreadsheet</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Export all assessment data in Excel format
          </p>
        </div>

        <div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <FileTextIcon className="h-5 w-5" />
            <h4 className="font-medium">PDF Report</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate detailed PDF reports with feedback
          </p>
        </div>

        <div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="h-5 w-5" />
            <h4 className="font-medium">RM Assessor</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Export in format compatible with RM Assessor
          </p>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Export Selected Format
        </button>
      </div>
    </div>
  );
}

import { FileIcon, FileTextIcon, LinkIcon } from "lucide-react";
