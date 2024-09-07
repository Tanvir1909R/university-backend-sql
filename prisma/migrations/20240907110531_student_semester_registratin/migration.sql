-- CreateTable
CREATE TABLE "student_semester_registration" (
    "id" TEXT NOT NULL,
    "isConfirm" BOOLEAN DEFAULT false,
    "totalCreditsTaken" INTEGER NOT NULL DEFAULT 0,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "semesterRegistrationId" TEXT NOT NULL,

    CONSTRAINT "student_semester_registration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_semester_registration" ADD CONSTRAINT "student_semester_registration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_registration" ADD CONSTRAINT "student_semester_registration_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
