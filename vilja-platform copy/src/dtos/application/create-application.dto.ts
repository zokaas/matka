import {
  Equals,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

import { Type } from "class-transformer";
import { GuaranteeDto } from "./guarantee.dto";

export class CreateApplicationDto {
  @IsString()
  appliedProductId: string;

  @Equals("WEB")
  applicationChannel: string;

  @IsIn(["TOP_UP"])
  applicationCategory: string;

  @IsString()
  smeId: string;

  @IsInt()
  desiredAmount: number;

  @IsOptional()
  @IsObject()
  extras: Record<string, unknown>;

  @ValidateNested()
  @Type(() => Array<GuaranteeDto>)
  guarantees: Array<GuaranteeDto>;
}
