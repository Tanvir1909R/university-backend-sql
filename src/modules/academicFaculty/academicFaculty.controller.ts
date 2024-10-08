import { AcademicFaculty, Prisma, PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import { paginationHelpers } from '../../helpers/paginationHelper';

const prisma = new PrismaClient();

export const createAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await prisma.academicFaculty.create({
    data,
  });
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic faculty created',
    data: result,
  });
});
export const getAcademicFaculty: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = pick(query, ['title', 'search']);
  const options = pick(query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { search, ...directFilter } = filter;
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
  if (Object.keys(directFilter).length > 0) {
    andCondition.push({
      AND: Object.entries(directFilter).map(([key, value]) => ({
        [key]: {
          equals: value,
        },
      })),
    });
  }

  const whereCondition:Prisma.AcademicFacultyWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.academicFaculty.findMany({
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
export const updateAcademicFaculty:RequestHandler = catchAsync(async(req,res)=>{
    const result = await prisma.academicFaculty.update({
      where:{
        id:req.params.id
      },
      data:req.body
    })

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"academic faculty updated successful",
        data:result
    })
}) 
export const deleteAcademicFaculty:RequestHandler = catchAsync(async(req,res)=>{
    const result = await prisma.academicFaculty.delete({
      where:{
        id:req.params.id
      }
    })

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"academic faculty deleted successful",
        data:result
    })
}) 
