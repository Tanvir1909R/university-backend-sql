-- CreateEnum
CREATE TYPE "StudentEnrollCourseStatus" AS ENUM ('COMPLETE', 'ONGOING', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "StudentEnrollCourse" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,
    "grade" TEXT,
    "point" DOUBLE PRECISION DEFAULT 0,
    "status" "StudentEnrollCourseStatus" NOT NULL DEFAULT 'ONGOING',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentEnrollCourse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentEnrollCourse" ADD CONSTRAINT "StudentEnrollCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollCourse" ADD CONSTRAINT "StudentEnrollCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollCourse" ADD CONSTRAINT "StudentEnrollCourse_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
