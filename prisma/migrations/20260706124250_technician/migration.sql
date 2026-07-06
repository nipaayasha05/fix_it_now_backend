/*
  Warnings:

  - You are about to drop the column `userId` on the `technicians` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[technicianId]` on the table `technicians` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `technicianId` to the `technicians` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "technicians" DROP CONSTRAINT "technicians_userId_fkey";

-- DropIndex
DROP INDEX "technicians_userId_key";

-- AlterTable
ALTER TABLE "technicians" DROP COLUMN "userId",
ADD COLUMN     "technicianId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "technicians_technicianId_key" ON "technicians"("technicianId");

-- AddForeignKey
ALTER TABLE "technicians" ADD CONSTRAINT "technicians_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
