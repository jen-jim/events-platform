-- DropForeignKey
ALTER TABLE "public"."Signup" DROP CONSTRAINT "Signup_eventId_fkey";

-- AddForeignKey
ALTER TABLE "Signup" ADD CONSTRAINT "Signup_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
