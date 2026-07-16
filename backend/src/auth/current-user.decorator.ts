import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from './token-payload.interface';

const getCurrentUserByContext = (context: ExecutionContext) => {
  return context.switchToHttp().getRequest<Request & { user?: TokenPayload }>()
    .user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
