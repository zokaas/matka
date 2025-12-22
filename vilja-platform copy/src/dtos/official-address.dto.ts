import { IsOptional, IsString } from "class-validator";

export class OfficialAddressDto {
  @IsOptional()
  @IsString()
  streetAddress: string;

  @IsOptional()
  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  city: string;
}
