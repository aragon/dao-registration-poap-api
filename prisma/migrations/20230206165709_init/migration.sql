-- CreateTable
CREATE TABLE "POAPEvent" (
    "id" SERIAL NOT NULL,
    "externalID" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "POAPEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POAPClaimCode" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "qrHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "allowListId" INTEGER NOT NULL,

    CONSTRAINT "POAPClaimCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllowList" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "daoAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "poapClaimCodeId" INTEGER NOT NULL,
    "poapMinted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "POAPEvent_externalID_key" ON "POAPEvent"("externalID");

-- CreateIndex
CREATE UNIQUE INDEX "POAPClaimCode_qrHash_key" ON "POAPClaimCode"("qrHash");

-- CreateIndex
CREATE UNIQUE INDEX "POAPClaimCode_allowListId_key" ON "POAPClaimCode"("allowListId");

-- CreateIndex
CREATE INDEX "POAPClaimCode_eventId_idx" ON "POAPClaimCode" USING HASH ("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "AllowList_daoAddress_key" ON "AllowList"("daoAddress");

-- CreateIndex
CREATE UNIQUE INDEX "AllowList_poapClaimCodeId_key" ON "AllowList"("poapClaimCodeId");

-- AddForeignKey
ALTER TABLE "POAPClaimCode" ADD CONSTRAINT "POAPClaimCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "POAPEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowList" ADD CONSTRAINT "AllowList_poapClaimCodeId_fkey" FOREIGN KEY ("poapClaimCodeId") REFERENCES "POAPClaimCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
