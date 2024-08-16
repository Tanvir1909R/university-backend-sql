import { Router } from "express";
import validateRequest from "../../app/middlewares/validateRequest";
import { createAcademicFacultyZodSchema } from "./academicFaculty.validation";
import { createAcademicFaculty, deleteAcademicFaculty, getAcademicFaculty, updateAcademicFaculty } from "./academicFaculty.controller";

const route = Router()

route.post('/',validateRequest(createAcademicFacultyZodSchema),createAcademicFaculty)
route.get('/',getAcademicFaculty)
route.patch('/',updateAcademicFaculty)
route.delete('/',deleteAcademicFaculty)

export const academicFacultyRoute =  route