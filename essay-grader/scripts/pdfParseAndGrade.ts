import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import { extractTextFromPdf, parseRawText } from "../lib/utils.js";
import { getSystemPrompt, getUserPrompt } from "../lib/generatePrompt.js";
import { ParsedInstructions } from "../types/parsedInstructions";

// === CONFIG ===
const FILE_PATH = "test_data/grading_instructions.pdf";
const OUTPUT_DIR = "./outputs";
const FOLDER_PREFIX = "rubric-output";

// === Ensure output dir exists ===
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// === Determine next folder number ===
function getNextFolderPath(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-"); // e.g. 2025-07-09T15-23-45-123Z
  const folderName = `${FOLDER_PREFIX}-${timestamp}`;
  const folderPath = path.join(OUTPUT_DIR, folderName);
  fs.mkdirSync(folderPath);
  return folderPath;
}

// === Run ===
async function run() {
  const buffer = fs.readFileSync(FILE_PATH);
  const rawText = await extractTextFromPdf(buffer);

  const folderPath = getNextFolderPath();
  fs.writeFileSync(
    path.join(folderPath, "extracted_text.txt"),
    rawText,
    "utf-8"
  );

  // Generate prompts
  const systemPrompt = getSystemPrompt();
  const userPrompt = getUserPrompt(rawText);

  try {
    const parsed: ParsedInstructions = await parseRawText(
      systemPrompt,
      userPrompt
    );
    fs.writeFileSync(
      path.join(folderPath, "result.json"),
      JSON.stringify(parsed, null, 2),
      "utf-8"
    );
    console.log(`Saved output to: ${folderPath}`);
  } catch (err) {
    fs.writeFileSync(path.join(folderPath, "error.txt"), String(err), "utf-8");
    console.error("Parsing failed:", err);
  }
}

run();
