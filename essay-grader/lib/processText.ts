import { ParsedInstructionSheet } from "@/types/parsing.types";
import pdf from "pdf-parse";
import parsedInstructionsJsonSchema from "../types/parsedInstructions.schema.json";

// Generalized section extraction for N instruction sheets
export interface EssaySection {
  name: string;
  specAndInstructions: string;
}

/**
 * Splits the full instruction text into N essay blocks based on standardized headings.
 * Returns an array of EssaySection objects.
 */

/**
 * Splits the full instruction text into N essay blocks based on standardized headings.
 * Each block is parsed into an EssaySection object containing the name and specAndInstructions sections
 *
 * @param rawText - The full raw text of the grading instructions (possibly extracted from PDF).
 * @returns An array of EssaySection objects, one for each detected essay type in the document.
 * @throws If no valid essay headings or sections are found.
 */
export function processFullInstructionText(rawText: string): EssaySection[] {
  const splitRegex = /2\. *Razlagalni\/interpretativni *esej/i;
  const parts = rawText.split(splitRegex);

  if (parts.length !== 2) {
    console.error("SPLIT FAILED. Raw text preview:", rawText.slice(0, 1000));
    throw new Error("Could not split text into two essay sections.");
  }

  const [razpravljalniText, razlagalniText] = parts.map((p) => p.trim());

  return [
    {
      name: "razpravljalni",
      specAndInstructions: razpravljalniText,
    },
    {
      name: "razlagalni/interpretativni",
      specAndInstructions: razlagalniText,
    },
  ];
}

/**
 * Extracts plain text from a PDF buffer using the pdf-parse library.
 *
 * @param buffer - The PDF file as a Node.js Buffer.
 * @returns The extracted plain text content of the PDF.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

/**
 * Parses a raw grading instruction text using the OpenAI API and returns a structured ParsedInstructionSheet object.
 *
 * @param rawText - The full raw text of the grading instructions extracted from PDF
 * @param systemPrompt - The system prompt string to use for OpenAI.
 * @returns ParsedInstructionSheet object as specified by the zod schema.
 * @throws If the OpenAI API does not return a valid structured output.
 */
export interface ParseRawTextResult {
  systemPrompt: string;
  userPrompt: string;
  rawResponse: unknown;
  parsed: ParsedInstructionSheet;
}

export async function parseRawText(
  systemPrompt: string,
  userPrompt: string
): Promise<ParseRawTextResult> {
  console.log("[DEBUG] Sending request to OpenRouter (direct API)...");
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey)
    throw new Error("OPENROUTER_API_KEY environment variable is not set");

  const model = "google/gemini-2.5-flash-lite";
  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "parsed_instructions",
        strict: true,
        schema: parsedInstructionsJsonSchema,
      },
    },
  };

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  console.log("[DEBUG] OpenRouter API response:", data);
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Model did not return a valid structured output.");
  }
  // Parse the JSON content
  let parsed: ParsedInstructionSheet;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error("Failed to parse structured output as JSON: " + e);
  }
  return {
    systemPrompt,
    userPrompt,
    rawResponse: data,
    parsed,
  };
}
