/*
  Warnings:

  - You are about to drop the `Availablity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Availablity" DROP CONSTRAINT "Availablity_userId_fkey";

-- DropForeignKey
ALTER TABLE "DayAvailability" DROP CONSTRAINT "DayAvailability_avalabilityId_fkey";

-- DropTable
DROP TABLE "Availablity";

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeGap" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Availability_userId_key" ON "Availability"("userId");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayAvailability" ADD CONSTRAINT "DayAvailability_avalabilityId_fkey" FOREIGN KEY ("avalabilityId") REFERENCES "Availability"("id") ON DELETE CASCADE ON UPDATE CASCADE;
