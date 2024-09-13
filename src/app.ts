import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

import cookieParser from 'cookie-parser';
import { academicSemesterRoute } from './modules/academicSemester/academicSemester.route';
import { academicFacultyRoute } from './modules/academicFaculty/academicFaculty.route';
import { academicDepartmentRoute } from './modules/academicDepartment/academicDepartment.route';
import { studentRoute } from './modules/student/student.route';
import { facultyRoute } from './modules/faculty/faculty.route';
import { buildingRoute } from './modules/building/building.route';
import { roomRoute } from './modules/room/room.route';
import { courseRoute } from './modules/course/course.route';
import { semesterRegisterRoute } from './modules/semesterRegistration/semesterRegister.route';
import { offeredCourseRoute } from './modules/offerdCourse/offeredCourse.route';
import { offeredCourseSectionRoute } from './modules/offerdCourseSection/offeredCourseSection.route';
import { offeredCourseClassRoute } from './modules/offerdCourseClassSchedule/offeredCourseClass.route';

const app: Application = express();

app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/academic-semesters', academicSemesterRoute);
app.use('/academic-faculties', academicFacultyRoute);
app.use('/academic-departments', academicDepartmentRoute);
app.use('/students', studentRoute);
app.use('/faculties', facultyRoute);
app.use('/building', buildingRoute);
app.use('/room', roomRoute);
app.use('/course', courseRoute);
app.use('/semester-registration', semesterRegisterRoute);
app.use('/offered-course', offeredCourseRoute);
app.use('/offered-course-section', offeredCourseSectionRoute);
app.use('/offered-course-class-schedule', offeredCourseClassRoute);

//global error handler
app.use(globalErrorHandler);



//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
