import { Request } from "express";
import { TokenSetDto } from "../dtos";
import { IRequestQueryParams } from "./request-query-params.interface";

export interface IRequestWithAdmin
  extends Request<IRequestQueryParams, unknown, unknown, unknown> {
  adminSession: TokenSetDto;
}
