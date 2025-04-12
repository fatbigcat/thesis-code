"use client";

import GradingInstructionsModule from "./grading-instructions-module";
import EssayUploadModule from "./essay-upload-module";

export default function UploadSection() {
  return (
    <div className="space-y-8">
      <GradingInstructionsModule />
      <EssayUploadModule />
    </div>
  );
}
