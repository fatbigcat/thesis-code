import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSystemPrompt, getUserPrompt } from "@/lib/generatePrompt";
import { parseRawText } from "@/lib/server-utils";
import { createFromParsedInstructions } from "@/services/database";
import { ParsedInstructions } from "@/types/parsing.types";

const prisma = new PrismaClient();

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
    const parsed: ParsedInstructions = await parseRawText(
      systemPrompt,
      userPrompt
    );

    // Save to database using our utility function
    const result = await createFromParsedInstructions(prisma, parsed);

    return NextResponse.json({
      success: true,
      data: {
        instructionSheetId: result.instructionSheet.id,
        specificationsCreated: result.specifications.length,
        instructionsCreated: result.instructions.length,
      },
    });
  } catch (error: unknown) {
    console.error("Parse and save error:", error);
    const message = error instanceof Error ? error.message : "Operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
