import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const adminSessionFactory = (
  data: string,
  ctx: ExecutionContext
): unknown => {
  const request = ctx.switchToHttp().getRequest();
  const { adminSession } = request;
  return data ? adminSession?.[data] : adminSession;
};

export const AdminSession = createParamDecorator(adminSessionFactory);
