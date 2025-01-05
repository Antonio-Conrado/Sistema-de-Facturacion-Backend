/*
  Warnings:

  - You are about to drop the column `name` on the `Iva` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rate]` on the table `Iva` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DetailsSales" ALTER COLUMN "discount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Iva" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Sales" ALTER COLUMN "discount" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Iva_rate_key" ON "Iva"("rate");
