/*
  Warnings:

  - Added the required column `expiresAt` to the `PoapEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PoapEvent" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
