import { Prisma, PrismaClient, Student, StudentEnrollCourse, StudentEnrollCourseStatus } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationHelpers } from '../../helpers/paginationHelper';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { groupByAcademicSemester } from './student.utils';

const prisma = new PrismaClient();

type iFilter = {
  search?: string;
};

export const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await prisma.student.create({
    data
  })
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student created',
    data: result,
  });
});

export const getStudent: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = pick(query, ['email', 'search']);
  const options = pick(query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { search, ...directFilter }: iFilter = filter;
  const andCondition = [];
  if (search) {
    andCondition.push({
      OR: ['firstName', 'lastName'].map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(directFilter).length > 0) {
    andCondition.push({
      AND: Object.entries(directFilter).map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    });
  }

  const whereCondition: Prisma.StudentWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.student.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createAt: 'desc',
          },
          include:{
            academicDepartment:true,
            academicFaculty:true,
            academicSemester:true
          }
  });
  const total = await prisma.student.count();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student successful',
    data: result,
    meta: {
      total,
      limit,
      page,
    },
  });
});

export const getSingleStudent:RequestHandler = catchAsync(async(req,res)=>{
  const result = await prisma.student.findFirst({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student get successful',
    data: result,
  });
})

export const updateStudent: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.student.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student updated successful',
    data: result,
  });
});
export const deleteStudent: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.student.delete({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student deleted successful',
    data: result,
  });
});
export const myCourses: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user
  const currentSemester = await prisma.academicSemester.findFirst({
    where: {
      isCurrent: true
    }
  });
  const result = await prisma.studentEnrollCourse.findMany({
    where: {
      student: {
        studentId: user?.userId
      },
      academicSemesterId: currentSemester?.id
    }
  });
  
  

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'my course get successful',
    data: result,
  });
});
export const getMyCourseSchedules: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user
  
  const currentSemester = await prisma.academicSemester.findFirst({
    where: {
      isCurrent: true
    }
  });
  const enrollCourses = await prisma.studentEnrollCourse.findMany({
    where: {
      student: {
        studentId: user?.userId
      },
      academicSemesterId: currentSemester?.id
    }
  });
  const enrollCoursesIds = enrollCourses.map((course:StudentEnrollCourse)=> course.courseId)
  
  const result = await prisma.studentSemesterRegistrationCourse.findMany({
    where:{
      student:{
        studentId:user!.userId
      },
      semesterRegistration:{
        academicSemester:{
          id:currentSemester?.id
        }
      },
      offeredCourse:{
        course:{
          id:{in:enrollCoursesIds}
        }
      }
    },
    include:{
      offeredCourse:{
        include:{
          course:true
        }
      },
      offeredCourseSection:{
        include:{
          offeredCourseClassSchedule:{
            include:{
              room:{
                include:{
                  building:true
                }
              },
              faculty:true
            }
          }
        }
      }
    }
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'my course schedules get successful',
    data: result,
  });
});
export const myAcademicInfo: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user
  const academicInfo = await prisma.studentAcademicInfo.findFirst({
    where:{
      student:{
        studentId:user!.userId
      }
    }
  })
  const enrolledCourses = await prisma.studentEnrollCourse.findMany({
    where: {
      student: {
        studentId: user!.userId
      },
      status: StudentEnrollCourseStatus.COMPLETE
    },
    include: {
      course: true,
      academicSemester: true
    },
    orderBy: {
      createAt: 'asc'
    }
  });
  const groupByAcademicSemesterData = groupByAcademicSemester(enrolledCourses)
    
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'my course schedules get successful',
    data: {
      academicInfo,
      course:groupByAcademicSemesterData
    },
  });
});
