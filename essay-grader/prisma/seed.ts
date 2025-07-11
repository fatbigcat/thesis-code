import { PrismaClient, GraderType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Create an InstructionSheet with nested Specifications and Instructions
  const instructionSheet = await prisma.instructionSheet.create({
    data: {
      type: "argumentative",
      theme: "Freedom vs. Captivity",
      title: "Zakaj je bivanje za zaprtimi vrati in v skladišču peklensko?",
      prompt: "Napiši esej na temo ujetosti v sodobni družbi.",
      time: "60min",
      specifications: {
        create: [
          {
            label: "A",
            title: "Argumentacija",
            details: "Jasnost in logičnost argumentov.",
            taxonomyLevel: "Analiza",
            instructions: {
              create: [
                {
                  label: "A1",
                  title: "Jasnost",
                  details: "Ali so argumenti jasno izraženi?",
                  scoringGuidelines:
                    "Pojasni, kako dobro so argumenti razviti.",
                },
                {
                  label: "A2",
                  title: "Logičnost",
                  details: "Ali so argumenti logično povezani?",
                  scoringGuidelines:
                    "Pojasni, kako dobro so argumenti razviti.",
                },
              ],
            },
          },
          {
            label: "B",
            title: "Vsebina",
            details: "Ustreznost in globina vsebine eseja.",
            taxonomyLevel: "Analiza",
            instructions: {
              create: [
                {
                  label: "B1",
                  title: "Ustreznost",
                  details: "Ali vsebina ustreza temi in vprašanju?",
                  scoringGuidelines:
                    "Ocenite, kako dobro vsebina podpira argumente.",
                },
                {
                  label: "B2",
                  title: "Globina",
                  details: "Ali esej pokaže globoko razumevanje teme?",
                  scoringGuidelines:
                    "Ocenite, kako dobro vsebina podpira argumente.",
                },
              ],
            },
          },
          {
            label: "C",
            title: "Slog in jezik",
            details: "Jezikovna pravilnost, slog in struktura stavkov.",
            taxonomyLevel: "Analiza",
            instructions: {
              create: [
                {
                  label: "C1",
                  title: "Jezikovna pravilnost",
                  details: "Ali esej vsebuje veliko jezikovnih napak?",
                  scoringGuidelines: "Ocenite, kako dobro je esej napisan.",
                },
                {
                  label: "C2",
                  title: "Slog",
                  details: "Ali je slog pisanja ustrezen in učinkovit?",
                  scoringGuidelines: "Ocenite, kako dobro je esej napisan.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 2. Create an Essay
  const essay = await prisma.essay.create({
    data: {
      title: "Peklenska vrata in sodobni čas",
      author: "Matic Kovač",
      content: `Tema: UJETI ALI SVOBODNI?\nNaslov: Zakaj je bivanje za zaprtimi vrati in v skladišču peklensko?\n...`,
      instructionSheetId: instructionSheet.id,
    },
  });

  // 3. Fetch the first instruction for grading
  const firstInstruction = await prisma.instruction.findFirst({
    where: {
      specification: {
        instructionSheetId: instructionSheet.id,
      },
    },
    orderBy: { id: "asc" },
  });

  if (firstInstruction) {
    await prisma.grade.create({
      data: {
        essayId: essay.id,
        instructionId: firstInstruction.id,
        score: 7.5,
        grader: GraderType.AI,
        confidence: 0.95,
        comment: "Dobra argumentacija.",
        modelVersion: "gpt-4",
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
