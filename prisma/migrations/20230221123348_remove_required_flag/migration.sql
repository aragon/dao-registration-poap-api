-- AlterTable
ALTER TABLE "PendingDAORegistrySync" ALTER COLUMN "errorLocation" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "PoapClaimCode_daoAddress_idx" ON "PoapClaimCode" USING HASH ("daoAddress");
