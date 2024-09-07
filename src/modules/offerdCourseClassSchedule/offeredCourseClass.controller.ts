import { Prisma, PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helpers/paginationHelper';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { checkFacultyAvailable } from './offeredClassUtils';

const prisma = new PrismaClient();

type iFilter = {
  search?: string;
};

export const createOfferedCourseClassSchedule: RequestHandler = catchAsync(
  async (req, res) => {
    const data = req.body;

    const alreadyBookRoomOnDay =
      await prisma.offeredCourseClassSchedule.findMany({
        where: {
          dayOfWeek: data.dayOfWeek,
          room: {
            id: data.roomId,
          },
        },
      });

    const existingSlot = alreadyBookRoomOnDay.map(schedule => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
    }));
    const newSlot = {
      startTime: data.startTime,
      endTime: data.endTime,
      dayOfWeek: data.dayOfWeek,
    };

    for (const slot of existingSlot) {
      const existSlotStartTime = new Date(`2024-01-01T${slot.startTime}:00`);
      const existSlotEndTime = new Date(`2024-01-01T${slot.endTime}:00`);
      const newSlotStartTime = new Date(`2024-01-01T${newSlot.startTime}:00`);
      const newtSlotEndTime = new Date(`2024-01-01T${newSlot.startTime}:00`);

      // ------04:00----------07:00-----
      // -----------05:00----------08:00
      // 03:00-----------06:00----------

      if (
      newSlotStartTime < existSlotEndTime &&
      newtSlotEndTime > existSlotStartTime
      ) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Room already booked on that time bg'
        );
      }
    }

    await checkFacultyAvailable(data)

    const result = await prisma.offeredCourseClassSchedule.create({
      data,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'offer created',
      data: result,
    });
  }
);

const offeredClassScheduleMapper: { [key: string]: string } = {
  offeredCourseSectionId: 'offeredCourseSection',
  semesterRegistrationId: 'semesterRegistration',
  roomId: 'room',
  facultyId: 'faculty',
};

export const getOfferedCourseClassSchedule: RequestHandler = catchAsync(
  async (req, res) => {
    const query = req.query;
    const filter = pick(query, ['search']);
    const options = pick(query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const { limit, page, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(options);
    const { search, ...directFilter }: iFilter = filter;
    const andCondition = [];
    if (search) {
      andCondition.push({
        OR: ['dayOfWeek'].map(field => ({
          [field]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      });
    }

    if (Object.keys(directFilter).length > 0) {
      andCondition.push({
        AND: Object.keys(directFilter).map(key => {
          if (
            [
              'offeredCourseSectionId',
              'semesterRegistrationId',
              'roomId',
              'facultyId',
            ].includes(key)
          ) {
            return {
              [offeredClassScheduleMapper[key]]: {
                id: (directFilter as any)[key],
              },
            };
          } else {
            return {
              [key]: {
                equals: (directFilter as any)[key],
              },
            };
          }
        }),
      });
    }

    const whereCondition: Prisma.OfferedCourseClassScheduleWhereInput =
      andCondition.length > 0 ? { AND: andCondition } : {};
    const result = await prisma.offeredCourseClassSchedule.findMany({
      include: {
        faculty: true,
        offeredCourseSection: true,
        room: true,
        semesterRegistration: true,
      },
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
    const total = await prisma.offeredCourseClassSchedule.count();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'class get successful',
      data: result,
      meta: {
        total,
        limit,
        page,
      },
    });
  }
);

export const updateOfferedCourseClassSchedule: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await prisma.offeredCourseClassSchedule.update({
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
export const deleteOfferedCourseClassSchedule: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await prisma.offeredCourseClassSchedule.delete({
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
