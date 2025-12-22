import { IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { LinksDto } from "./vp-response-links.dto";
import { EmbeddedDataDto } from "./embedded-data.dto";
export class VpResponseTransactionsDto {
  @IsOptional()
  @IsNumber()
  currentPage: number;

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LinksDto)
  _links: LinksDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmbeddedDataDto)
  _embedded: EmbeddedDataDto;
}
