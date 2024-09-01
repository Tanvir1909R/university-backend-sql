import { Router } from "express";
// import validateRequest from "../../app/middlewares/validateRequest";
// import { createStudentZodSchema } from "./semesterRegister.validation";
import { createSemesterRegister, deleteSemesterRegister, getSemesterRegister, getSingleSemesterRegister, updateSemesterRegister } from "./semesterRegister.controller";

const route = Router()

route.post('/',createSemesterRegister)
route.get('/',getSemesterRegister)
route.patch('/',updateSemesterRegister)
route.get('/:id',getSingleSemesterRegister)
route.delete('/:id',deleteSemesterRegister)

export const semesterRegisterRoute =  route