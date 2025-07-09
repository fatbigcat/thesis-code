import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import pdf from "pdf-parse";
import { OpenAI } from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { ParsedInstructionsSchema } from "@/types/parsedInstructions.schema";
import { ParsedInstructions } from "@/types/parsedInstructions";

let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

export async function parseRawText(
  systemPrompt: string,
  userPrompt: string
): Promise<ParsedInstructions> {
  const openai = getOpenAIClient();
  const response = await openai.responses.parse({
    model: process.env.NODE_ENV === "production" ? "gpt-4o" : "gpt-4o-mini",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    text: {
      format: zodTextFormat(ParsedInstructionsSchema, "parsed_instructions"),
    },
  });
  if (!response.output_parsed) {
    throw new Error("Model did not return a valid structured output.");
  }
  return response.output_parsed;
}
