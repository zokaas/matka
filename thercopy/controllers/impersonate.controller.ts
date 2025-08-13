import {
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Redirect,
  UseGuards,
} from "@nestjs/common";
import { ImpersonateService } from "../services";
import { AuthenticationGuard } from "../guards";
import { HttpStatusCode } from "axios";
import { ImpersonateUser } from "../decorators";
import { IImpersonateRequestQuery } from "../interfaces";

@Controller("impersonate")
export class ImpersonateController {
  private readonly logger = new Logger(ImpersonateController.name);

  constructor(private readonly impersonateService: ImpersonateService) {}

  @Get("vp/:kcClientId/login")
  @UseGuards(AuthenticationGuard)
  @Redirect("", HttpStatusCode.Found)
  impersonateLogin(
    @ImpersonateUser() userToImpersonate: IImpersonateRequestQuery,
    @Param("kcClientId") kcClientId: string,
    @Headers("authorization") sessionId: string
  ) {
    const url = this.impersonateService.getRedirectUrl(
      kcClientId,
      userToImpersonate.ref,
      userToImpersonate.refType,
      sessionId
    );

    return { url };
  }
}
