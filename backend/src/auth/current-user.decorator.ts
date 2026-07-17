import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from './token-payload.interface';

const getCurrentUserByContext = (
  data: keyof TokenPayload | undefined,
  context: ExecutionContext,
) => {
  const request = context
    .switchToHttp()
    .getRequest<Request & { user?: TokenPayload }>();
  const user = request.user as TokenPayload;
  if (!user) return null;
  return data ? user[data] : user;
};

export const CurrentUser = createParamDecorator(
  (data: keyof TokenPayload | undefined, context: ExecutionContext) =>
    getCurrentUserByContext(data, context),
);
