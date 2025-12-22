import { Type } from "class-transformer";
import { IsEmail, IsString, ValidateNested } from "class-validator";
import { OfficialAddressDto } from "../common";
import { SignatoriesDto } from "./signatories.dto";

export class SmeDto {
  @IsString()
  companyName: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => OfficialAddressDto)
  officialAddress: OfficialAddressDto;

  @IsString()
  organizationCountryCode: string;

  @IsString()
  organizationNumber: string;

  @IsString()
  phone: string;

  @ValidateNested()
  @Type(() => SignatoriesDto)
  signatories: SignatoriesDto;

  @IsString()
  legalForm: string;

  @IsString()
  establishmentDate: string;
}
