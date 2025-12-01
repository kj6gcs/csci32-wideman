-- AlterTable
ALTER TABLE "public"."Character" ADD COLUMN     "factionId" TEXT,
ADD COLUMN     "shipId" TEXT;

-- CreateTable
CREATE TABLE "public"."Ship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "registry" TEXT,
    "factionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Faction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "motto" TEXT,
    "colors" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faction_name_key" ON "public"."Faction"("name");

-- AddForeignKey
ALTER TABLE "public"."Character" ADD CONSTRAINT "Character_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "public"."Ship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Character" ADD CONSTRAINT "Character_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "public"."Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ship" ADD CONSTRAINT "Ship_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "public"."Faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
