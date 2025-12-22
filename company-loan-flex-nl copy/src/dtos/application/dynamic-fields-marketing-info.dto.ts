import { IsBoolean, IsOptional, IsString } from "class-validator";

export class DynamicFieldsMarketingInfoDto {
  @IsOptional()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  subsource: string;

  @IsOptional()
  @IsString()
  redirectId: string;

  @IsOptional()
  @IsBoolean()
  allowMarketing: boolean;
}
