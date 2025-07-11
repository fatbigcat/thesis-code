/*
  Warnings:

  - You are about to drop the column `instructionId` on the `Essay` table. All the data in the column will be lost.
  - You are about to drop the column `criterionId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `Instruction` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `Instruction` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Instruction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Instruction` table. All the data in the column will be lost.
  - You are about to drop the column `criterionId` on the `Specification` table. All the data in the column will be lost.
  - You are about to drop the column `maxPoints` on the `Specification` table. All the data in the column will be lost.
  - You are about to drop the `Criterion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[essayId,instructionId]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instructionSheetId` to the `Essay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructionId` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `Instruction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Instruction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scoringGuidelines` to the `Instruction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specificationId` to the `Instruction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructionSheetId` to the `Specification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Criterion" DROP CONSTRAINT "Criterion_instructionId_fkey";

-- DropForeignKey
ALTER TABLE "Essay" DROP CONSTRAINT "Essay_instructionId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_criterionId_fkey";

-- DropForeignKey
ALTER TABLE "Specification" DROP CONSTRAINT "Specification_criterionId_fkey";

-- DropIndex
DROP INDEX "Grade_essayId_criterionId_key";

-- AlterTable
ALTER TABLE "Essay" DROP COLUMN "instructionId",
ADD COLUMN     "instructionSheetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "criterionId",
ADD COLUMN     "instructionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Instruction" DROP COLUMN "prompt",
DROP COLUMN "theme",
DROP COLUMN "time",
DROP COLUMN "type",
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "parent" TEXT,
ADD COLUMN     "scoringGuidelines" TEXT NOT NULL,
ADD COLUMN     "specificationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Specification" DROP COLUMN "criterionId",
DROP COLUMN "maxPoints",
ADD COLUMN     "instructionSheetId" INTEGER NOT NULL,
ADD COLUMN     "parent" TEXT;

-- DropTable
DROP TABLE "Criterion";

-- CreateTable
CREATE TABLE "InstructionSheet" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstructionSheet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_essayId_instructionId_key" ON "Grade"("essayId", "instructionId");

-- AddForeignKey
ALTER TABLE "Essay" ADD CONSTRAINT "Essay_instructionSheetId_fkey" FOREIGN KEY ("instructionSheetId") REFERENCES "InstructionSheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specification" ADD CONSTRAINT "Specification_instructionSheetId_fkey" FOREIGN KEY ("instructionSheetId") REFERENCES "InstructionSheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instruction" ADD CONSTRAINT "Instruction_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "Specification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_instructionId_fkey" FOREIGN KEY ("instructionId") REFERENCES "Instruction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
