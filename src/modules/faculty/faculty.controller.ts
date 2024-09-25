import { Faculty, Prisma, PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationHelpers } from '../../helpers/paginationHelper';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';

const prisma = new PrismaClient();

type iFilter = {
  search?: string;
};

export const createFaculty: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await prisma.faculty.create({
    data,
  });
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculty created',
    data: result,
  });
});

export const getFaculty: RequestHandler = catchAsync(async (req, res) => {
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

  const whereCondition: Prisma.FacultyWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.faculty.findMany({
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
  });
  const total = await prisma.academicSemester.count();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculty get successful',
    data: result,
    meta: {
      total,
      limit,
      page,
    },
  });
});

export const getSingleFaculty:RequestHandler = catchAsync(async(req,res)=>{
  const result = await prisma.faculty.findFirst({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculty get successful',
    data: result,
  });
})

export const updateFaculty: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.faculty.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculty updated successful',
    data: result,
  });
});
export const deleteFaculty: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.faculty.delete({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculty deleted successful',
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
  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedule: {
        some: {
          faculty: {
            facultyId: user?.userId
          }
        }
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: currentSemester?.id
          }
        }
      }
    },
    include:{
      offeredCourse:{
        include:{
          course:true
        }
      }
    }
  });

  const courseAndSchedules = offeredCourseSections.reduce((acc:any,obj:any)=>{
    console.log(obj);
    const course = obj.offeredCourse.course;
    const classSchedules = obj.offeredCourseClassSchedule
    const existingCourse = acc.find((item:any)=> item.course?.id === course?.id)
    if(existingCourse){
      existingCourse.section.push({
        section: obj,
        classSchedules
      })
    }else{
      acc.push({
        course,
        section:[{
          section:obj,
          classSchedules
        }]
      })
    }
    return acc
  },[])
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'my course get successful',
    data: courseAndSchedules,
  });
})