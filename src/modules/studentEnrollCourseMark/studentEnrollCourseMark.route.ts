import { Router } from "express";
import { updateFinalMarks, updateStudentMark } from "./studentEnrollCourseMark.controller";

const route = Router()

route.patch('/update-marks',updateStudentMark)
route.patch('/update-final-marks',updateFinalMarks)

export const studentMarkRoute = route