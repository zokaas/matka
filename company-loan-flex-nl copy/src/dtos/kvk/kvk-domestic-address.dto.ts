import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class KvkDomesticAddress {
  @IsOptional()
  @IsString()
  @IsIn(["schemas", "AdresType"])
  type?: string;

  @IsOptional()
  @IsString()
  straatnaam?: string;

  @IsOptional()
  @IsNumber()
  huisnummer?: number;

  @IsOptional()
  @IsString()
  huisletter?: string;

  @IsOptional()
  @IsNumber()
  postbusnummer?: number;

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  @IsString()
  plaats?: string;
}
