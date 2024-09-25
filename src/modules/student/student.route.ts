import { Router } from "express";
import auth from "../../app/middlewares/auth";
import validateRequest from "../../app/middlewares/validateRequest";
import { ENUM_USER_ROLE } from "../../enums/user";
import { createStudent, deleteStudent, getSingleStudent, getStudent, myCourses, updateStudent } from "./student.controller";
import { createStudentZodSchema } from "./student.validation";

const route = Router()
route.get('/my-courses',auth(ENUM_USER_ROLE.STUDENT),myCourses)
route.post('/',validateRequest(createStudentZodSchema),createStudent)
route.get('/',getStudent)
route.patch('/',updateStudent)
route.get('/:id',getSingleStudent)
route.delete('/:id',deleteStudent)

export const studentRoute =  route