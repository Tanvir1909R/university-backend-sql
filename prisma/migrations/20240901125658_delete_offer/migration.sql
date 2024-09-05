/*
  Warnings:

  - You are about to drop the `offerd_course` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "offerd_course" DROP CONSTRAINT "offerd_course_academicDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "offerd_course" DROP CONSTRAINT "offerd_course_courseId_fkey";

-- DropForeignKey
ALTER TABLE "offerd_course" DROP CONSTRAINT "offerd_course_semesterRegistrationId_fkey";

-- DropTable
DROP TABLE "offerd_course";
