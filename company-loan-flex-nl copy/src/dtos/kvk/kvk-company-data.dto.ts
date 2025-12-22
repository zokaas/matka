import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { KvkAddressDto } from "./kvk-address.dto";

export class KvkCompanyDataDto {
  @IsOptional()
  @IsString()
  kvkNummer?: string;

  @IsOptional()
  @IsString()
  rsin?: string;

  @IsOptional()
  @IsString()
  vestigingsnummer?: string;

  @IsOptional()
  @IsString()
  naam?: string;

  @ValidateNested()
  @Type(() => KvkAddressDto)
  @IsOptional()
  adres?: KvkAddressDto;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  actief?: string;

  @IsOptional()
  @IsString()
  vervallenNaam?: string;

  //_links?: components["schemas"]["Links"];
  /*
    Links: {
        [key: string]: components["schemas"]["Link"];
    };
   */
}
