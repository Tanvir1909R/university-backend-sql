-- CreateTable
CREATE TABLE "offerd_course" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,
    "academicDepartmentId" TEXT NOT NULL,
    "semesterRegistrationId" TEXT NOT NULL,

    CONSTRAINT "offerd_course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "offerd_course" ADD CONSTRAINT "offerd_course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offerd_course" ADD CONSTRAINT "offerd_course_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offerd_course" ADD CONSTRAINT "offerd_course_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
