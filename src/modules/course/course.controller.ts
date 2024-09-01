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
type iCreateBody={
  prerequisiteCourse?:{
    prerequisiteCourseId:string
  }[]
  title:string,
  code:string,
  credit:number
}

type iUpdateCourse = {
  prerequisiteCourse?:{
    prerequisiteCourseId:string,
    isDeleted:boolean
  }[]
  title?:string,
  code?:string,
  credit?:number
}
export const createCourse: RequestHandler = catchAsync(async (req, res) => {
  const { prerequisiteCourse, ...courseData }:iCreateBody = req.body;
  const newCourse = await prisma.$transaction(async tc => {
    const result = await tc.course.create({
      data: courseData,
    });

    if (prerequisiteCourse && prerequisiteCourse.length > 0) {
      for (let i = 0; i < prerequisiteCourse.length; i++) {
         await tc.courseToPrerequisite.create({
          data: {
            courseId: result.id,
            prerequisiteId: prerequisiteCourse[i].prerequisiteCourseId,
          },
        });
      }
      
    }

    return result;
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'course created',
    data: newCourse,
  });
});

export const getCourse: RequestHandler = catchAsync(async (req, res) => {
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

  const whereCondition: Prisma.CourseWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  const result = await prisma.course.findMany({
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
    include:{
      rerequisite:true
    }
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

export const getSingleCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.room.findFirst({
    where: {
      id: req.params.id,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'room get successful',
    data: result,
  });
});

export const updateCourse: RequestHandler = catchAsync(async (req, res) => {
  const {prerequisiteCourse,...courseBody}:iUpdateCourse = req.body;

  const updateCourse = await prisma.$transaction(async(tc)=>{
    const result = await tc.course.update({
      where: {
        id: req.params.id,
      },
      data: courseBody,
    });

    if(prerequisiteCourse && prerequisiteCourse.length > 0){
      const deletePrerequisite = prerequisiteCourse.filter(singleCourse => singleCourse.prerequisiteCourseId && singleCourse.isDeleted)
      console.log(deletePrerequisite);

      const remainPrerequisite = prerequisiteCourse.filter(singleCourse => singleCourse.prerequisiteCourseId && !singleCourse.isDeleted)
      console.log(deletePrerequisite);
      
      for(let i = 0;i < deletePrerequisite.length;i++){
        await tc.courseToPrerequisite.deleteMany({
          where:{
            AND:[
              {
                courseId:req.params.id
              },
              {
                prerequisiteId:deletePrerequisite[i].prerequisiteCourseId
              }
            ]
          }
        })
      }
      for(let i = 0;i < remainPrerequisite.length;i++){
        await tc.courseToPrerequisite.create({
          data:{
            courseId:req.params.id,
            prerequisiteId:remainPrerequisite[i].prerequisiteCourseId
          }
        })
      }
    }

    return result
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'course updated successful',
    data: updateCourse,
  });
});
export const deleteCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await prisma.course.delete({
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

export const removeFaculty:RequestHandler = catchAsync(async(req,res)=>{
  const id = req.params.id;
  const {faculties} = req.body

  await prisma.courseFaculty.deleteMany({
    where:{
      courseId:id,
      facultyId:{
        in: faculties
      }
    }
  })

  const result = await prisma.courseFaculty.findMany({
    where:{
      courseId:id
    },
    include:{
      faculty:true
    }
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculty remove successful',
    data: result,
  });
})
export const assignFaculty:RequestHandler = catchAsync(async(req,res)=>{
  const id = req.params.id;
  const {faculties} = req.body

  await prisma.courseFaculty.createMany({
    data: faculties.map((facultyId:string)=>({
      courseId:id,
      facultyId
    }))
  })

  const result = await prisma.courseFaculty.findMany({
    where:{
      courseId:id
    },
    include:{
      faculty:true
    }
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'faculty assign successful',
    data: result,
  });
})