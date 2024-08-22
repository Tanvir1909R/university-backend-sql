import { Router } from "express";
import validateRequest from "../../app/middlewares/validateRequest";
import { createBuildingZodSchema } from "./building.validation";
import { createBuilding, deleteBuilding, getBuilding, getSingleBuilding, updateBuilding } from "./building.controller";

const route = Router()

route.post('/',validateRequest(createBuildingZodSchema),createBuilding)
route.get('/',getBuilding)
route.patch('/',updateBuilding)
route.get('/:id',getSingleBuilding)
route.delete('/:id',deleteBuilding)

export const buildingRoute =  route