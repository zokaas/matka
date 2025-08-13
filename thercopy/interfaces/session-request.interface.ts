import { Request as ExpressRequest } from "express";
import { SessionLoginError } from "./session-login-error.interface";

export interface SessionRequest extends ExpressRequest {
  session: SessionLoginError;
}
