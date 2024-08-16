import { Router } from "express";
import validateRequest from "../../app/middlewares/validateRequest";
import { createStudentZodSchema } from "./student.validation";
import { createStudent, deleteStudent, getSingleStudent, getStudent, updateStudent } from "./student.controller";

const route = Router()

route.post('/',validateRequest(createStudentZodSchema),createStudent)
route.get('/',getStudent)
route.patch('/',updateStudent)
route.get('/:id',getSingleStudent)
route.delete('/:id',deleteStudent)

export const studentRoute =  route