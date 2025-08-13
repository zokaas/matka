// tokenset.decorator.ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const tokenSetFactoryFn = (
  data: string,
  ctx: ExecutionContext
): unknown => {
  const request = ctx.switchToHttp().getRequest();
  const tokenSet = request?.user?.tokenSet;
  return data ? tokenSet?.[data] : tokenSet;
};

export const Tokenset = createParamDecorator(tokenSetFactoryFn);
