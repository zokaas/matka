import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { IImpersonateRequest } from "../interfaces";

export const ImpersonateUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IImpersonateRequest>();
    return request.impersonate;
  }
);
