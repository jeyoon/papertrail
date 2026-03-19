/*
  Warnings:

  - You are about to drop the column `placementId` on the `DropoffAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `placementId` on the `Engagement` table. All the data in the column will be lost.
  - You are about to drop the column `promotionId` on the `PrintOrder` table. All the data in the column will be lost.
  - You are about to drop the `Placement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Promotion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dropId` to the `DropoffAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dropId` to the `Engagement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flyerId` to the `PrintOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DropoffAttempt" DROP CONSTRAINT "DropoffAttempt_placementId_fkey";

-- DropForeignKey
ALTER TABLE "Engagement" DROP CONSTRAINT "Engagement_placementId_fkey";

-- DropForeignKey
ALTER TABLE "Placement" DROP CONSTRAINT "Placement_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Placement" DROP CONSTRAINT "Placement_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "PrintOrder" DROP CONSTRAINT "PrintOrder_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_designId_fkey";

-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_eventId_fkey";

-- AlterTable
ALTER TABLE "DropoffAttempt" DROP COLUMN "placementId",
ADD COLUMN     "dropId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Engagement" DROP COLUMN "placementId",
ADD COLUMN     "dropId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PrintOrder" DROP COLUMN "promotionId",
ADD COLUMN     "flyerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Placement";

-- DropTable
DROP TABLE "Promotion";

-- CreateTable
CREATE TABLE "Flyer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "Flyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drop" (
    "id" TEXT NOT NULL,
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flyerId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flyer_eventId_designId_key" ON "Flyer"("eventId", "designId");

-- CreateIndex
CREATE UNIQUE INDEX "Drop_flyerId_locationId_key" ON "Drop"("flyerId", "locationId");

-- AddForeignKey
ALTER TABLE "Flyer" ADD CONSTRAINT "Flyer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flyer" ADD CONSTRAINT "Flyer_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_flyerId_fkey" FOREIGN KEY ("flyerId") REFERENCES "Flyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_flyerId_fkey" FOREIGN KEY ("flyerId") REFERENCES "Flyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropoffAttempt" ADD CONSTRAINT "DropoffAttempt_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "Drop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
