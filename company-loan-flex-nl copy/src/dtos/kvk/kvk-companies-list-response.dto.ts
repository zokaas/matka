import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { KvkCompanyDataDto } from "./kvk-company-data.dto";

export class KvkCompaniesListResponseDto {
  @IsOptional()
  @IsNumber()
  pagina?: number;

  @IsOptional()
  @IsNumber()
  resultatenPerPagina?: number;

  @IsOptional()
  @IsNumber()
  totaal?: number;

  @IsOptional()
  @IsString()
  vorige?: string;

  @IsOptional()
  @IsString()
  volgende?: string;

  @ValidateNested()
  @Type(() => KvkCompanyDataDto)
  @IsArray({ each: true })
  @IsOptional()
  resultaten?: Array<KvkCompanyDataDto>;

  //_links?: components["schemas"]["Links"];
  /*
    Links: {
        [key: string]: components["schemas"]["Link"];
    };
   */
}
