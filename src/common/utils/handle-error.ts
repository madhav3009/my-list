import { BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';

export function handleError(error: any) {
  if (error instanceof HttpException) {
    throw error;
  }

  // Handle other errors as needed
  if (error?.name === 'CastError' || error?.kind === 'ObjectId') {
    throw new BadRequestException('Invalid ID format');
  }

  throw new InternalServerErrorException({
    success: false,
    message: 'Internal Server error',
    error: error?.message || String(error),
  });
}