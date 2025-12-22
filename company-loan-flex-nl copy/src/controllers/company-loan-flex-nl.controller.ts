import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { AdminSession } from "@opr-finance/authentication";
import { ExistingUserQueryParamDto } from "@opr-finance/keycloak";
import {
  ApplicationHandlingService,
  KeycloakApplicationHandlingService,
  ApplicationToolsService,
} from "../services";
import { IpAddress } from "@opr-finance/decorators";
import {
  ApplicationPayloadDto,
  KvkCompaniesListResponseDto,
  KvkCompanyDataDto,
  KvkFrontendRequestParamDto,
  NlPostCodeFrontendRequestParamsDto,
  NlPostCodeResponseDto,
} from "../dtos";
import { ApplicationCreatedResponseDto } from "../dtos/application-created-response.dto";

@Controller("company-loan/flex/:realm/:kcClientId")
export class CompanyLoanFlexNlController {
  constructor(
    private readonly keycloakApplicationHandlingService: KeycloakApplicationHandlingService,
    private readonly applicationHandlingService: ApplicationHandlingService,
    private readonly applicationToolsService: ApplicationToolsService
  ) {}

  private readonly logger = new Logger(CompanyLoanFlexNlController.name);

  @Get("/check")
  async checkEmail(
    @AdminSession("access_token") accessToken: string,
    @Param("kcClientId") kcClientId: string,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      })
    )
    query: ExistingUserQueryParamDto
  ): Promise<{ emailExists: boolean }> {
    const result: boolean =
      await this.keycloakApplicationHandlingService.checkUser(
        kcClientId,
        query.email,
        accessToken
      );

    return { emailExists: result };
  }

  @Post("/send-application")
  async receiveApplication(
    @IpAddress() clientIP: string,
    @Body() body: ApplicationPayloadDto,
    @Param("kcClientId") kcClientId: string
  ): Promise<ApplicationCreatedResponseDto> {
    // Path (?)
    const response = await this.applicationHandlingService.newApplication(
      body,
      kcClientId,
      clientIP
    );

    return response;
  }

  @Get("/kvk/companies")
  async getCompanies(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      })
    )
    query: KvkFrontendRequestParamDto
  ): Promise<KvkCompaniesListResponseDto> {
    const result = await this.applicationToolsService.getCompaniesList(query.q);
    return result;
  }

  @Get("/kvk/company/:kvkNumber")
  async getCompany(
    @Param("kvkNumber") kvkNumber: string
  ): Promise<KvkCompanyDataDto> {
    const result =
      await this.applicationToolsService.getCompanyBasicInfo(kvkNumber);
    return result;
  }

  @Get("/getstreet")
  async getStreet(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      })
    )
    query: NlPostCodeFrontendRequestParamsDto
  ): Promise<NlPostCodeResponseDto> {
    const response = await this.applicationToolsService.getStreet(
      query.postalCode,
      query.number
    );
    return response;
  }
}
