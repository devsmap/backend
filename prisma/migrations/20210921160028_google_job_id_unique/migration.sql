/*
  Warnings:

  - A unique constraint covering the columns `[gogole_job_id]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_gogole_job_id_key" ON "Job"("gogole_job_id");
