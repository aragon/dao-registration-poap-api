/*
  Warnings:

  - Added the required column `errorLocation` to the `PendingDAORegistrySync` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ErrorLocation" AS ENUM ('ASSIGN', 'CLAIM');

-- AlterTable
ALTER TABLE "PendingDAORegistrySync" ADD COLUMN     "errorLocation" "ErrorLocation" NOT NULL,
ADD COLUMN     "isSynced" BOOLEAN NOT NULL DEFAULT false;
