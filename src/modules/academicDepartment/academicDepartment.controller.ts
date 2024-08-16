import { AcademicDepartment, Prisma, PrismaClient } from '@prisma/client';
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

export const createDepartment: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await prisma.academicDepartment.create({
    data,
  });
  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic semester created',
    data: result,
  });
});

export const getDepartment: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = pick(query, ['title', 'search']);
  const options = pick(query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { search, ...directFilter }: iFilter = filter;
  const andCondition = [];
  if (search) {
    andCondition.push({
      OR: ['title', 'code'].map(field => ({
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

  const whereCondition: Prisma.AcademicDepartmentWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.academicDepartment.findMany({
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
  const total = await prisma.academicDepartment.count();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'semester get successful',
    data: result,
    meta: {
      total,
      limit,
      page,
    },
  });
});

export const getSingleDepartment:RequestHandler = catchAsync(async(req,res)=>{
  const result = await prisma.academicDepartment.findFirst({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'semester get successful',
    data: result,
  });
})

export const updateDepartment: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.academicDepartment.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'semester updated successful',
    data: result,
  });
});
export const deleteDepartment: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.academicDepartment.delete({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'semester deleted successful',
    data: result,
  });
});
