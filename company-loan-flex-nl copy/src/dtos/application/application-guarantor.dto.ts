import { Type } from "class-transformer";
import { IsIn, IsOptional, IsString, ValidateNested } from "class-validator";
import { OfficialAddressDto } from "../common";

export class ApplicationGuarantorDto {
  @IsString()
  guarantorType: string;

  @IsString()
  reference: string;

  @IsString()
  referenceType: string;

  @IsString()
  givenName: string;

  @IsString()
  surname: string;

  @IsString()
  birthDate: string;

  @IsString()
  email: string;

  @IsString()
  mobilePhone: string;

  @ValidateNested()
  @Type(() => OfficialAddressDto)
  address: OfficialAddressDto;

  @IsOptional()
  @IsString()
  preferredName: string;

  @IsOptional()
  @IsString()
  nationality: string;

  @IsOptional()
  @IsString()
  selfAssessedPEP: string;

  @IsOptional()
  @IsString()
  selfAssessedPepDescription: string;

  @IsOptional()
  @IsString()
  @IsIn(["NOT_PEP", "PEP"])
  externalPepStatus: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  createTime: string;

  @IsOptional()
  @IsString()
  updateTime: string;
}
