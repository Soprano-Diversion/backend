/*
  Warnings:

  - You are about to drop the column `imageId` on the `Generation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `Thread` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Generation` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `imageId` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Generation" DROP CONSTRAINT "Generation_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Generation" DROP CONSTRAINT "Generation_userId_fkey";

-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "imageId",
ALTER COLUMN "prompt" SET DEFAULT '',
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "imageId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Thread_imageId_key" ON "Thread"("imageId");

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
