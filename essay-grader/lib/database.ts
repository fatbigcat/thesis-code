import { PrismaClient } from "@prisma/client";
import { ParsedInstructions } from "@/types/parsing.types";

export async function createFromParsedInstructions(
  prisma: PrismaClient,
  parsed: ParsedInstructions
) {
  // create instruction sheet
  const instructionSheet = await prisma.instructionSheet.create({
    data: parsed.instructionSheet,
  });

  // create specifications with foreign key reference
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

  // create instructions with foreign key references
  const instructions = await Promise.all(
    parsed.instructions.map((inst) => {
      const specification = specifications.find(
        (s) => s.label === inst.specificationLabel
      );
      if (!specification) {
        throw new Error(
          `Specification with label "${inst.specificationLabel}" not found`
        );
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
