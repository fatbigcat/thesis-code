import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

import { getSystemPrompt, getUserPrompt } from "../lib/generatePrompt.js";
import { extractTextFromPdf, parseRawText } from "../lib/server-utils.js";
import { ParsedInstructions } from "../types/parsing.types";

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

  const systemPrompt = getSystemPrompt();
  const userPrompt = getUserPrompt(rawText);

  // Save prompts to files
  fs.writeFileSync(
    path.join(folderPath, "system_prompt.txt"),
    systemPrompt,
    "utf-8"
  );

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
