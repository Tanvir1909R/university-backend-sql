import z from 'zod'

export const createStudentZodSchema = z.object({
    body:z.object({
        studentId:z.string().optional(),
        firstName:z.number({
            required_error:"first name is required"
        }),
        lastName:z.string({
            required_error:"last name is required"
        }),
        profileImage:z.string().optional(),
        email:z.string({
            required_error:"email is required"
        }),
        contact:z.number({
            required_error:"contact is required"
        }),
        bloodgroup:z.string({
            required_error:"blood group is required"
        }),
        gender:z.string({
            required_error:"gender is required"
        }),
        academicSemesterId:z.string({
            required_error:"semester id is required"
        }),
        academicDepartmentId:z.string({
            required_error:"department id is required"
        }),
        academicFacultyId:z.string({
            required_error:"faculty id  is required"
        })
    })
})