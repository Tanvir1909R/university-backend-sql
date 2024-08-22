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
