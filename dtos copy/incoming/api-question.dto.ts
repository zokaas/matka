import { Type } from "class-transformer";
import { IsString, IsOptional, IsArray, ValidateNested } from "class-validator";
import { DynamicFieldDto, OptionDto } from "../shared";
import { ApiErrorMessageWrapperDto } from "./api-error-message-wrapper.dto";

export class ApiQuestionDto {
  @IsString()
  questionParameter: string;

  @IsString()
  questionLabel: string;

  @IsString()
  componentType: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsArray()
  options?: Array<OptionDto>;

  @IsOptional()
  @ValidateNested()
  @Type(() => ApiErrorMessageWrapperDto)
  errorMessages: ApiErrorMessageWrapperDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicFieldDto)
  dynamicField: DynamicFieldDto[];
}
