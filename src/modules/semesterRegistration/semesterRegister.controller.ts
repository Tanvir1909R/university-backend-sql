import { Prisma, PrismaClient, semesterRegisterStatus } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helpers/paginationHelper';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';

const prisma = new PrismaClient();

type iFilter = {
  search?: string;
};

export const createSemesterRegister: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const isCourseRunning = await prisma.semesterRegistration.findFirst({
    where:{
      OR:[
        {status:"UPCOMMING"},
        {status:"ONGOING"}
      ]
    }
  }) 
  if(isCourseRunning){
    throw new ApiError(httpStatus.BAD_REQUEST,`There is already an ${isCourseRunning.status} course`)
  }
  const result = await prisma.semesterRegistration.create({
    data
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Register created',
    data: result,
  });
});

export const startMyRegistration: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user;
  const studentInfo = await prisma.student.findFirst({
    where:{studentId:user!.studentId}
  })

  if(!studentInfo){
    throw new ApiError(httpStatus.NOT_FOUND,"user not found")
  }

  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where:{
      status:{in:[semesterRegisterStatus.ONGOING,semesterRegisterStatus.UPCOMMING]}
    }
  })

  if(semesterRegistrationInfo?.status === semesterRegisterStatus.UPCOMMING){
    throw new ApiError(httpStatus.BAD_REQUEST,"Registration is not start yet")
  }
  let result = await prisma.studentSemesterRegistration.findFirst({
    where:{
      student:{
        id: studentInfo?.id
      },
      semesterRegistration:{
        id:semesterRegistrationInfo?.id
      }
    }
  })
  if(!result){
    result = await prisma.studentSemesterRegistration.create({
      // we can add data manually for studentId and registrationId
        data:{
          student:{
            connect:{
              id:studentInfo?.id
            }
          },
          semesterRegistration:{
            connect:{
              id: semesterRegistrationInfo?.id
            }
          }
        }
      })
  }
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration stated',
    data: result,
  });
});

export const getSemesterRegister: RequestHandler = catchAsync(async (req, res) => {
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

  const whereCondition: Prisma.SemesterRegistrationWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.semesterRegistration.findMany({
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
            academicSemester:true
          }
  });
  const total = await prisma.semesterRegistration.count();
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

export const getSingleSemesterRegister:RequestHandler = catchAsync(async(req,res)=>{
  const result = await prisma.semesterRegistration.findFirst({
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

export const updateSemesterRegister: RequestHandler = catchAsync(async (req, res) => {
  const payload = req.body;
  const isExist = await prisma.semesterRegistration.findUnique({
    where:{
      id:req.params.id
    }
  })
  if(!isExist){
    throw new ApiError(httpStatus.BAD_REQUEST,"data not found")
  }

  if(payload.status && isExist.status === semesterRegisterStatus.UPCOMMING && payload.status !== semesterRegisterStatus.ONGOING){
    throw new ApiError(httpStatus.BAD_REQUEST,"you can update only upcoming to ongoing")
  }
  if(payload.status && isExist.status === semesterRegisterStatus.ONGOING && payload.status !== semesterRegisterStatus.ENDED){
    throw new ApiError(httpStatus.BAD_REQUEST,"you can update only ongoing to ended")
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id: req.params.id,
    },
    data: payload,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'student updated successful',
    data: result,
  });
});
export const deleteSemesterRegister: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.semesterRegistration.delete({
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
