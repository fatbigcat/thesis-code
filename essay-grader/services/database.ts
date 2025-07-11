import { ParsedInstructions } from "@/types/parsing.types";
import { PrismaClient } from "@prisma/client";

export async function createFromParsedInstructions(
  prisma: PrismaClient,
  parsed: ParsedInstructions
) {
  const instructionSheet = await prisma.instructionSheet.create({
    data: parsed.instructionSheet,
  });

  const specifications = await Promise.all(
    parsed.specifications.map((spec) =>
      prisma.specification.create({
        data: {
          ...spec,
          instructionSheetId: instructionSheet.id,
        },
      })
    )
  );

  const instructions = await Promise.all(
    parsed.instructions.map((inst) => {
      const specLabel = inst.parent === "null" ? inst.label : inst.parent; // Use parent label if it exists
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

  return { instructionSheet, specifications, instructions };
}
