import { IsInt, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { QuestionAttributesDto } from "./question-attributes.dto";

export class QuestionDto {
  @IsInt()
  id: number;

  @IsObject()
  @ValidateNested()
  @Type(() => QuestionAttributesDto)
  question: QuestionAttributesDto;
}
