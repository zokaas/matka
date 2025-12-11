import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { DynamicFieldDto } from "./dynamic-field.dto";
import { Type } from "class-transformer";
import { OptionDto } from "./option.dto";
import { ErrorMessageDto } from "./error-message.dto";

export class DependentQuestionDto extends DynamicFieldDto {
  @IsString()
  __component: "kyc.dependent-question";

  @IsNumber()
  conditionValue: number;

  @IsString()
  questionLabel: string;

  @IsString()
  componentType: string;

  @IsOptional()
  @IsBoolean()
  automaticAnalysis: boolean;

  @IsOptional()
  @IsString()
  automaticAnalysisType?: string | null;

  @IsOptional()
  @IsBoolean()
  calculateAnswer: boolean | null;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsString()
  questionParameter: string | null;

  @IsString()
  hiddenInputQuestionParameter: string | null;

  @IsOptional()
  @IsString()
  questionDescription?: string;

  @IsOptional()
  options?: Array<OptionDto>;

  @IsOptional()
  @IsBoolean()
  useCountryList?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ErrorMessageDto)
  errorMessages: Array<ErrorMessageDto>;
}
