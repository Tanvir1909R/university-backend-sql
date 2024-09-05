import { Router } from "express";
import { createOfferedCourse, deleteOfferedCourse, getOfferedCourse, updateOfferedCourse } from "./offeredCourse.controller";

const route = Router()

route.post('/',createOfferedCourse)
route.get('/',getOfferedCourse)
route.patch('/:id',updateOfferedCourse)
route.delete('/:id',deleteOfferedCourse)

export const offeredCourseRoute =  route