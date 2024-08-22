import {  Building, Prisma, PrismaClient } from '@prisma/client';
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

export const createBuilding: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await prisma.building.create({
    data,
  });
  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building created',
    data: result,
  });
});

export const getBuilding: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = pick(query, [ 'search']);
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

  const whereCondition: Prisma.BuildingWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.building.findMany({
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
  const total = await prisma.building.count();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building get successful',
    data: result,
    meta: {
      total,
      limit,
      page,
    },
  });
});

export const getSingleBuilding:RequestHandler = catchAsync(async(req,res)=>{
  const result = await prisma.building.findFirst({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building get successful',
    data: result,
  });
})

export const updateBuilding: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.building.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building updated successful',
    data: result,
  });
});
export const deleteBuilding: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.building.delete({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building deleted successful',
    data: result,
  });
});
