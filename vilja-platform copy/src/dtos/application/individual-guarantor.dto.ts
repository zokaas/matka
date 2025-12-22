import { Type } from "class-transformer";
import {
  Equals,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { AddressDto } from "../role/address.dto";

export class IndividualGuarantorDto {
  @IsString()
  @Equals("INDIVIDUAL_GUARANTOR")
  guarantorType: string;

  @IsString()
  // Should we have check that there are CCYYMMDDNNNN, CCYYMMDD[-,A,B,C,D,E,F]NNNN, CCYYMMDD-string (in NL case)
  reference: string;

  @IsString()
  @IsIn(["SSN", "OTHERS"])
  referenceType: string;

  @IsString()
  givenName: string;

  @IsString()
  surname: string;

  @IsString()
  birthDate: string;

  @IsString()
  mobilePhone: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
