import { OfferedCourseClassSchedule, PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
const prisma = new PrismaClient();




export const checkRoomAvailable = async (data:OfferedCourseClassSchedule) => {
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
};
export const checkFacultyAvailable = async (data:OfferedCourseClassSchedule) => {
  const alreadyFacultyAssigned = await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        faculty: {
          id: data.facultyId,
        },
      },
    });

    const existingSlot = alreadyFacultyAssigned.map(schedule => ({
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
  
        if (
          newSlotStartTime < existSlotEndTime &&
          newtSlotEndTime > existSlotStartTime
        ) {
          throw new ApiError(
            httpStatus.CONFLICT,
            'faculty unavailable on that time'
          );
        }
      }
};
