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
import { OptionDto, KycFormDto, FormAnswersDto, ApiFormDto } from "./dtos";
import { KycResponseTransformInterceptor } from "./interceptors";

@Controller("kyc")
export class KycController {
  private readonly logger = new Logger(KycController.name);
  constructor(private readonly kycService: KycService) {}

  @Get("/form/:kcClientId/:kycType")
  // @UseGuards(AuthenticationGuard)
  @UseInterceptors(KycResponseTransformInterceptor)
  async getProductData(
    @Param("kcClientId") productId: string,
    @Param("kycType") kycType: string
  ): Promise<ApiFormDto> {
    this.logger.log(
      `\nname = getKycForm \nproductId = ${productId}; \nkycType = ${kycType}; \n`
    );
    const productData = await this.kycService.getProductData(
      productId,
      kycType
    );
    this.logger.log(productData);
    return productData;
  }

  @Get("/countrylist/:kcClientId")
  // @UseGuards(AuthenticationGuard)
  async getCountryList(
    @Param("kcClientId") productId: string
  ): Promise<Array<OptionDto>> {
    const countryList: Array<OptionDto> =
      await this.kycService.getCountryList(productId);
    return countryList;
  }

  @Post("/form/:kcClientId/:kycType/:applicationId")
  // @UseGuards(AuthenticationGuard)
  async sendFormAnswers(@Body() payload: FormAnswersDto) {
    const apiPath = "answers";
    const response = await this.kycService.sendFormData(payload, apiPath);
    this.logger.log(response);
    return response;
  }
}