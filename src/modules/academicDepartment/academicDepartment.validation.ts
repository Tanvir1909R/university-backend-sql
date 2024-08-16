import z from 'zod'

export const createDepartmentZodSchema = z.object({
    body:z.object({
        title:z.string({
            required_error:"title is required"
        }),
        academicFacultyId:z.string({
            required_error:"academic faculty id is required"
        })
    })
})