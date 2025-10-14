-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_createdBy_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
