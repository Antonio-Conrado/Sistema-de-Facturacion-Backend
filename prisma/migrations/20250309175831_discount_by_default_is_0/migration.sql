/*
  Warnings:

  - Made the column `discount` on table `DetailsPurchases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount` on table `DetailsSales` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount` on table `Purchases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount` on table `Sales` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DetailsPurchases" ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "DetailsSales" ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Purchases" ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Sales" ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0;
