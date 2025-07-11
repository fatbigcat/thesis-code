import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/server-utils";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Invalid PDF file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const text = await extractTextFromPdf(buffer);
    return NextResponse.json({ text });
  } catch (err) {
    console.error("PDF parsing failed", err);
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}
