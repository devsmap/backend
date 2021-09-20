/*
  Warnings:

  - You are about to drop the column `state_id` on the `cities` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "fk_rails_59b5e22e07";

-- DropIndex
DROP INDEX "index_cities_on_state_id";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "state_id";
