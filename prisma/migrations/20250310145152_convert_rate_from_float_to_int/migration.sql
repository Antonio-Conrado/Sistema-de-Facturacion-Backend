/*
  Warnings:

  - You are about to drop the column `subTotal` on the `DetailsPurchases` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `DetailsSales` table. All the data in the column will be lost.
  - You are about to alter the column `rate` on the `Iva` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `subTotal` on the `Sales` table. All the data in the column will be lost.
  - Added the required column `subtotal` to the `DetailsPurchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `DetailsSales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetailsPurchases" DROP COLUMN "subTotal",
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "DetailsSales" DROP COLUMN "subTotal",
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Iva" ALTER COLUMN "rate" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Sales" DROP COLUMN "subTotal",
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL;
