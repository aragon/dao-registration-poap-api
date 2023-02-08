-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POAPEvent" (
    "id" SERIAL NOT NULL,
    "externalId" INTEGER NOT NULL,
    "secretCode" TEXT NOT NULL,
    "image" TEXT,
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
    "userId" INTEGER,
    "minted" BOOLEAN NOT NULL DEFAULT false,
    "daoAddress" TEXT,

    CONSTRAINT "POAPClaimCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POAPAuth" (
    "id" SERIAL NOT NULL,
    "authToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "POAPAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "POAPEvent_externalId_key" ON "POAPEvent"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "POAPClaimCode_qrHash_key" ON "POAPClaimCode"("qrHash");

-- CreateIndex
CREATE UNIQUE INDEX "POAPClaimCode_daoAddress_key" ON "POAPClaimCode"("daoAddress");

-- CreateIndex
CREATE INDEX "POAPClaimCode_eventId_idx" ON "POAPClaimCode" USING HASH ("eventId");

-- CreateIndex
CREATE INDEX "POAPClaimCode_userId_idx" ON "POAPClaimCode" USING HASH ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "POAPAuth_authToken_key" ON "POAPAuth"("authToken");

-- AddForeignKey
ALTER TABLE "POAPClaimCode" ADD CONSTRAINT "POAPClaimCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "POAPEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POAPClaimCode" ADD CONSTRAINT "POAPClaimCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
