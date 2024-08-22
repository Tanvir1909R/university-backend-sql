import z from 'zod'

export const createBuildingZodSchema = z.object({
    body:z.object({
        title:z.string({
            required_error:"title is required"
        }),
    })
})