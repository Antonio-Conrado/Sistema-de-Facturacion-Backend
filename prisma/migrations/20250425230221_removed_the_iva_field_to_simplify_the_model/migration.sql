/*
  Warnings:

  - You are about to drop the column `ivaId` on the `Purchases` table. All the data in the column will be lost.
  - You are about to drop the column `ivaId` on the `Sales` table. All the data in the column will be lost.
  - You are about to drop the `Iva` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `iva` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iva` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchases" DROP CONSTRAINT "Purchases_ivaId_fkey";

-- DropForeignKey
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_ivaId_fkey";

-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "ivaId",
ADD COLUMN     "iva" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sales" DROP COLUMN "ivaId",
ADD COLUMN     "iva" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Iva";
