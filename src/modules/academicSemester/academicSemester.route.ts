import { Router } from 'express';
import auth from '../../app/middlewares/auth';
import validateRequest from '../../app/middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../enums/user';
import { createSemesterZodSchema } from './academicSemestaer.validation';
import {
    createSemester,
    deleteSemester,
    getSemester,
    getSingleSemester,
    updateSemester,
} from './academicSemester.controller';

const route = Router();

route.post(
  '/',
  validateRequest(createSemesterZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  createSemester
);
route.get('/', getSemester);
route.patch('/:id',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), updateSemester);
route.get('/:id', getSingleSemester);
route.delete('/:id',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), deleteSemester);

export const academicSemesterRoute = route;
