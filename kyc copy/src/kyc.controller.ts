import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { KycService } from "./kyc.service";
import { AuthenticationGuard } from "@opr-finance/authentication";
import { OptionDto, FormAnswersDto } from "./dtos";
import { KycResponseTransformInterceptor } from "./interceptors";
import { LoggerService } from "@opr-finance/logger";

@Controller("kyc")
export class KycController {
  private readonly logger = new Logger(KycController.name);

  constructor(
    private readonly kycService: KycService,
    private readonly loggerService: LoggerService
  ) {}

  @Get("/form/:kcClientId/:kycType")
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(KycResponseTransformInterceptor)
  async getProductData(
    @Param("kcClientId") productId: string,
    @Param("kycType") kycType: string
  ) {
    const startTime = Date.now();

    this.logger.log(`[KYC] GET /form/${productId}/${kycType}`);

    try {
      const productData = await this.kycService.getProductData(
        productId,
        kycType
      );

      const duration = Date.now() - startTime;
      this.logger.log(
        `[KYC] GET /form/${productId}/${kycType} - Success (${duration}ms)`
      );

      return productData;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error(
        `[KYC ERROR] GET /form/${productId}/${kycType} - ${error.message} (${duration}ms)`,
        error.stack
      );

      this.loggerService.logError(`[KYC] Failed to retrieve form`, {
        endpoint: "getProductData",
        productId,
        kycType,
        duration,
        error: error.message,
      });

      throw error;
    }
  }

  @Get("/countrylist/:kcClientId")
  @UseGuards(AuthenticationGuard)
  async getCountryList(
    @Param("kcClientId") productId: string
  ): Promise<Array<OptionDto>> {
    this.logger.log(`[KYC] GET /countrylist/${productId}`);

    try {
      const countryList = await this.kycService.getCountryList(productId);

      this.logger.log(
        `[KYC] GET /countrylist/${productId} - Success (${countryList.length} countries)`
      );

      return countryList;
    } catch (error) {
      this.logger.error(
        `[KYC ERROR] GET /countrylist/${productId} - ${error.message}`,
        error.stack
      );

      this.loggerService.logError(`[KYC] Failed to retrieve countries`, {
        endpoint: "getCountryList",
        productId,
        error: error.message,
      });

      throw error;
    }
  }

  @Post("/form/:kcClientId/:kycType/:applicationId")
  @UseGuards(AuthenticationGuard)
  async sendFormAnswers(
    @Param("kcClientId") productId: string,
    @Param("kycType") kycType: string,
    @Param("applicationId") applicationId: string,
    @Body() payload: FormAnswersDto
  ) {
    const startTime = Date.now();

    this.logger.log(
      `[KYC SUBMISSION] ${applicationId} | ${payload.organizationNumber} | ${payload.userId}`
    );

    this.loggerService.logDebug(`[KYC] Application submission started`, {
      endpoint: "sendFormAnswers",
      applicationId,
      productId,
      kycType,
      payload,
    });

    try {
      const apiPath = "answers";
      const response = await this.kycService.sendFormData(payload, apiPath);

      const duration = Date.now() - startTime;

      this.logger.log(
        `[KYC SUCCESS] ${applicationId} submitted (${duration}ms)`
      );

      this.loggerService.logDebug(`[KYC] Application submitted successfully`, {
        endpoint: "sendFormAnswers",
        applicationId,
        productId,
        kycType,
        duration,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error(
        `[KYC ERROR] ${applicationId} submission failed - ${error.message} (${duration}ms)`,
        error.stack
      );

      this.loggerService.logError(`[KYC] Application submission failed`, {
        endpoint: "sendFormAnswers",
        applicationId,
        productId,
        kycType,
        duration,
        payload,
        error: {
          message: error.message,
          stack: error.stack,
          status: error.status,
        },
      });

      throw error;
    }
  }
}
