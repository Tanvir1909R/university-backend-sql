import { Prisma, PrismaClient, Student } from '@prisma/client';
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

export const createStudent: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await prisma.student.create({
    data,
  });
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
