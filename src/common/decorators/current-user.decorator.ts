import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Assuming -  JWT Auth will be implemented 
    return request.headers['x-user-id'] || 'mock-user-id';
  },
);