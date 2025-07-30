/**
 * Returns the system prompt for the OpenAI parser.
 */
export function getSystemPrompt() {
  return `
You are a parser that extracts structured grading data from a Slovenian high school matura grading instruction document. This document includes grading instructions for one type of essay and uses structured components and tables to define how students should be scored.

Your task is to extract and return the data as structured JSON, using the following schema:

    type: string,        // "razpravljalni" or "interpretativni"
    theme: string,       // e.g. "UJETI ALI SVOBODNI?"
    title: string,       // full essay title
    prompt: string,      // full essay prompt text, including all quotes, references, and questions in Slovenian, in the exact order and formatting as in the document
    time: string         // e.g. "SM 2024"
  },
  specifications: [
    {
      label: string,     // A, B, C, Č
      title: string,     // full title of the grading component
      details: string,   // full unabridged Slovenian description (taxonomy levels, structure, development method, etc.)
      taxonomyLevel: string,
      parent?: null
    }
  ],
  instructions: [
    {
      label: string,     // e.g. "Č1", "Č2", or "B"
      title: string,     // full instruction or task title (if given)
      details: string,   // full Slovenian description of what the student must demonstrate
      scoringGuidelines: string,  // full Slovenian explanation of the scoring rubric (points, criteria, structure)
      parent?: string | null      // should match the specification label (e.g., "Č" for "Č1", null for "B")
    }
  ]

Parsing rules:
- Extract exact text from the document. Do not summarize, translate, interpret, or hallucinate.
- Do not repeat any text between fields or sections. Each piece of information should appear only once, in its correct field.
- Do not omit any part of the prompt, rubric, or instructions. Include all relevant text, even if it appears in a table, list, or footnote.
- The prompt field must include all Slovenian text of the prompt, including quotes, dramatist names, and all questions and explanation, in the exact order and formatting as in the document.
- Preserve the order and structure of the original document, including all formatting markers (bullet points, lists, indentation, etc.).
- Do not merge or split sections unless explicitly indicated by the document structure.
- Do not include page numbers, headers like "NAVODILA ZA OCENJEVANJE", or repeated boilerplate.
- Output only the JSON object matching this structure. Do not include any of your own commentary or explanation.

If you are unsure about the boundaries of a section, err on the side of including more rather than less, but never duplicate content between fields.
`.trim();
}

/**
 * Returns the user prompt (the raw grading instruction text).
 */
export function getUserPrompt(rawText: string): string {
  const stopMarker = "B) Jezik (do 20 točk)";
  const stopIdx = rawText.indexOf(stopMarker);
  if (stopIdx !== -1) {
    return rawText.slice(0, stopIdx).trim();
  }
  return rawText.trim();
}

/**
 * Extracts only the language prompt section from the raw grading instruction text.
 * Returns everything from the first occurrence of 'B) Jezik (do 20 točk)' to the end.
 */
export function getLanguagePrompt(rawText: string): string {
  const startMarker = "B) Jezik (do 20 točk)";
  const startIdx = rawText.indexOf(startMarker);
  if (startIdx !== -1) {
    return rawText.slice(startIdx).trim();
  }
  return "";
}
