import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";
import { CountryAttributesDto } from "./api-country-attributes.dto";

export class CountryDataDto {
  @IsNumber()
  id: number;

  @ValidateNested()
  @Type(() => CountryAttributesDto)
  attributes: CountryAttributesDto;
}
