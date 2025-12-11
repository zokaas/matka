import { IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { OptionDto } from "./option.dto";

export class PepOptionsDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @ValidateNested()
  @Type(() => OptionDto)
  yes: OptionDto;

  @ValidateNested()
  @Type(() => OptionDto)
  no: OptionDto;
}
