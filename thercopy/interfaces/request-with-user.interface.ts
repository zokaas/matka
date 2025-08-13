import { Request } from "express";
import { SessionDto, TokenSetDto, UserInfoDto } from "../dtos/session";
import { IRequestQueryParams } from "./request-query-params.interface";

export interface IRequestWithUser
  extends Request<IRequestQueryParams, unknown, unknown, IRequestQueryParams> {
  user: SessionDto;
  userInfo: UserInfoDto;
  tokenset: TokenSetDto;
  sessionId: string;
  sessionRefreshCount: number;
}
