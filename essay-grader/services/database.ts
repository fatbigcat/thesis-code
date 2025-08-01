import { PrismaClient } from "@prisma/client";
import type { ParsedInstructionSheet } from "@/types/parsing.types";
import type {
  InstructionSheet,
  Specification,
  Instruction,
} from "@prisma/client";

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
): Promise<
  Array<{
    instructionSheet: InstructionSheet;
    specifications: Specification[];
    instructions: Instruction[];
  }>
> {
  const results: Array<{
    instructionSheet: InstructionSheet;
    specifications: Specification[];
    instructions: Instruction[];
  }> = [];
  for (const sheet of instructionSheets) {
    // upsert instruction sheet by title
    let instructionSheet = await prisma.instructionSheet.findFirst({
      where: { title: sheet.title },
    });
    if (instructionSheet) {
      // update
      instructionSheet = await prisma.instructionSheet.update({
        where: { id: instructionSheet.id },
        data: {
          type: sheet.type,
          theme: sheet.theme,
          prompt: sheet.prompt,
          time: sheet.time,
          languagePrompt: sheet.languagePrompt,
          updatedAt: new Date(),
        },
      });
      // delete old instructions first, then specifications
      await prisma.instruction.deleteMany({
        where: { specification: { instructionSheetId: instructionSheet.id } },
      });
      await prisma.specification.deleteMany({
        where: { instructionSheetId: instructionSheet.id },
      });
    } else {
      instructionSheet = await prisma.instructionSheet.create({
        data: {
          type: sheet.type,
          theme: sheet.theme,
          title: sheet.title,
          prompt: sheet.prompt,
          time: sheet.time,
          languagePrompt: sheet.languagePrompt,
        },
      });
    }

    // new specifications and build a label-to-specification map
    const specMap: Record<string, Specification> = {};
    const specifications: Specification[] = await Promise.all(
      (sheet.specifications || []).map((spec) =>
        prisma.specification
          .create({
            data: {
              ...spec,
              instructionSheetId: instructionSheet.id,
            },
          })
          .then((createdSpec) => {
            if (createdSpec.label) specMap[createdSpec.label] = createdSpec;
            return createdSpec;
          })
      )
    );

    // new instructions referencing the new specs
    const instructions: Instruction[] = await Promise.all(
      (sheet.instructions || []).map((inst) => {
        const specLabel =
          inst.parent === "null" || inst.parent == null
            ? inst.label
            : inst.parent;
        if (!specLabel) {
          throw new Error(`Instruction label or parent is missing`);
        }
        const specification = specMap[specLabel];
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

    results.push({
      instructionSheet,
      specifications,
      instructions,
    });
  }
  return results;
}
