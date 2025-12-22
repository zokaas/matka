import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { DynamicFieldsCompanyInfoDto } from "./dynamic-fields-company-info.dto";
import { DynamicFieldsMarketingInfoDto } from "./dynamic-fields-marketing-info.dto";
import { DynamicFieldsApplicationInfoDto } from "./dynamic-fields-application-info.dto";

export class DynamicFieldsDto {
  @ValidateNested()
  @Type(() => DynamicFieldsCompanyInfoDto)
  companyInfo: DynamicFieldsCompanyInfoDto;

  @ValidateNested()
  @Type(() => DynamicFieldsMarketingInfoDto)
  marketingInfo: DynamicFieldsMarketingInfoDto;

  @ValidateNested()
  @Type(() => DynamicFieldsApplicationInfoDto)
  applicationInfo: DynamicFieldsApplicationInfoDto;
}
