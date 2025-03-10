/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNumber]` on the table `Purchases` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `invoiceNumber` on the `Purchases` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "invoiceNumber",
ADD COLUMN     "invoiceNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Purchases_invoiceNumber_key" ON "Purchases"("invoiceNumber");
