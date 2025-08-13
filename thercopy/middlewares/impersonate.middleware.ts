import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { IImpersonateRequest } from "../interfaces";

@Injectable()
export class ImpersonateMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ImpersonateMiddleware.name);

  constructor() {}

  use(req: IImpersonateRequest, _res: Response, next: NextFunction) {
    const { ref, refType } = req.query;

    // Get the original URL
    const originalUrl = req.originalUrl;

    // Remove query parameters (if any)
    const cleanUrl = originalUrl.split("?")[0];

    // Update the request URL
    req.url = cleanUrl;

    req.impersonate = {
      ref,
      refType,
    };

    next();
  }
}
