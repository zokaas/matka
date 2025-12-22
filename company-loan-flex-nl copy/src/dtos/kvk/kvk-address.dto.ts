import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { KvkDomesticAddress } from "./kvk-domestic-address.dto";
import { KvkForeignAddressDto } from "./kvk-foreign-address.dto";

export class KvkAddressDto {
  @ValidateNested()
  @Type(() => KvkDomesticAddress)
  @IsOptional()
  binnenlandsAdres?: KvkDomesticAddress;

  @ValidateNested()
  @Type(() => KvkForeignAddressDto)
  @IsOptional()
  buitenlandsAdres?: KvkForeignAddressDto;
}
