/*
  Warnings:

  - Added the required column `keyNumber` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "nextTaskKey" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "keyNumber" INTEGER NOT NULL;
