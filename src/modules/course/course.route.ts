import { Router } from "express";
// import validateRequest from "../../app/middlewares/validateRequest";
// import { createCourseZodSchema  } from "./course.validation";
import { createCourse, deleteCourse, getCourse, getSingleCourse, updateCourse,  } from "./course.controller";

const route = Router()

route.post('/',createCourse)
route.get('/',getCourse)
route.patch('/:id',updateCourse)
route.get('/:id',getSingleCourse)
route.delete('/:id',deleteCourse)

export const courseRoute =  route