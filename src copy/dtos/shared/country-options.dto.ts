import { IsBoolean, IsOptional, IsString } from "class-validator";
import { DynamicFieldDto } from "./dynamic-field.dto";

export class CountryOptionsDto extends DynamicFieldDto {
  @IsString()
  __component: "kyc.country-options";

  @IsOptional()
  @IsBoolean()
  useCountryList?: boolean;

  @IsOptional()
  @IsString()
  countryListLang?: string;
}
