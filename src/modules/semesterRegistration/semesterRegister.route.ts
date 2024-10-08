import { Router } from 'express';
// import validateRequest from "../../app/middlewares/validateRequest";
// import { createStudentZodSchema } from "./semesterRegister.validation";
import auth from '../../app/middlewares/auth';
import validateRequest from '../../app/middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../enums/user';
import {
  confirmMyRegistration,
  createSemesterRegister,
  deleteSemesterRegister,
  enrollToCourse,
  getMyRegistration,
  getSemesterRegister,
  getSingleSemesterRegister,
  startMyRegistration,
  startNewSemester,
  updateSemesterRegister,
  withdrewFromCourse,
} from './semesterRegister.controller';
import { enrollWithdrewCourseZodSchema } from './semesterRegister.validation';

const route = Router();
route.post(
  '/start-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  startMyRegistration
);
route.post(
  '/enroll-into-course',
  validateRequest(enrollWithdrewCourseZodSchema),
  auth(ENUM_USER_ROLE.STUDENT),
  enrollToCourse
);
route.post(
  '/withdrew-from-course',
  validateRequest(enrollWithdrewCourseZodSchema),
  auth(ENUM_USER_ROLE.STUDENT),
  withdrewFromCourse
);
route.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  confirmMyRegistration
);
route.get(
  '/get-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  getMyRegistration
);
route.post('/', createSemesterRegister);
route.get('/', getSemesterRegister);
route.patch('/', updateSemesterRegister);
route.get('/:id', getSingleSemesterRegister);
route.post('/:id/start-new-semester',auth(ENUM_USER_ROLE.ADMIN),startNewSemester)
route.delete('/:id', deleteSemesterRegister);

export const semesterRegisterRoute = route;
