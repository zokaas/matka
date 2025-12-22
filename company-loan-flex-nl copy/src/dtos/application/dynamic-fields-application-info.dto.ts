import { IsBoolean, IsOptional, IsString } from "class-validator";

export class DynamicFieldsApplicationInfoDto {
  @IsOptional()
  @IsString()
  intermediaryEmail: string;

  @IsOptional()
  @IsString()
  intermediaryPhoneNumber: string;

  @IsOptional()
  @IsString()
  campaignCode: string;

  @IsOptional()
  @IsString()
  clientApplicationId: string;

  @IsOptional()
  @IsString()
  applicationNumber: string;

  @IsOptional()
  @IsString()
  clientIP: string;

  @IsOptional()
  @IsBoolean()
  creditCheck: boolean;

  @IsOptional()
  @IsBoolean()
  consentGiven: boolean;

  @IsOptional()
  @IsString()
  creditApprovedDate: string;

  @IsOptional()
  @IsString()
  externalReference: string;

  @IsOptional()
  @IsString()
  suggestedFlow: string;

  @IsOptional()
  @IsString()
  suggestionMessage: string;
}
