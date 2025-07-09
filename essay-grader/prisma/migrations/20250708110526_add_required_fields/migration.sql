/*
  Warnings:

  - You are about to drop the column `description` on the `Criterion` table. All the data in the column will be lost.
  - You are about to drop the column `maxScore` on the `Criterion` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Criterion` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Instruction` table. All the data in the column will be lost.
  - You are about to drop the `CriterionWeight` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `details` to the `Criterion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Criterion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scoringGuidelines` to the `Criterion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxonomyLevel` to the `Criterion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Criterion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `Instruction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `Instruction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Instruction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Instruction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CriterionWeight" DROP CONSTRAINT "CriterionWeight_criterionId_fkey";

-- AlterTable
ALTER TABLE "Criterion" DROP COLUMN "description",
DROP COLUMN "maxScore",
DROP COLUMN "name",
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "parent" TEXT,
ADD COLUMN     "scoringGuidelines" TEXT NOT NULL,
ADD COLUMN     "taxonomyLevel" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Instruction" DROP COLUMN "description",
ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "theme" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "CriterionWeight";

-- CreateTable
CREATE TABLE "Specification" (
    "id" SERIAL NOT NULL,
    "criterionId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "maxPoints" INTEGER NOT NULL,
    "taxonomyLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Specification" ADD CONSTRAINT "Specification_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "Criterion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
