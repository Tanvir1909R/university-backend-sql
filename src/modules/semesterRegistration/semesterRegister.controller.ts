import { Prisma, PrismaClient, semesterRegisterStatus } from '@prisma/client';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helpers/paginationHelper';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { createEnrollCourseMark } from '../studentEnrollCourseMark/studentEnrollCourseMark.controller';
import { createSemesterPayment } from '../studentSemesterPayment/studentSemesterPayment.controller';

const prisma = new PrismaClient();

type iFilter = {
  search?: string;
};

export const createSemesterRegister: RequestHandler = catchAsync(
  async (req, res) => {
    const data = req.body;
    const isCourseRunning = await prisma.semesterRegistration.findFirst({
      where: {
        OR: [{ status: 'UPCOMMING' }, { status: 'ONGOING' }],
      },
    });
    if (isCourseRunning) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `There is already an ${isCourseRunning.status} course`
      );
    }
    const result = await prisma.semesterRegistration.create({
      data,
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Register created',
      data: result,
    });
  }
);

export const startMyRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.user;
    const studentInfo = await prisma.student.findFirst({
      where: { studentId: user!.studentId },
    });

    if (!studentInfo) {
      throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    }

    const semesterRegistrationInfo =
      await prisma.semesterRegistration.findFirst({
        where: {
          status: {
            in: [
              semesterRegisterStatus.ONGOING,
              semesterRegisterStatus.UPCOMMING,
            ],
          },
        },
      });

    if (semesterRegistrationInfo?.status === semesterRegisterStatus.UPCOMMING) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Registration is not start yet'
      );
    }
    let result = await prisma.studentSemesterRegistration.findFirst({
      where: {
        student: {
          id: studentInfo?.id,
        },
        semesterRegistration: {
          id: semesterRegistrationInfo?.id,
        },
      },
    });
    if (!result) {
      result = await prisma.studentSemesterRegistration.create({
        // we can add data manually for studentId and registrationId
        data: {
          student: {
            connect: {
              id: studentInfo?.id,
            },
          },
          semesterRegistration: {
            connect: {
              id: semesterRegistrationInfo?.id,
            },
          },
        },
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Registration stated',
      data: result,
    });
  }
);

export const enrollToCourse: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const student = await prisma.student.findFirst({
    where: { studentId: user!.userId },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, `user not found`);
  }
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: semesterRegisterStatus.ONGOING,
    },
  });
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, `registration not found`);
  }
  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: { id: payload.offeredCourseId },
    include: { course: true },
  });
  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, `offered course not found`);
  }
  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: { id: payload.offeredCourseSectionId },
  });
  if (!offeredCourseSection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `offered course section not found`
    );
  }

  if (
    offeredCourseSection.currentlyEnrolledStudent &&
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrolledStudent >
      offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, `maximum capacity reached`);
  }

  await prisma.$transaction(async tc => {
    await tc.studentSemesterRegistrationCourse.create({
      data: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration?.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },
    });

    await tc.offeredCourseSection.update({
      where: { id: payload.offeredCourseSectionId },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });
    await tc.studentSemesterRegistration.updateMany({
      where: {
        student: { id: student.id },
        semesterRegistration: { id: semesterRegistration.id },
      },
      data: {
        totalCreditsTaken: {
          increment: +offeredCourse.course.credit!,
        },
      },
    });
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester enroll complete',
    // data: enrollCourse,
  });
});

export const withdrewFromCourse: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const student = await prisma.student.findFirst({
      where: { studentId: user!.userId },
    });

    if (!student) {
      throw new ApiError(httpStatus.NOT_FOUND, `user not found`);
    }
    const semesterRegistration = await prisma.semesterRegistration.findFirst({
      where: {
        status: semesterRegisterStatus.ONGOING,
      },
    });
    if (!semesterRegistration) {
      throw new ApiError(httpStatus.NOT_FOUND, `registration not found`);
    }
    const offeredCourse = await prisma.offeredCourse.findFirst({
      where: { id: payload.offeredCourseId },
      include: { course: true },
    });
    if (!offeredCourse) {
      throw new ApiError(httpStatus.NOT_FOUND, `offered course not found`);
    }

    await prisma.$transaction(async tc => {
      await tc.studentSemesterRegistrationCourse.delete({
        where: {
          semesterRegistrationId_studentId: {
            semesterRegistrationId: semesterRegistration?.id,
            studentId: student?.id,
          },
        },
      });

      await tc.offeredCourseSection.update({
        where: { id: payload.offeredCourseSectionId },
        data: {
          currentlyEnrolledStudent: {
            decrement: 1,
          },
        },
      });
      await tc.studentSemesterRegistration.updateMany({
        where: {
          student: { id: student.id },
          semesterRegistration: { id: semesterRegistration.id },
        },
        data: {
          totalCreditsTaken: {
            decrement: +offeredCourse.course.credit!,
          },
        },
      });
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester withdrew complete',
      // data: enrollCourse,
    });
  }
);

