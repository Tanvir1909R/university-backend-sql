import { Router } from "express";
import validateRequest from "../../app/middlewares/validateRequest";
import { createDepartmentZodSchema } from "./academicDepartment.validation";
import { createDepartment, deleteDepartment, getDepartment, getSingleDepartment, updateDepartment } from "./academicDepartment.controller";

const route = Router()

route.post('/',validateRequest(createDepartmentZodSchema),createDepartment)
route.get('/',getDepartment)
route.patch('/',updateDepartment)
route.get('/:id',getSingleDepartment)
route.delete('/:id',deleteDepartment)

export const academicSemesterRoute =  route