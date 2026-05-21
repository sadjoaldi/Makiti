/*
  Warnings:

  - You are about to drop the column `expiresAs` on the `OtpCode` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `OtpCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OtpCode" DROP COLUMN "expiresAs",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
