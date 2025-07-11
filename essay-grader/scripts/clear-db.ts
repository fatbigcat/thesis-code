import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log("🗑️  Clearing database...");

    // Delete in correct order to respect foreign key constraints
    await prisma.instruction.deleteMany();
    console.log("✅ Deleted all instructions");

    await prisma.specification.deleteMany();
    console.log("✅ Deleted all specifications");

    await prisma.instructionSheet.deleteMany();
    console.log("✅ Deleted all instruction sheets");

    console.log("🎉 Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
