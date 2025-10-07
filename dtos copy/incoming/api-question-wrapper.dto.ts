import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { ApiQuestionDto } from "./api-question.dto";

export class ApiQuestionWrapperDto {
  @ValidateNested()
  @Type(() => ApiQuestionDataDto)
  data: ApiQuestionDataDto;
}

export class ApiQuestionDataDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ApiQuestionDto)
  attributes: ApiQuestionDto;
}
