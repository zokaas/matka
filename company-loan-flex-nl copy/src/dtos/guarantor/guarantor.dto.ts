import { Type } from "class-transformer";
import { IsEmail, IsString, ValidateNested } from "class-validator";
import { OfficialAddressDto } from "../common";

export class GuarantorDto {
  @IsString()
  boardMemberRole: string;

  @IsString()
  smeId: string;

  @IsString()
  reference: string;

  @IsString()
  referenceType: string;

  @IsString()
  givenName: string;

  @IsString()
  preferredName: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  birthDate: string;

  @ValidateNested()
  @Type(() => OfficialAddressDto)
  address: OfficialAddressDto;
}
