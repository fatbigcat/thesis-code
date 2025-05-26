/*
  Warnings:

  - You are about to drop the column `maxScore` on the `Grade` table. All the data in the column will be lost.
  - Added the required column `maxScore` to the `CriterionWeight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CriterionWeight" ADD COLUMN     "maxScore" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "maxScore";
