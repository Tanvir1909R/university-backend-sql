import z from 'zod'

export const createRoomZodSchema = z.object({
    body:z.object({
        roomNumber:z.string({
            required_error:"room number is required"
        }),
        floor:z.string({
            required_error:"floor is required"
        }),
        buildingId:z.string({
            required_error:"building id is required"
        })
    })
})