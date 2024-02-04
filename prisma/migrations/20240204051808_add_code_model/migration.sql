/*
  Warnings:

  - You are about to drop the column `code` on the `Generation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codeId]` on the table `Generation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "code",
ADD COLUMN     "codeId" INTEGER;

-- CreateTable
CREATE TABLE "Code" (
    "id" SERIAL NOT NULL,
    "html" TEXT,
    "react" TEXT,
    "dsl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Generation_codeId_key" ON "Generation"("codeId");

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code"("id") ON DELETE SET NULL ON UPDATE CASCADE;
