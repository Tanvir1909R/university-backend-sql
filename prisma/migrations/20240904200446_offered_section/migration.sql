-- CreateTable
CREATE TABLE "OfferedCourseSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "currentlyEnrolledStudent" INTEGER NOT NULL DEFAULT 0,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "offeredCourseId" TEXT NOT NULL,
    "semesterRegistrationId" TEXT NOT NULL,

    CONSTRAINT "OfferedCourseSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfferedCourseSection" ADD CONSTRAINT "OfferedCourseSection_offeredCourseId_fkey" FOREIGN KEY ("offeredCourseId") REFERENCES "offerd_course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferedCourseSection" ADD CONSTRAINT "OfferedCourseSection_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
