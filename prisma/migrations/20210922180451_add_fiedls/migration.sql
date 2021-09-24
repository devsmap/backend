/*
  Warnings:

  - Added the required column `latitude` to the `cities_not_found` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `cities_not_found` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cities_not_found" ADD COLUMN     "check" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL;
