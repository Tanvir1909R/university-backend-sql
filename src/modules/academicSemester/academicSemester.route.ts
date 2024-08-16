import { Router } from "express";
import { createSemester, deleteSemester, getSemester, getSingleSemester, updateSemester } from "./academicSemester.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { createSemesterZodSchema } from "./academicSemestaer.validation";

const route = Router()

route.post('/',validateRequest(createSemesterZodSchema),createSemester)
route.get('/',getSemester)
route.patch('/',updateSemester)
route.get('/:id',getSingleSemester)
route.delete('/:id',deleteSemester)

export const academicSemesterRoute =  route