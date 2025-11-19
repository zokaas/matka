import { Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { BeneficialOwnerDto, CountryOptionsDto, DependentQuestionDto, DynamicFieldDto, DynamicFieldUnion, ErrorMessageDto, InfoDto, OptionDto } from "../shared";

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
  @Type(() => DynamicFieldDto, {
    discriminator: {
      property: "__component",
      subTypes: [
        { value: DependentQuestionDto, name: "kyc.dependent-question" },
        { value: InfoDto,             name: "kyc.info" },
        { value: BeneficialOwnerDto,  name: "kyc.beneficial-owner" },
        { value: CountryOptionsDto,   name: "kyc.country-options" },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  dynamicField: Array<DynamicFieldUnion>;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  publishedAt: string;
}