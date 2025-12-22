import { IsNumber, IsOptional, IsString } from "class-validator";

export class DynamicFieldsCompanyInfoDto {
  @IsOptional()
  @IsString()
  foundationDate: string;

  @IsOptional()
  @IsString()
  registrationDate: string;

  @IsOptional()
  @IsString()
  legalForm: string;

  @IsOptional()
  @IsString()
  companyStreet: string;

  @IsOptional()
  @IsString()
  companyCity: string;

  @IsOptional()
  @IsString()
  companyPostalCode: string;

  @IsOptional()
  @IsString()
  companyCountry: string;

  @IsOptional()
  @IsString()
  companyHouseNumber: string;

  @IsOptional()
  @IsNumber()
  turnover: number;
}
