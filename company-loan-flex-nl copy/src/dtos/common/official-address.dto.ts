import { IsOptional, IsString } from "class-validator";

export class OfficialAddressDto {
  @IsString()
  city: string;

  @IsString()
  streetAddress: string;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  buildingName: string;

  @IsOptional()
  @IsString()
  supplementaryStreetAddress: string;
}
