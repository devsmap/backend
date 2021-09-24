/*
  Warnings:

  - You are about to drop the `cities_not_found` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "by_bot" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "cities_not_found";
