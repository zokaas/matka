import { IsIn, IsOptional, IsString } from "class-validator";

export class KvkForeignAddressDto {
  @IsOptional()
  @IsString()
  @IsIn(["schemas", "AdresType"])
  type?: string;

  @IsOptional()
  @IsString()
  straatHuisnummer?: string;

  @IsOptional()
  @IsString()
  postcodeWoonplaats?: string;

  @IsOptional()
  @IsString()
  land?: string;
}
