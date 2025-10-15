/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userEmail]` on the table `Signup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Signup_eventId_userEmail_key" ON "Signup"("eventId", "userEmail");
