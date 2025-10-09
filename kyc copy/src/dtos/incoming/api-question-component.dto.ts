import { Type } from "class-transformer";
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ApiQuestionDto } from "./api-question.dto";

export class ApiQuestionComponentDto {
  @IsString()
  __component: string;

  @IsNumber()
  id: number;

  @IsNumber()
  step: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ApiQuestionDto)
  questions_se?: ApiQuestionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ApiQuestionDto)
  questions_fi?: ApiQuestionDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ApiQuestionDto)
  questions_nl?: ApiQuestionDto;
}
