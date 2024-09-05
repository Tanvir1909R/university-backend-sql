import { Prisma, PrismaClient } from '@prisma/client';
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

export const createOfferedCourseSection: RequestHandler = catchAsync(
  async (req, res) => {
    const body = req.body;
    const isExist = await prisma.offeredCourse.findFirst({
      where: {
        id:body.offeredCourseId
      }
    });
    if (!isExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'offered course not found');
    }
    body.semesterRegistrationId = isExist.semesterRegistrationId;
    const result = await prisma.offeredCourseSection.create({
      data: body,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'offer created',
      data: result,
    });
  }
);

export const getOfferedCourseSection: RequestHandler = catchAsync(
  async (req, res) => {
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

    const whereCondition: Prisma.OfferedCourseSectionWhereInput =
      andCondition.length > 0 ? { AND: andCondition } : {};
    const result = await prisma.offeredCourseSection.findMany({
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
  }
);

export const updateOfferedCourseSection: RequestHandler = catchAsync(
  async (req, res) => {
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
  }
);
export const deleteOfferedCourseSection: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await prisma.offeredCourseSection.delete({
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
  }
);
