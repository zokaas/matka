import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { LinkDto } from "./vp-response-link.dto";

export class LinksDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LinkDto)
  self: LinkDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LinkDto)
  first: LinkDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LinkDto)
  prev: LinkDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LinkDto)
  next: LinkDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LinkDto)
  last: LinkDto;
}
