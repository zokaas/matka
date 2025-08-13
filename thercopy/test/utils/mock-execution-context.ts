import { ExecutionContext } from "@nestjs/common";

export function createMockExecutionContext(
  request: unknown,
  controllerName = "TestController"
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({}),
      getNext: () => jest.fn(),
    }),
    getClass: () => ({ name: controllerName, prototype: {} }),
    getHandler: () => jest.fn(),
    getArgs: () => [],
    getArgByIndex: () => undefined,
    getType: () => "http",
  } as unknown as ExecutionContext;
}
