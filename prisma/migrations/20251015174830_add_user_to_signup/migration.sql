-- AddForeignKey
ALTER TABLE "Signup" ADD CONSTRAINT "Signup_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
