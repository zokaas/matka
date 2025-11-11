import { IsBoolean, IsOptional, IsString } from "class-validator";
import { DynamicFieldDto } from "./dynamic-field.dto";

export class BeneficialOwnerDto extends DynamicFieldDto {
  @IsString()
  __component: "kyc.beneficial-owner";

  @IsString()
  nameParameter: string;

  @IsString()
  nameQuestion: string;

  @IsString()
  ssnParameter: string;

  @IsString()
  ssnQuestion: string;

  @IsString()
  ownershipParameter: string;

  @IsString()
  ownershipQuestion: string;

  @IsString()
  countryParameter: string;

  @IsString()
  countryQuestion: string;

  @IsBoolean()
  useCountryList: boolean;

  @IsString()
  countryListLang: string;

  @IsString()
  addBObutton: string;

  @IsOptional()
  @IsString()
  namePlaceholder?: string;

  @IsOptional()
  @IsString()
  ssnPlaceholder?: string;

  @IsOptional()
  @IsString()
  ownershipPlaceholder?: string;

  @IsOptional()
  @IsString()
  countryPlaceholder?: string;
}
