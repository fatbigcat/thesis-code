/*
  Warnings:

  - You are about to drop the column `maxScore` on the `CriterionWeight` table. All the data in the column will be lost.
  - Added the required column `maxScore` to the `Criterion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Criterion" ADD COLUMN     "maxScore" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CriterionWeight" DROP COLUMN "maxScore";
