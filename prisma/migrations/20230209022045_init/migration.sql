-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoapEvent" (
    "id" SERIAL NOT NULL,
    "externalId" INTEGER NOT NULL,
    "secretCode" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoapEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoapClaimCode" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "qrHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "isAssigned" BOOLEAN NOT NULL DEFAULT false,
    "isMinted" BOOLEAN NOT NULL DEFAULT false,
    "daoAddress" TEXT,

    CONSTRAINT "PoapClaimCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoapAuth" (
    "id" SERIAL NOT NULL,
    "authToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoapAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "PoapEvent_externalId_key" ON "PoapEvent"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "PoapClaimCode_qrHash_key" ON "PoapClaimCode"("qrHash");

-- CreateIndex
CREATE UNIQUE INDEX "PoapClaimCode_daoAddress_key" ON "PoapClaimCode"("daoAddress");

-- CreateIndex
CREATE INDEX "PoapClaimCode_eventId_idx" ON "PoapClaimCode" USING HASH ("eventId");

-- CreateIndex
CREATE INDEX "PoapClaimCode_userId_idx" ON "PoapClaimCode" USING HASH ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PoapAuth_authToken_key" ON "PoapAuth"("authToken");

-- AddForeignKey
ALTER TABLE "PoapClaimCode" ADD CONSTRAINT "PoapClaimCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "PoapEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoapClaimCode" ADD CONSTRAINT "PoapClaimCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
