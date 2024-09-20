/*
  Warnings:

  - You are about to drop the `StudentEnrollCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentEnrollCourse" DROP CONSTRAINT "StudentEnrollCourse_academicSemesterId_fkey";

-- DropForeignKey
ALTER TABLE "StudentEnrollCourse" DROP CONSTRAINT "StudentEnrollCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "StudentEnrollCourse" DROP CONSTRAINT "StudentEnrollCourse_studentId_fkey";

-- DropForeignKey
ALTER TABLE "student_enroll_course_mark" DROP CONSTRAINT "student_enroll_course_mark_studentEnrollCourseId_fkey";

-- AlterTable
ALTER TABLE "student_semester_payment" ADD COLUMN     "totalDueAmount" INTEGER DEFAULT 0;

-- DropTable
DROP TABLE "StudentEnrollCourse";

-- CreateTable
CREATE TABLE "student_enroll_course" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,
    "grade" TEXT,
    "point" DOUBLE PRECISION DEFAULT 0,
    "status" "StudentEnrollCourseStatus" NOT NULL DEFAULT 'ONGOING',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_enroll_course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_enroll_course" ADD CONSTRAINT "student_enroll_course_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enroll_course" ADD CONSTRAINT "student_enroll_course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enroll_course" ADD CONSTRAINT "student_enroll_course_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enroll_course_mark" ADD CONSTRAINT "student_enroll_course_mark_studentEnrollCourseId_fkey" FOREIGN KEY ("studentEnrollCourseId") REFERENCES "student_enroll_course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
