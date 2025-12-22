import {
  Body,
  Controller,
  Get,
  Header,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ViljaPlatformService } from "../services";
import { SetRoles } from "../decorators";
import { RolesGuard } from "../guards/roles.guard";
import { ContentType, IpAddress } from "@opr-finance/decorators";
import {
  CreateApplicationDto,
  CreateApplicationDynamicFieldsDto,
  CreateTrancheDto,
  HandleBankAccountDto,
  UpdateProfileDto,
} from "../dtos";
import {
  AuthenticationGuard,
  UserInfo,
  UserInfoDto,
} from "@opr-finance/authentication";

@Controller("vp/:kcClientId")
export class ViljaPlatformController {
  private readonly logger = new Logger(ViljaPlatformController.name);

  constructor(private readonly viljaPlatformService: ViljaPlatformService) {}

  @Get("individual/*")
  @SetRoles("customer")
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getEngagements(
    @Param("kcClientId") kcClientId: string,
    @Param() path: Array<string>,
    @ContentType() contentType: string,
    @UserInfo() user: UserInfoDto
  ) {
    const { ref, refType } = user.attrs;
    const apiPath = path[0];

    this.logger.log(
      `\nname = getEngagements\nkcClientId = ${kcClientId}; \napiPath = ${apiPath}; \ncontentType = ${contentType}; \n`
    );

    return await this.viljaPlatformService.getCustomerEngagementsFromVp(
      kcClientId,
      apiPath,
      contentType,
      ref,
      refType
    );
  }

  @Post("withdraw/*")
  @SetRoles("customer")
  @UseGuards(AuthenticationGuard, RolesGuard)
  async createTranche(
    @Body() payload: CreateTrancheDto,
    @Param("kcClientId") kcClientId: string,
    @Param() path: Array<string>,
    @ContentType() contentType: string
  ) {
    const apiPath = path[0];

    this.logger.log(
      `\nname = createTranche\nkcClientId = ${kcClientId}; \napiPath = ${apiPath}; \ncontentType = ${contentType}; \n`
    );

    return await this.viljaPlatformService.createTranche(
      kcClientId,
      apiPath,
      contentType,
      payload
    );
  }

  @Post("topup/*")
  @SetRoles("customer")
  @UseGuards(AuthenticationGuard, RolesGuard)
  async createTopup(
    @Body() payload: CreateApplicationDto | CreateApplicationDynamicFieldsDto,
    @Param("kcClientId") kcClientId: string,
    @Param() path: Array<string>,
    @ContentType() contentType: string,
    @IpAddress() clientIP: string
  ) {
    const apiPath = path[0];

    this.logger.log(
      `\nname = createTopup\nkcClientId = ${kcClientId}; \napiPath = ${apiPath}; \ncontentType = ${contentType}; \n`
    );

    return await this.viljaPlatformService.createTopup(
      kcClientId,
      apiPath,
      contentType,
      clientIP,
      payload
    );
  }

  @Put("update/bankaccount/*")
  @SetRoles("customer")
  @UseGuards(AuthenticationGuard, RolesGuard)
  async updateBankAccount(
    @Body() body: HandleBankAccountDto,
    @Param("kcClientId") kcClientId: string,
    @Param() path: Array<string>,
    @ContentType() contentType: string
  ) {
    const apiPath = path[0];
    this.logger.log(
      `\nname = updateBankAccount\nkcClientId = ${kcClientId}; \napiPath = ${apiPath}; \ncontentType = ${contentType}; \n`
    );

    const response = await this.viljaPlatformService.handleBankAccountOperation<
      HandleBankAccountDto,
      HandleBankAccountDto
    >(kcClientId, apiPath, contentType, { ...body }, "PUT");

    return response;
  }

  @Post("create/bankaccount/*")
  @SetRoles("customer")
  @UseGuards(AuthenticationGuard, RolesGuard)
  async createBankAccount(
    @Body() body: HandleBankAccountDto,
    @Param("kcClientId") kcClientId: string,
    @Param() path: Array<string>,
    @ContentType() contentType: string
  ) {
    const apiPath = path[0];
    this.logger.log(
      `\nname = createBankAccount\nkcClientId = ${kcClientId}; \napiPath = ${apiPath}; \ncontentType = ${contentType}; \n`
    );

    const response = await this.viljaPlatformService.handleBankAccountOperation<
      HandleBankAccountDto,
      HandleBankAccountDto
    >(kcClientId, apiPath, contentType, { ...body }, "POST");

    return response;
  }

  @Patch("update/profile/*")
  @SetRoles("customer")
  @UseGuards(AuthenticationGuard, RolesGuard)
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @Param("kcClientId") kcClientId: string,
    @Param() path: Array<string>,
    @ContentType() contentType: string
  ) {
    const apiPath = path[0];
    this.logger.log(
      `\nname = updateProfile\nkcClientId = ${kcClientId}; \napiPath = ${apiPath}; \ncontentType = ${contentType}; \n`
    );

    const response =
      await this.viljaPlatformService.updateCustomerData<UpdateProfileDto>(
        kcClientId,
        apiPath,
        contentType,
        { ...body }
      );

    return response;
  }

  @Get("file/*")
  @Header("Content-Type", "application/pdf")
  @SetRoles("customer", "administrator")
  @UseGuards(AuthenticationGuard, RolesGuard)
  async proxyFileRequestToVp(
    @Param("kcClientId") kcClientId: string,
    @Param() path: Array<string>,
    @ContentType() contentType: string
  ) {
    const apiPath = path[0];
    this.logger.log(
      `\nname = proxyFileRequestToVp\nkcClientId = ${kcClientId}; \napiPath = ${apiPath}; \ncontentType = ${contentType}`
    );

    return await this.viljaPlatformService.getFileFromVp(
      kcClientId,
      apiPath,
      contentType
    );
  }

  @Get("*")
  @SetRoles("customer", "administrator")
  @UseGuards(AuthenticationGuard, RolesGuard)
  async proxyRequestToVp(
    @Param("kcClientId") kcClientId: string,
    @Param() path: Array<string>,
    @ContentType() contentType: string
  ) {
    const apiPath = path[0];
    this.logger.log(
      `\nname = proxyRequestToVp\nkcClientId = ${kcClientId}; \napiPath = ${apiPath}; \ncontentType = ${contentType};`
    );

    return await this.viljaPlatformService.getDataFromVp(
      kcClientId,
      apiPath,
      contentType
    );
  }
}
