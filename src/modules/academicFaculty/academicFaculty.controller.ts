import { AcademicFaculty, PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';

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

export const getAcademicFaculty:RequestHandler = catchAsync(async(req,res)=>{
    const result = await prisma.academicFaculty.findMany()
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"academic faculty get successful",
        data:result
    })
}) 
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
