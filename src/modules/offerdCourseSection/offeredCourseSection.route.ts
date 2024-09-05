import { Router } from "express";
import { createOfferedCourseSection, deleteOfferedCourseSection, getOfferedCourseSection, updateOfferedCourseSection } from "./offeredCourseSection.controller";

const route = Router()

route.post('/',createOfferedCourseSection)
route.get('/',getOfferedCourseSection)
route.patch('/:id',updateOfferedCourseSection)
route.delete('/:id',deleteOfferedCourseSection)

export const offeredCourseSectionRoute =  route