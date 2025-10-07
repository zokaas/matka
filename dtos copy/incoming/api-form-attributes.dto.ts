import { Type } from "class-transformer";
import { IsString, IsArray, ValidateNested } from "class-validator";
import { ApiProductWrapperDto } from "./api-product-wrapper.dto";
import { ApiQuestionComponentDto } from "./api-question-component.dto";
import { FormHeaderDto } from "../shared";

export class ApiFormDto {
  @IsString()
  formName: string;

  @IsString()
  formType: string;

  @ValidateNested()
  @Type(() => FormHeaderDto)
  formHeader: FormHeaderDto;

  @ValidateNested()
  @Type(() => ApiProductWrapperDto)
  product: ApiProductWrapperDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiQuestionComponentDto)
  setOfQuestions: ApiQuestionComponentDto[];
}
