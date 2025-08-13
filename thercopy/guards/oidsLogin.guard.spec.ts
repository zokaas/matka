import { OidcLoginGuard } from "./oidcLogin.guard";
import { ExecutionContext } from "@nestjs/common";

describe("OidcLoginGuard", () => {
  let guard: OidcLoginGuard;

  beforeEach(() => {
    guard = new OidcLoginGuard();
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should call super.canActivate and logIn", async () => {
    const mockRequest = {};
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(Object.getPrototypeOf(OidcLoginGuard.prototype), "canActivate")
      .mockResolvedValue(true);

    const logInSpy = jest
      .spyOn(Object.getPrototypeOf(OidcLoginGuard.prototype), "logIn")
      .mockResolvedValue(undefined);

    const result = await guard.canActivate(context);

    expect(canActivateSpy).toHaveBeenCalledWith(context);
    expect(logInSpy).toHaveBeenCalledWith(mockRequest);
    expect(result).toBe(true);
  });
});
