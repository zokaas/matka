import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { DynamicFieldsDto } from "./dynamic-fields.dto";
import { ExtrasDto } from "./extras.dto";
import { GuaranteesDto } from "./guarantees.dto";

export class ApplicationDto {
  @IsOptional()
  @IsString()
  applicationChannel: string;

  @IsOptional()
  @IsString()
  appliedProductId: string;

  @IsOptional()
  @IsString()
  desiredAmount: string;

  @ValidateNested()
  @Type(() => DynamicFieldsDto)
  dynamicFields: DynamicFieldsDto;

  @ValidateNested()
  @Type(() => ExtrasDto)
  extras: ExtrasDto;

  @IsOptional()
  @IsString()
  smeId: string;

  @IsOptional()
  @IsString()
  statementChannel: string;

  @IsOptional()
  @IsString()
  @IsIn(["APPROVED", "REJECTED", "INCOMPLETE", "REFERRAL"])
  actualDecision?: string;

  @IsOptional()
  @IsString()
  @IsIn(["APPROVED", "REJECTED", "INCOMPLETE", "REFERRAL"])
  suggestion?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => GuaranteesDto)
  guarantees: Array<GuaranteesDto>;
}
