-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'RD',
    "updated_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "patents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patentNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "filingDate" DATETIME NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "inventors" JSONB,
    "spc_expiry" DATETIME,
    "pte_extension" INTEGER DEFAULT 0,
    "pediatric_extension" BOOLEAN NOT NULL DEFAULT false,
    "data_exclusivity_expiry" DATETIME,
    "semantic_tags" JSONB,
    "vector_embedding" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "apis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "molecularFormula" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "drugs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dosageForm" TEXT NOT NULL,
    "composition" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "description" TEXT,
    "semantic_tags" JSONB,
    "vector_embedding" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "history" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "status" INTEGER NOT NULL,
    "sig" TEXT,
    "ipAddress" TEXT
);

-- CreateTable
CREATE TABLE "smtp_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "secure" BOOLEAN NOT NULL DEFAULT false,
    "user" TEXT,
    "pass" TEXT,
    "from" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "approval_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT,
    "patentId" TEXT,
    "drugId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "workflowType" TEXT NOT NULL,
    "description" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "totalSteps" INTEGER NOT NULL DEFAULT 3,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "signatures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "reason" TEXT,
    "isElectronicSignature" BOOLEAN NOT NULL DEFAULT true,
    "sig" TEXT,
    CONSTRAINT "signatures_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "approval_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PatentToApi" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PatentToApi_A_fkey" FOREIGN KEY ("A") REFERENCES "apis" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PatentToApi_B_fkey" FOREIGN KEY ("B") REFERENCES "patents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ApiToDrug" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ApiToDrug_A_fkey" FOREIGN KEY ("A") REFERENCES "apis" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ApiToDrug_B_fkey" FOREIGN KEY ("B") REFERENCES "drugs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "patents_patentNumber_key" ON "patents"("patentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_PatentToApi_AB_unique" ON "_PatentToApi"("A", "B");

-- CreateIndex
CREATE INDEX "_PatentToApi_B_index" ON "_PatentToApi"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApiToDrug_AB_unique" ON "_ApiToDrug"("A", "B");

-- CreateIndex
CREATE INDEX "_ApiToDrug_B_index" ON "_ApiToDrug"("B");
