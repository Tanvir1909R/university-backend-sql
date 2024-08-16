import z from 'zod'

export const createAcademicFacultyZodSchema = z.object({
    body:z.object({
        title:z.number({
            required_error:"title is required"
        })
    })
})