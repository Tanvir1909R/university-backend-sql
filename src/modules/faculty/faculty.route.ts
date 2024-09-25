import { Router } from "express";
import auth from "../../app/middlewares/auth";
import validateRequest from "../../app/middlewares/validateRequest";
import { ENUM_USER_ROLE } from "../../enums/user";
import { createFaculty, deleteFaculty, getFaculty, getSingleFaculty, myCourses, updateFaculty } from "./faculty.controller";
import { createFacultyZodSchema } from "./faculty.validation";

const route = Router()

route.get('/my-course',auth(ENUM_USER_ROLE.FACULTY),myCourses)
route.post('/',validateRequest(createFacultyZodSchema),createFaculty)
route.get('/',getFaculty)
route.patch('/',updateFaculty)
route.get('/:id',getSingleFaculty)
route.delete('/:id',deleteFaculty)

export const facultyRoute =  route