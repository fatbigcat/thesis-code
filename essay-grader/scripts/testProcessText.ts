import fs from "fs";
import { processFullInstructionText } from "../lib/processText";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: ts-node scripts/testProcessText.ts <path-to-txt>");
  process.exit(1);
}

const rawText = fs.readFileSync(filePath, "utf-8");

try {
  const sections = processFullInstructionText(rawText);
  console.log("Sections found:", sections.length);
  sections.forEach((section, i) => {
    console.log(`--- Section ${i + 1} ---`);
    console.log("Name:", section.name);
    console.log(
      "Spec/Instructions:\n",
      section.specAndInstructions.slice(0, 300)
    );
    console.log("Language:\n", section.language.slice(0, 300));
  });
} catch (err) {
  console.error("Error:", err);
}
