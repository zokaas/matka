import { Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { DynamicFieldDto, ErrorMessageDto, OptionDto } from "../shared";

export class ApiQuestionDto {
  @IsNumber()
  id: number;

  @IsString()
  documentId: string;

  @IsString()
  questionParameter: string | null;

  @IsOptional()
  @IsString()
  hiddenInputQuestionParameter: string | null;

  @IsString()
  questionLabel: string;

  @IsString()
  componentType: string;

  @IsOptional()
  @IsBoolean()
  calculateAnswer?: boolean | null;

  @IsBoolean()
  automaticAnalysis: boolean;

  @IsOptional()
  @IsString()
  automaticAnalysisType?: string | null;

  @IsOptional()
  @IsString()
  placeholder?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options?: Array<OptionDto>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ErrorMessageDto)
  errorMessages: Array<ErrorMessageDto>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicFieldDto)
  dynamicField: Array<DynamicFieldDto>;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  publishedAt: string;
}
