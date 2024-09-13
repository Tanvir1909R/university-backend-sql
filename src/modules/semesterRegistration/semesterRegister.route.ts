import { Router } from "express";
// import validateRequest from "../../app/middlewares/validateRequest";
// import { createStudentZodSchema } from "./semesterRegister.validation";
import auth from "../../app/middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/user";
import { createSemesterRegister, deleteSemesterRegister, getSemesterRegister, getSingleSemesterRegister, startMyRegistration, updateSemesterRegister } from "./semesterRegister.controller";

const route = Router()
route.post('/start-registration',auth(ENUM_USER_ROLE.STUDENT), startMyRegistration)
route.post('/',createSemesterRegister)
route.get('/',getSemesterRegister)
route.patch('/',updateSemesterRegister)
route.get('/:id',getSingleSemesterRegister)
route.delete('/:id',deleteSemesterRegister)

export const semesterRegisterRoute =  route