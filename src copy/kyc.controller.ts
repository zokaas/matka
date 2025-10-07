import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { KycService } from "./kyc.service";
import { AuthenticationGuard } from "@opr-finance/authentication";
import { OptionDto, KycFormDto } from "./dtos";

@Controller("kyc")
export class KycController {
  private readonly logger = new Logger(KycController.name);
  constructor(private readonly kycService: KycService) {}

  @Get("/form/:kcClientId/:kycType")
  // @UseGuards(AuthenticationGuard)
  async getProductData(
    @Param("kcClientId") productId: string,
    @Param("kycType") kycType: string
  ) {
    this.logger.log(
      `\nname = getKycForm \nproductId = ${productId}; \nkycType = ${kycType}; \n`
    );
    const productData: KycFormDto = await this.kycService.getProductData(
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
  async sendFormAnswers(
    // TODO: DTO needed!
    @Body() payload,
    @Param("kcClientId") productId: string,
    @Param("kycType") kycType: string,
    @Param("applicationId") applicationId: string
  ) {
    const apiPath = `/answers/${productId}/${kycType}/${applicationId}`;

    const response = await this.kycService.sendFormData(payload, apiPath);
    this.logger.log(response);
    return response;
  }
}
