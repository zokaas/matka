import { IsArray, ValidateNested } from "class-validator";
import { PreconditionDto } from "./precondition.dto";
import { Type } from "class-transformer";

export class PreconditionsDto {
  @IsArray()
  @ValidateNested()
  @Type(() => PreconditionDto)
  precondition: Array<PreconditionDto>;
}
