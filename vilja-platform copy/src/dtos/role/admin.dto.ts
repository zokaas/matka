import { IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AddressDto } from "./address.dto";

export class AdminDto {
  @IsString()
  smeId: string;

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

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  email: string;

  @IsString()
  phone: string;
}
