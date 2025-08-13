import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

export const sessionIdFactory = (
  data: unknown,
  ctx: ExecutionContext
): string => {
  const request = ctx.switchToHttp().getRequest();
  const sessionId = request.sessionId;

  if (sessionId) return sessionId;

  const createdSessionId = uuidv4();
  return createdSessionId;
};

export const SessionId = createParamDecorator(sessionIdFactory);
