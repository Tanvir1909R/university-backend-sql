import { Prisma, PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import { paginationHelpers } from '../../helpers/paginationHelper';

const prisma = new PrismaClient();

type iFilter = {
  search?: string;
};

export const createOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const {courseId,academicDepartmentId,semesterRegistrationId} = req.body;
  const result = [];
  if(courseId.length > 0){
    for(let i = 0; i<courseId.length;i++){
      const alreadyExist = await prisma.offeredCourse.findFirst({
        where:{
          courseId:courseId[i],
          academicDepartmentId,
          semesterRegistrationId
        }
      })
      if(!alreadyExist){
        const insertedData = await prisma.offeredCourse.create({
          data:{
            academicDepartmentId,
            semesterRegistrationId,
            courseId:courseId[i]
          }
        })
        result.push(insertedData)
      }
    }
  }
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'offer created',
    data: result,
  });
});

export const getOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = pick(query, ['search']);
  const options = pick(query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { search }: iFilter = filter;
  const andCondition = [];
  if (search) {
    andCondition.push({
      OR: ['title'].map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereCondition: Prisma.OfferedCourseWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.offeredCourse.findMany({
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
  const total = await prisma.room.count();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'room get successful',
    data: result,
    meta: {
      total,
      limit,
      page,
    },
  });
});

export const updateOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.room.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'room updated successful',
    data: result,
  });
});
export const deleteOfferedCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.room.delete({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'room deleted successful',
    data: result,
  });
});
