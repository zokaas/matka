import { Controller, Get, Logger, Param, UseGuards } from "@nestjs/common";
import { VpImpersonateService } from "../services";
import { SetRoles } from "../decorators";
import { RolesGuard } from "../guards/roles.guard";
import { ContentType } from "@opr-finance/decorators";
import {
  AuthenticationGuard,
  IImpersonateRequestQuery,
  ImpersonateUser,
  UserInfo,
  UserInfoDto,
} from "@opr-finance/authentication";

@Controller("impersonate/vp/:kcClientId")
export class VpImpersonateController {
  private readonly logger = new Logger(VpImpersonateController.name);

  constructor(private readonly vpImpersonateService: VpImpersonateService) {}

  @Get("/customer/*")
  @SetRoles("administrator")
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getImpersonateEngagementsFromVp(
    @Param("kcClientId") kcClientId: string,
    @Param() path: Array<string>,
    @ContentType() contentType: string,
    @UserInfo() user: UserInfoDto,
    @ImpersonateUser() userToImpersonate: IImpersonateRequestQuery
  ) {
    return await this.vpImpersonateService.getImpersonatedCustomerEngagementsFromVp(
      kcClientId,
      path[0],
      contentType,
      userToImpersonate.ref,
      userToImpersonate.refType
    );
  }
}
