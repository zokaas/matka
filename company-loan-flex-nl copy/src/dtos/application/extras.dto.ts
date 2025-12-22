import { IsOptional, IsString } from "class-validator";

export class ExtrasDto {
  //company
  @IsOptional()
  @IsString()
  companyCity: string;

  @IsOptional()
  @IsString()
  companyCountry: string;

  @IsOptional()
  @IsString()
  companyHouseNumber: string;

  @IsOptional()
  @IsString()
  companyPostalCode: string;

  @IsOptional()
  @IsString()
  companyStreet: string;
  @IsOptional()
  @IsString()
  foundationDate: string;

  @IsOptional()
  @IsString()
  legalForm: string;

  @IsOptional()
  @IsString()
  registrationDate: string;

  @IsOptional()
  @IsString()
  turnover: string;

  // marketing
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
  @IsString()
  allowMarketing: string;

  // application
  @IsOptional()
  @IsString()
  suggestedFlow: string;

  @IsOptional()
  @IsString()
  suggestionMessage: string;

  @IsOptional()
  @IsString()
  externalReference: string;

  @IsOptional()
  @IsString()
  campaignCode: string;

  @IsOptional()
  @IsString()
  clientApplicationId: string;

  @IsString()
  applicationNumber: string;

  @IsOptional()
  @IsString()
  clientIP: string;

  @IsOptional()
  @IsString()
  creditCheck: string;

  @IsOptional()
  @IsString()
  creditApprovedDate: string;

  @IsOptional()
  @IsString()
  consentGiven: string;

  @IsOptional()
  @IsString()
  intermediaryEmail: string;

  @IsOptional()
  @IsString()
  intermediaryPhoneNumber: string;
}