export const confirmMyRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.user;
    const semesterRegistration = await prisma.semesterRegistration.findFirst({
      where: {
        status: semesterRegisterStatus.ONGOING,
      },
    });
    if (!semesterRegistration) {
      throw new ApiError(httpStatus.NOT_FOUND, `registration not found`);
    }

    const studentSemesterRegistration =
      await prisma.studentSemesterRegistration.findFirst({
        where: {
          semesterRegistration: {
            id: semesterRegistration?.id,
          },
          student: {
            studentId: user!.userId,
          },
        },
      });

    if (!studentSemesterRegistration) {
      throw new ApiError(httpStatus.BAD_REQUEST, `you are not recognize`);
    }

    if (studentSemesterRegistration.totalCreditsTaken === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `you are not enrolled any course`
      );
    }

    if (
      studentSemesterRegistration.totalCreditsTaken &&
      semesterRegistration.minCredit &&
      semesterRegistration.maxCredit &&
      studentSemesterRegistration.totalCreditsTaken <
        semesterRegistration.minCredit &&
      studentSemesterRegistration.totalCreditsTaken >
        semesterRegistration.maxCredit
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `you can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit}`
      );
    }
    await prisma.studentSemesterRegistration.update({
      where: {
        id: studentSemesterRegistration.id,
      },
      data: {
        isConfirm: true,
      },
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' complete',
      // data: enrollCourse,
    });
  }
);

export const getMyRegistration: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.user;
    const semesterRegister = await prisma.semesterRegistration.findFirst({
      where: {
        status: semesterRegisterStatus.ONGOING,
      },
    });

    const studentSemesterRegistration =
      await prisma.studentSemesterRegistration.findFirst({
        where: {
          semesterRegistration: {
            id: semesterRegister?.id,
          },
          student: {
            studentId: user!.userId,
          },
        },
      });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'registration data fetch successful',
      data: {
        semesterRegister,
        studentSemesterRegistration,
      },
    });
  }
);

export const startNewSemester: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const semesterRegistration = await prisma.semesterRegistration.findUnique({
    where: { id },
    include: {
      academicSemester: true,
    },
  });
  if (!semesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'semester not found');
  }
  if (semesterRegistration.status !== semesterRegisterStatus.ENDED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'semester registration not end yet'
    );
  }

  if (semesterRegistration.academicSemester.isCurrent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'semester already started');
  }

  await prisma.$transaction(async tc => {
    await tc.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });
    await tc.academicSemester.update({
      where: {
        id: semesterRegistration.academicSemester.id,
      },
      data: {
        isCurrent: true,
      },
    });
    const studentSemesterRegistrations =
      await prisma.studentSemesterRegistration.findMany({
        where: {
          semesterRegistration: {
            id,
          },
          isConfirm: true,
        },
      });

    for (const semesterSR of studentSemesterRegistrations) {
      if(semesterSR.totalCreditsTaken){
        const totalPayment = semesterSR.totalCreditsTaken * 5000;
        await createSemesterPayment(tc,{
          studentId: semesterSR.studentId,
          academicSemesterId:semesterRegistration.academicSemesterId,
          totalPaymentAmount:totalPayment
        })
      }
      const studentSemesterRegistrationCourses =
        await tc.studentSemesterRegistrationCourse.findMany({
          where: {
            semesterRegistration: { id },
            student: {
              id: semesterSR.studentId,
            },
          },
          include: {
            offeredCourse: {
              include: {
                course: true,
              },
            },
          },
        });
      for (const item of studentSemesterRegistrationCourses) {
        const isExist = await tc.studentEnrollCourse.findFirst({
          where: {
            studentId: item.studentId,
            courseId: item.offeredCourse.courseId,
            academicSemesterId: semesterRegistration.academicSemesterId,
          },
        });
        if (!isExist) {
          const enrollCourseData = {
            studentId: item.studentId,
            courseId: item.offeredCourse.courseId,
            academicSemesterId: semesterRegistration.academicSemesterId,
          };

          const studentEnrollCourseData = await tc.studentEnrollCourse.create({
            data: enrollCourseData,
          });
          await createEnrollCourseMark(tc,{
            studentId: item.studentId,
            academicSemesterId:semesterRegistration.academicSemesterId,
            studentEnrollCourseId:studentEnrollCourseData.id
          })
        }
      }
    }
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'semester start successful',
  });
});

export const getSemesterRegister: RequestHandler = catchAsync(
  async (req, res) => {
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
      include: {
        academicSemester: true,
      },
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
  }
);

export const getSingleSemesterRegister: RequestHandler = catchAsync(
  async (req, res) => {
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
  }
);

export const updateSemesterRegister: RequestHandler = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const isExist = await prisma.semesterRegistration.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!isExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'data not found');
    }

    if (
      payload.status &&
      isExist.status === semesterRegisterStatus.UPCOMMING &&
      payload.status !== semesterRegisterStatus.ONGOING
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'you can update only upcoming to ongoing'
      );
    }
    if (
      payload.status &&
      isExist.status === semesterRegisterStatus.ONGOING &&
      payload.status !== semesterRegisterStatus.ENDED
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'you can update only ongoing to ended'
      );
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
  }
);
export const deleteSemesterRegister: RequestHandler = catchAsync(
  async (req, res) => {
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
  }
);
