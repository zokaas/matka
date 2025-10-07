import { Type } from "class-transformer";
import {
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { ApiQuestionWrapperDto } from "./api-question-wrapper.dto";

export class ApiQuestionComponentDto {
  @IsNumber()
  id: number;
  @IsNumber()
  step: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ApiQuestionWrapperDto)
  questions_se?: ApiQuestionWrapperDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ApiQuestionWrapperDto)
  questions_fi?: ApiQuestionWrapperDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ApiQuestionWrapperDto)
  questions_nl?: ApiQuestionWrapperDto;
}
