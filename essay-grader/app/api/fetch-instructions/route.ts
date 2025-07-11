import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

type InstructionSheetWithRelations = Prisma.InstructionSheetGetPayload<{
  include: {
    specifications: {
      include: {
        instructions: true;
      };
    };
  };
}>;

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const instructionSheets: InstructionSheetWithRelations[] =
      await prisma.instructionSheet.findMany({
        include: {
          specifications: {
            orderBy: { label: "asc" },
            include: {
              instructions: true,
            },
          },
        },
      });

    return NextResponse.json(instructionSheets);
  } catch (error) {
    console.error("Error fetching instruction sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch instruction sheets" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
