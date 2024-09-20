import { PrismaClient } from '@prisma/client';

type iPayload = {
  studentId: string;
  academicSemesterId: string;
  totalPaymentAmount: number;
};
export const createSemesterPayment = async (
  tc: Omit<
    PrismaClient<
        {errorFormat:"minimal"},
        never
    >,
    "$connect"|"$disconnect"|"$on"|"$use"|"$transaction"|"$extends"
  >,
  payload: iPayload
) => {
  const isExist = await tc.studentSemesterPayment.findFirst({
    where: {
      student: {
        id: payload.studentId
      },
      academicSemester: {
        id: payload.academicSemesterId
      }
    }
  });

  if(!isExist){
    const dataToInsert = {
        studentId: payload.studentId,
        academicSemesterId: payload.academicSemesterId,
        fullPaymentAmount: payload.totalPaymentAmount,
        partialPaymentAmount: payload.totalPaymentAmount * 0.5,
        totalDueAmount:payload.totalPaymentAmount,
        totalPaidAmount:0
    }

    await tc.studentSemesterPayment.create({
        data:dataToInsert
    })
  }
};
