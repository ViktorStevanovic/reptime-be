import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface LoggedUserPayload {
  sub: string;
  email: string;
  role: string;
  trainerId?: string;
  clientId?: string;
}

export const LoggedUser = createParamDecorator(
  (data: keyof LoggedUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request['user'] as LoggedUserPayload;
    return data ? user?.[data] : user;
  },
);
