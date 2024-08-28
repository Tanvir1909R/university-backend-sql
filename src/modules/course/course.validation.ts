import z from 'zod'

export const createCourseZodSchema = z.object({
    body:z.object({
        title:z.string({
            required_error:"title is required"
        }),
        code:z.string({
            required_error:"code is required"
        }),
        credit:z.number().optional()
    })
})