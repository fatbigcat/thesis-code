import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

import { getSystemPrompt, getUserPrompt } from "../lib/generatePrompt.js";
import { extractTextFromPdf, parseRawText, processFullInstructionText } from "../lib/processText.js";

const FILE_PATH = "test_data/grading_instructions.pdf";
const OUTPUT_DIR = "./outputs";
const FOLDER_PREFIX = "rubric-output";

// does output dir exist?
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

/**
 * Generates a unique folder path for output files based on the current timestamp.
 * Creates the folder if it does not exist.
 *
 * @returns The full path to the newly created output folder.
 */
function getNextFolderPath(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-"); // e.g. 2025-07-09T15-23-45-123Z
  const folderName = `${FOLDER_PREFIX}-${timestamp}`;
  const folderPath = path.join(OUTPUT_DIR, folderName);
  fs.mkdirSync(folderPath);
  return folderPath;
}

/**
 * Main script runner for parsing a PDF grading instruction file and saving the results.
 * Extracts text, builds prompts, parses with OpenAI, and writes output to a timestamped folder.
 */
async function run() {
  const buffer = fs.readFileSync(FILE_PATH);
  const rawText = await extractTextFromPdf(buffer);

  const folderPath = getNextFolderPath();

  // Split into sections as in /api/parse
  let sections;
  try {
    sections = processFullInstructionText(rawText);
  } catch (err) {
    fs.writeFileSync(path.join(folderPath, "error.txt"), String(err), "utf-8");
    console.error("Section splitting failed:", err);
    return;
  }

  const allResults = [];
  for (const section of sections) {
    // Sanitize section name for filenames
    const safeName = section.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt(section.specAndInstructions);

    // Save prompts for this section
    fs.writeFileSync(
      path.join(folderPath, `system_prompt_${safeName}.txt`),
      systemPrompt,
      "utf-8"
    );
    fs.writeFileSync(
      path.join(folderPath, `user_prompt_${safeName}.txt`),
      userPrompt,
      "utf-8"
    );

    try {
      const result = await parseRawText(systemPrompt, userPrompt);
      // Save the full raw LLM response
      fs.writeFileSync(
        path.join(folderPath, `raw_response_${safeName}.json`),
        JSON.stringify(result.rawResponse, null, 2),
        "utf-8"
      );
      // Save the parsed output
      fs.writeFileSync(
        path.join(folderPath, `parsed_${safeName}.json`),
        JSON.stringify(result.parsed, null, 2),
        "utf-8"
      );
      allResults.push({
        section: section.name,
        systemPrompt,
        userPrompt,
        parsed: result.parsed,
        rawResponse: result.rawResponse
      });
    } catch (err) {
      fs.writeFileSync(path.join(folderPath, `error_${safeName}.txt`), String(err), "utf-8");
      console.error(`Parsing failed for section ${section.name}:`, err);
    }
  }

  // Save a summary file with all results
  fs.writeFileSync(
    path.join(folderPath, "summary.json"),
    JSON.stringify(allResults, null, 2),
    "utf-8"
  );
  console.log(`Saved output to: ${folderPath}`);
}

run();
