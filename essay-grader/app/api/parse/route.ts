import { NextRequest, NextResponse } from "next/server";
import { getSystemPrompt, getUserPrompt } from "@/lib/generatePrompt";
import {
  extractTextFromPdf,
  parseRawText,
  processFullInstructionText,
  ParseRawTextResult,
} from "@/lib/processText";

export async function POST(req: NextRequest) {
  console.log("Received request to /api/parse");
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  console.log("Extracting text from PDF...");
  const rawText = await extractTextFromPdf(Buffer.from(buffer));
  console.log("Extracted raw text:", rawText.slice(0, 100));

  if (!rawText) {
    return NextResponse.json(
      { error: "Failed to extract text from PDF" },
      { status: 500 }
    );
  }
  try {
    console.log("Processing full instruction text...");
    const sections = processFullInstructionText(rawText);
    console.log("Processed sections:", sections.length);
    // prompt openai for each section and collect results
    const results: ParseRawTextResult[] = await Promise.all(
      sections.map(async (section) => {
        const gradingPrompt = getSystemPrompt();
        const gradingUserPrompt = getUserPrompt(section.specAndInstructions);
        const result = await parseRawText(gradingPrompt, gradingUserPrompt);
        return result || null;
      })
    );
    console.log("OpenAI parse results:", results.length);
    // Filter out any nulls (in case of parse errors)
    const filtered = results.filter(Boolean);
    return NextResponse.json(filtered);
  } catch (error: unknown) {
    console.error("OpenAI parse error:", error);
    const message = error instanceof Error ? error.message : "Parsing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
