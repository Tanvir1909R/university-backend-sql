import { Course, StudentEnrollCourse } from "@prisma/client";

export const calGrade = (payload:(StudentEnrollCourse & {course:Course})[])=>{
    
    const result = {
        totalCompletedCredit:0,
        cgpa:0
    }

    if(payload.length === 0){
        return result
    }
    let totalCredit = 0;
    let totalCGPA = 0;
    for (const grade of payload){
        totalCredit += grade.course.credit || 0;
        totalCGPA += grade.point || 0
    }

    const avgCGPA = +((totalCGPA / payload.length).toFixed(2))
    return{
        totalCompletedCredit:totalCredit,
        cgpa:avgCGPA
    }
} 