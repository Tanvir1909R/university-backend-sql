import z from 'zod'

export const createSemesterZodSchema = z.object({
    body:z.object({
        year:z.number({
            required_error:"year is required"
        }),
        title:z.string({
            required_error:"title is required"
        }),
        code:z.string({
            required_error:"code is required"
        }),
        startMonth:z.string({
            required_error:"start month required"
        }),
        endMonth:z.string({
            required_error:"end month required"
        })
    })
})