import { IsOptional, IsString } from "class-validator";
import { OfficialAddressDto } from "../official-address.dto";

export class AddressDto extends OfficialAddressDto {
  @IsOptional()
  @IsString()
  supplementaryStreetAddress: string;

  @IsOptional()
  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  coAddress: string;

  @IsOptional()
  @IsString()
  apartmentNumber: string;

  @IsOptional()
  @IsString()
  propertyNumber: string;

  @IsOptional()
  @IsString()
  buildingName: string;

  @IsOptional()
  @IsString()
  floorNumber: string;

  @IsOptional()
  @IsString()
  complementingInformation: string;
}
