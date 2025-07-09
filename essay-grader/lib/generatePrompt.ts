/**
 * Returns the system prompt for the OpenAI parser.
 */
export function getSystemPrompt(): string {
  return `
You are a parser that extracts structured grading data from a Slovenian high school matura grading instruction document.

This document includes grading instructions for two types of essays and uses tables to define how students should be scored. Your task is to extract and return the data as structured JSON objects, organized into three distinct categories.

Do not try to translate, clean, or interpret the document. Just extract based on recognizable patterns. Ignore headers, page numbers, and any repeated boilerplate text.

`.trim();
}

/**
 * Returns the user prompt (the raw grading instruction text).
 */
export function getUserPrompt(rawText: string): string {
  return rawText.trim();
}
