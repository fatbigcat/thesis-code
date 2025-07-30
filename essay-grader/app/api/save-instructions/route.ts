import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createFromParsedInstructions } from "@/services/database";


const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Expecting: { sheets: ParsedInstructionSheet[] }
    const { sheets } = body;
    if (!Array.isArray(sheets) || sheets.length === 0) {
      return NextResponse.json({ error: "No data to save" }, { status: 400 });
    }
    const result = await createFromParsedInstructions(prisma, sheets);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error("Save error:", error);
    const message = error instanceof Error ? error.message : "Operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
