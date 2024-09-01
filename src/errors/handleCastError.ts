import { Prisma } from '@prisma/client';
import { IGenericErrorMessage } from '../interfaces/error';

const handleCastError = (error: Prisma.PrismaClientKnownRequestError) => {
  let errors: IGenericErrorMessage[] = []
  let message = ''
  const statusCode = 400;


  if(error.code === 'P2025'){
    message = (error.message)
    errors = [
      {
       path:'',
       message
      }
    ]
  }
  // more error we can add search prisma error code

  return {
    statusCode,
    message: 'request error',
    errorMessages: errors,
  };
};

export default handleCastError;
