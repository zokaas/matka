import { Type } from "class-transformer";
import { IsString, IsArray, ValidateNested, IsNumber } from "class-validator";
import { ApiQuestionComponentDto } from "./api-question-component.dto";
import { FormHeaderDto } from "../shared";
import { ApiProductDto } from "./api-product.dto";
export class ApiFormDto {
  @IsNumber()
  id: number;

  @IsString()
  documentId: string;

  @IsString()
  formName: string;

  @IsString()
  formType: string;

  @ValidateNested()
  @Type(() => FormHeaderDto)
  formHeader: FormHeaderDto;

  @ValidateNested()
  @Type(() => ApiProductDto)
  product: ApiProductDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiQuestionComponentDto)
  setOfQuestions: ApiQuestionComponentDto[];

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  publishedAt: string;
}
