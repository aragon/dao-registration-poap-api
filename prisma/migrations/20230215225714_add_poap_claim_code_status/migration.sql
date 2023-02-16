/*
  Warnings:

  - You are about to drop the column `isAssigned` on the `PoapClaimCode` table. All the data in the column will be lost.
  - You are about to drop the column `isMinted` on the `PoapClaimCode` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PoapClaimCodeStatus" AS ENUM ('ASSIGNED', 'MINTED', 'ERROR', 'UNASSIGNED');

-- AlterTable
ALTER TABLE "PoapClaimCode" DROP COLUMN "isAssigned",
DROP COLUMN "isMinted",
ADD COLUMN     "status" "PoapClaimCodeStatus" NOT NULL DEFAULT 'UNASSIGNED';
