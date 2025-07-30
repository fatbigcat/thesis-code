import { PrismaClient } from "@prisma/client";
import { ParsedInstructionSheet } from "@/types/parsing.types";

/**
 * Persists an array of parsed instruction sheets and their language prompts to the database.
 *
 * @param prisma - The Prisma client instance.
 * @param instructionSheets - Array of objects, each containing a ParsedInstructionSheet and its languagePrompt.
 * @returns An array of results, each with the created instructionSheet, specifications, and instructions.
 */
export async function createFromParsedInstructions(
  prisma: PrismaClient,
  instructionSheets: ParsedInstructionSheet[]
) {
  const results = [];
  for (const sheet of instructionSheets) {
    const instructionSheet = await prisma.instructionSheet.create({
      data: {
        type: sheet.type,
        theme: sheet.theme,
        title: sheet.title,
        prompt: sheet.prompt,
        time: sheet.time,
        languagePrompt: sheet.languagePrompt,
      },
    });
    const specifications = await Promise.all(
      sheet.specifications.map((spec) =>
        prisma.specification.create({
          data: {
            ...spec,
            instructionSheetId: instructionSheet.id,
          },
        })
      )
    );
    const instructions = await Promise.all(
      sheet.instructions.map((inst) => {
        const specLabel = inst.parent === "null" ? inst.label : inst.parent;
        const specification = specifications.find((s) => s.label === specLabel);
        if (!specification) {
          throw new Error(`Specification with label "${specLabel}" not found`);
        }
        return prisma.instruction.create({
          data: {
            label: inst.label,
            title: inst.title,
            details: inst.details,
            scoringGuidelines: inst.scoringGuidelines,
            parent: inst.parent,
            specificationId: specification.id,
          },
        });
      })
    );
    results.push({ instructionSheet, specifications, instructions });
  }
  return results;
}
