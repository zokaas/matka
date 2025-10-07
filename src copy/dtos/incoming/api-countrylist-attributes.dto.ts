import { IsString } from "class-validator";

export class CountrylistAttributesDto {
  @IsString()
  fi: string;

  @IsString()
  nl: string;

  @IsString()
  en: string;

  @IsString()
  se: string;
}
