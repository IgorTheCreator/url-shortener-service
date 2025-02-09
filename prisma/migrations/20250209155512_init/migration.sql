-- CreateTable
CREATE TABLE "url" (
    "short" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastVisited" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "url_pkey" PRIMARY KEY ("short")
);

-- CreateIndex
CREATE UNIQUE INDEX "url_short_key" ON "url"("short");
