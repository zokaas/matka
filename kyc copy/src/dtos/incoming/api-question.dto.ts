import { Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from "class-validator";
import { DynamicFieldDto, ErrorMessageDto, OptionDto } from "../shared";

export class ApiQuestionDto {
  @IsNumber()
  id: number;

  @IsString()
  documentId: string;

  @IsString()
  questionParameter: string;

  @IsString()
  questionLabel: string;

  @IsString()
  componentType: string;

  @IsOptional()
  @IsString()
  placeholder?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options?: OptionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ErrorMessageDto)
  errorMessages: ErrorMessageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicFieldDto)
  dynamicField: DynamicFieldDto[];

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  publishedAt: string;
}
