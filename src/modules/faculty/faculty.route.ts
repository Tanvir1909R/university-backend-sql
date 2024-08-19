import { Router } from "express";
import validateRequest from "../../app/middlewares/validateRequest";
import { createFacultyZodSchema } from "./faculty.validation";
import { createFaculty, deleteFaculty, getFaculty, getSingleFaculty, updateFaculty } from "./faculty.controller";

const route = Router()

route.post('/',validateRequest(createFacultyZodSchema),createFaculty)
route.get('/',getFaculty)
route.patch('/',updateFaculty)
route.get('/:id',getSingleFaculty)
route.delete('/:id',deleteFaculty)

export const facultyRoute =  route