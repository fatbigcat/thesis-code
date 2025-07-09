import { NextRequest, NextResponse } from "next/server";
import { getSystemPrompt, getUserPrompt } from "@/lib/generatePrompt";
import { parseRawText } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || file.type !== "text/plain") {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const rawText = await file.text();
  const systemPrompt = getSystemPrompt();
  const userPrompt = getUserPrompt(rawText);

  try {
    const parsed = await parseRawText(systemPrompt, userPrompt);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("OpenAI parse error:", error);
    const message = error instanceof Error ? error.message : "Parsing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
