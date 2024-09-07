import { Router } from "express";
import { createOfferedCourseClassSchedule, deleteOfferedCourseClassSchedule, getOfferedCourseClassSchedule, updateOfferedCourseClassSchedule } from "./offeredCourseClass.controller";

const route = Router()

route.post('/',createOfferedCourseClassSchedule)
route.get('/',getOfferedCourseClassSchedule)
route.patch('/:id',updateOfferedCourseClassSchedule)
route.delete('/:id',deleteOfferedCourseClassSchedule)

export const offeredCourseClassRoute =  route