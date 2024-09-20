import { ExamType, PrismaClient, StudentEnrollCourseStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../shared/catchAsync';
import getGradeFromMark from '../../shared/getGradeFromMark';
import sendResponse from '../../shared/sendResponse';
import { calGrade } from './studentEnrollCourseMark.util';
const prisma = new PrismaClient();

type iPayload = {
  studentId: string;
  academicSemesterId: string;
  studentEnrollCourseId: string;
};
export const createEnrollCourseMark = async (
  tc: Omit<
    PrismaClient<{ errorFormat: 'minimal' }, never>,
    '$connect' | '$disconnect' | '$on' | '$use' | '$transaction' | '$extends'
  >,
  payload: iPayload
) => {
  const isExistMidtermData = await tc.studentEnrollCourseMark.findFirst({
    where: {
      examType: ExamType.MIDTERM,
      student: {
        id: payload.studentId,
      },
      studentEnrollCourse: {
        id: payload.studentEnrollCourseId,
      },
      academicSemester: {
        id: payload.academicSemesterId,
      },
    },
  });
  if (!isExistMidtermData) {
    await tc.studentEnrollCourseMark.create({
      data: {
        studentId: payload.studentId,
        academicSemesterId: payload.academicSemesterId,
        studentEnrollCourseId: payload.studentEnrollCourseId,
        examType: ExamType.MIDTERM,
      },
    });
  }
  const isExistFinalData = await tc.studentEnrollCourseMark.findFirst({
    where: {
      examType: ExamType.FINAL,
      student: {
        id: payload.studentId,
      },
      studentEnrollCourse: {
        id: payload.studentEnrollCourseId,
      },
      academicSemester: {
        id: payload.academicSemesterId,
      },
    },
  });

  if (!isExistFinalData) {
    await tc.studentEnrollCourseMark.create({
      data: {
        studentId: payload.studentId,
        academicSemesterId: payload.academicSemesterId,
        studentEnrollCourseId: payload.studentEnrollCourseId,
        examType: ExamType.FINAL,
      },
    });
  }
};

export const updateStudentMark = catchAsync(async (req, res) => {
  const { marks, studentId, academicSemesterId, courseId } = req.body;
  const studentEnrollCourseMark =
    await prisma.studentEnrollCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrollCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });
  if (!studentEnrollCourseMark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'mark data not found');
  }
  const marksData = getGradeFromMark(marks);
  const result = await prisma.studentEnrollCourseMark.update({
    where: {
      id: studentEnrollCourseMark.id,
    },
    data: {
      marks,
      grade: marksData.grade,
    },
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'mark update successful',
    data: result,
  });
});

export const updateFinalMarks = catchAsync(async (req, res) => {
  const { studentId, academicSemesterId, courseId } = req.body;
  const studentEnrollCourseMark =
    await prisma.studentEnrollCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrollCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });
  if (!studentEnrollCourseMark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'mark data not found');
  }

  const studentEnrollCourseMarks =
    await prisma.studentEnrollCourseMark.findMany({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrollCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });
  if (!studentEnrollCourseMarks.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'student enrolled course mark not found!'
    );
  }

  const midTermMarks =
    studentEnrollCourseMarks.find(item => item.examType === ExamType.MIDTERM)
      ?.marks || 0;
  const finalTermMarks =
    studentEnrollCourseMarks.find(item => item.examType === ExamType.FINAL)
      ?.marks || 0;

  const totalFinalMarks =
    Math.ceil(midTermMarks * 0.4) + Math.ceil(finalTermMarks * 0.6);
  const markData = getGradeFromMark(totalFinalMarks);

  const result = await prisma.studentEnrollCourse.updateMany({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
    data: {
      grade: markData.grade,
      point: markData.point,
      status:StudentEnrollCourseStatus.COMPLETE,
      totalMarks:totalFinalMarks
    },
  });
  // ------------------------------------------------

  const grade = await prisma.studentEnrollCourse.findMany({
    where:{
      student:{
        id:studentId
      }
    },
    include:{
      course:true
    }
  })

  const academicResult = calGrade(grade)

  await prisma.studentAcademicInfo.create({
    data:{
      studentId,
      totalCompletedCredit:academicResult.totalCompletedCredit,
      cgpa:academicResult.cgpa
    }
  })


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'final mark update successful',
    data:result
  });
});
