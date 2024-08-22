import { Router } from "express";
import validateRequest from "../../app/middlewares/validateRequest";
import { createRoomZodSchema } from "./room.validation";
import { createRoom, deleteRoom, getRoom, getSingleRoom, updateRoom } from "./room.controller";

const route = Router()

route.post('/',validateRequest(createRoomZodSchema),createRoom)
route.get('/',getRoom)
route.patch('/',updateRoom)
route.get('/:id',getSingleRoom)
route.delete('/:id',deleteRoom)

export const roomRoute =  route