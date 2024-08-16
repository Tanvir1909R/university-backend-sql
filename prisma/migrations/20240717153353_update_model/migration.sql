/*
  Warnings:

  - You are about to drop the column `academic_faculty_id` on the `academic_departments` table. All the data in the column will be lost.
  - You are about to drop the column `academic_department_id` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `academic_faculty_id` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `academic_department_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `academic_faculty_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `academic_semester_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `students` table. All the data in the column will be lost.
  - Added the required column `academicFacultyId` to the `academic_departments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `year` on the `academic_semesters` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `academicDepartmentId` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicFacultyId` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facultyId` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImage` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicDepartmentId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicFacultyId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicSemesterId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImage` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "academic_departments" DROP CONSTRAINT "academic_departments_academic_faculty_id_fkey";

-- DropForeignKey
ALTER TABLE "faculties" DROP CONSTRAINT "faculties_academic_department_id_fkey";

-- DropForeignKey
ALTER TABLE "faculties" DROP CONSTRAINT "faculties_academic_faculty_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_academic_department_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_academic_faculty_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_academic_semester_id_fkey";

-- AlterTable
ALTER TABLE "academic_departments" DROP COLUMN "academic_faculty_id",
ADD COLUMN     "academicFacultyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "academic_semesters" DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "faculties" DROP COLUMN "academic_department_id",
DROP COLUMN "academic_faculty_id",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "profile_image",
DROP COLUMN "student_id",
ADD COLUMN     "academicDepartmentId" TEXT NOT NULL,
ADD COLUMN     "academicFacultyId" TEXT NOT NULL,
ADD COLUMN     "facultyId" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "profileImage" TEXT NOT NULL,
ALTER COLUMN "contact" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "academic_department_id",
DROP COLUMN "academic_faculty_id",
DROP COLUMN "academic_semester_id",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "profile_image",
DROP COLUMN "student_id",
ADD COLUMN     "academicDepartmentId" TEXT NOT NULL,
ADD COLUMN     "academicFacultyId" TEXT NOT NULL,
ADD COLUMN     "academicSemesterId" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "profileImage" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ALTER COLUMN "contact" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "academic_departments" ADD CONSTRAINT "academic_departments_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
