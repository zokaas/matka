import { Request } from "express";
import { IImpersonateRequestQuery } from "./impersonate-request-query.interface";

export interface IImpersonateRequest
  extends Request<unknown, unknown, unknown, IImpersonateRequestQuery> {
  impersonate: IImpersonateRequestQuery;
}
