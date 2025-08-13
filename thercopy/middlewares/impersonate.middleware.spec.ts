import { NextFunction } from "express";
import { IImpersonateRequest } from "../interfaces";
import { ImpersonateMiddleware } from "./impersonate.middleware";

describe("ImpersonateMiddleware", () => {
  let middleware: ImpersonateMiddleware;

  let req: IImpersonateRequest;
  const res = {} as Response;
  let next: NextFunction;

  const mockQuery = {
    ref: "123456",
    refType: "ssn",
  };

  beforeEach(() => {
    middleware = new ImpersonateMiddleware();

    req = {
      originalUrl: "/some/path?ref=123&refType=admin",
      query: mockQuery,
      url: "",
    } as unknown as IImpersonateRequest;

    next = jest.fn();
  });

  it("should be defined", () => {
    expect(new ImpersonateMiddleware()).toBeDefined();
  });

  describe("use", () => {
    it("shoud clean URL, attach impersonate object to request and call next()", () => {
      middleware.use(req, res, next);

      expect(req.url).toBe("/some/path");
      expect(req.impersonate).toEqual(mockQuery);
      expect(next).toHaveBeenCalled();
    });

    it("should handle missing query parameters gracefully", () => {
      req.query = { ref: undefined, refType: undefined };
      req.originalUrl = "/dashboard";

      middleware.use(req, res, next);

      expect(req.url).toBe("/dashboard");
      expect(req.impersonate).toEqual({
        ref: undefined,
        refType: undefined,
      });
      expect(next).toHaveBeenCalled();
    });
  });
});
