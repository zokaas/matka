import { IsBoolean, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { DynamicFieldDto } from "./dynamic-field.dto";
import { PepOptionsDto } from "./pep-options.dto";

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
  addBObutton: string;

  @IsNumber()
  boMaxCount: number;

  @IsString()
  namePlaceholder: string;

  @IsString()
  ssnPlaceholder?: string;

  @IsString()
  ownershipPlaceholder: string;

  @IsString()
  countryPlaceholder: string;

  @IsString()
  pepParameter: string;

  @IsString()
  pepQuestion: string;

  @ValidateNested()
  @Type(() => PepOptionsDto)
  pepOptions: PepOptionsDto;
}