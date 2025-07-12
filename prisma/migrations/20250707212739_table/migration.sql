-- AlterTable
ALTER TABLE "Sales" ADD COLUMN     "bankId" INTEGER;

-- CreateTable
CREATE TABLE "Banks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Banks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Banks_name_key" ON "Banks"("name");

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
